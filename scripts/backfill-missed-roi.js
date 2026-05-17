/**
 * Backfill script to credit all missed ROI from investment start date until today
 * Usage: node scripts/backfill-missed-roi.js
 * 
 * This script:
 * 1. Finds all active investments
 * 2. Calculates total days since investment started
 * 3. Calculates how much ROI should have been credited
 * 4. Credits any missing ROI to user balances
 * 5. Generates a detailed report
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to send profit notification emails via API
async function sendProfitNotificationEmail(userEmail, userName, planName, profitAmount, newBalance) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    console.log(`[EmailNotification] Sending backfill profit notification to ${userEmail}...`);
    
    try {
      const response = await fetch(`${apiUrl}/api/notify/profit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          userName,
          planName,
          roiAmount: parseFloat(profitAmount.toFixed(2)),
          bonusAmount: 0,
          newBalance: parseFloat(newBalance.toFixed(2))
        })
      });
      
      if (!response.ok) {
        console.warn(`[EmailNotification] API endpoint failed: ${response.status}`);
      } else {
        const result = await response.json();
        console.log(`[EmailNotification] ✅ Backfill email sent successfully`);
      }
    } catch (fetchError) {
      console.warn(`[EmailNotification] Could not connect to API endpoint: ${fetchError.message}`);
      console.log('[EmailNotification] Profit notification skipped (email service unavailable)');
    }
  } catch (error) {
    console.error(`[EmailNotification] Error: ${error.message}`);
  }
}

// Investment plan configurations
const PLAN_CONFIG = {
  '3-Day Plan': { durationDays: 3, dailyRate: 0.10, bonus: 0.05 },
  '7-Day Plan': { durationDays: 7, dailyRate: 0.10, bonus: 0.075 },
  '12-Day Plan': { durationDays: 12, dailyRate: 0.03, bonus: 0.09 },
  '15-Day Plan': { durationDays: 15, dailyRate: 0.035, bonus: 0.105 },
  '3-Month Plan': { durationDays: 90, dailyRate: 0.04, bonus: 0.12 },
  '6-Month Plan': { durationDays: 180, dailyRate: 0.045, bonus: 0.135 }
};

/**
 * Calculate missed ROI for an investment
 */
function calculateMissedROI(investment) {
  const planConfig = PLAN_CONFIG[investment.plan];
  if (!planConfig) {
    return {
      error: `Unknown plan: ${investment.plan}`,
      missedDays: 0,
      missedROI: 0,
      alreadyCredited: investment.creditedRoi || 0
    };
  }

  // Calculate start date
  const startDate = investment.startDate ? new Date(investment.startDate) : new Date(investment.date);
  const today = new Date();

  // Calculate total days elapsed
  const totalDaysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  // Determine how many days should have been credited
  let daysToCredit = totalDaysElapsed;
  if (totalDaysElapsed >= planConfig.durationDays) {
    daysToCredit = planConfig.durationDays;
  }

  // Calculate total ROI that should have been credited by now
  const expectedTotalROI = investment.capital * planConfig.dailyRate * daysToCredit;

  // Calculate what was already credited
  const alreadyCredited = investment.creditedRoi || 0;

  // Calculate missed amount
  const missedROI = Math.max(0, expectedTotalROI - alreadyCredited);
  const missedDays = Math.max(0, daysToCredit - Math.floor(alreadyCredited / (investment.capital * planConfig.dailyRate)));

  // Check if investment is completed
  const isCompleted = totalDaysElapsed >= planConfig.durationDays;
  const bonus = isCompleted ? investment.capital * planConfig.bonus : 0;

  return {
    startDate,
    today,
    totalDaysElapsed,
    daysToCredit,
    expectedTotalROI: expectedTotalROI.toFixed(2),
    alreadyCredited: alreadyCredited.toFixed(2),
    missedROI: missedROI.toFixed(2),
    missedDays,
    isCompleted,
    bonus: bonus.toFixed(2),
    error: null
  };
}

/**
 * Backfill missed ROI for all investments
 */
async function backfillMissedROI() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🔄 BACKFILL MISSED ROI - Starting Process');
    console.log('='.repeat(80));
    console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

    // Fetch all active investments
    const { data: investments, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('status', 'Active');

    if (fetchError) {
      console.error('❌ Error fetching investments:', fetchError);
      return;
    }

    if (!investments || investments.length === 0) {
      console.log('ℹ️  No active investments found to process\n');
      return;
    }

    console.log(`📊 Found ${investments.length} active investments\n`);

    const report = {
      totalInvestments: investments.length,
      processedCount: 0,
      completedInvestments: [],
      creditedMissedROI: [],
      errors: [],
      totalsummary: {
        totalMissedROI: 0,
        totalUsersAffected: new Set(),
        totalMissedDays: 0
      }
    };

    // Process each investment
    for (const investment of investments) {
      try {
        const calculation = calculateMissedROI(investment);

        if (calculation.error) {
          console.warn(`⚠️  Investment ${investment.id}: ${calculation.error}`);
          report.errors.push({
            investmentId: investment.id,
            error: calculation.error
          });
          continue;
        }

        const missedROI = parseFloat(calculation.missedROI);
        const missedDays = calculation.missedDays;

        // Skip if no missed ROI
        if (missedROI <= 0 && !calculation.isCompleted) {
          console.log(`⏭️  Investment ${investment.id}: No missed ROI`);
          continue;
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('idnum', investment.idnum)
          .single();

        if (userError || !userData) {
          console.error(`❌ Investment ${investment.id}: Could not find user`);
          report.errors.push({
            investmentId: investment.id,
            error: 'User not found'
          });
          continue;
        }

        // Calculate new balance and bonus
        const totalBonus = calculation.isCompleted ? parseFloat(calculation.bonus) : 0;
        const totalCredit = missedROI + totalBonus;
        const newBalance = (userData.balance || 0) + totalCredit;
        const newBonus = (userData.bonus || 0) + totalBonus;

        // Update investment record
        await supabase
          .from('investments')
          .update({
            creditedRoi: calculation.expectedTotalROI,
            creditedBonus: calculation.isCompleted ? calculation.bonus : (investment.creditedBonus || 0),
            status: calculation.isCompleted ? 'completed' : 'Active',
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id);

        // Update user balance
        await supabase
          .from('users')
          .update({
            balance: newBalance,
            bonus: newBonus,
            updated_at: new Date().toISOString()
          })
          .eq('idnum', investment.idnum);

        // Send notification email
        if (missedROI > 0) {
          await sendProfitNotificationEmail(
            userData.email,
            userData.name || userData.userName || `User ${investment.idnum}`,
            investment.plan,
            missedROI,
            newBalance
          );
        }

        // Track in report
        if (calculation.isCompleted) {
          report.completedInvestments.push({
            investmentId: investment.id,
            userId: investment.idnum,
            userName: userData.name || userData.userName,
            plan: investment.plan,
            missedDays: calculation.daysToCredit,
            missedROI,
            bonusCredit: totalBonus,
            totalCredit,
            newBalance
          });
        } else if (missedROI > 0) {
          report.creditedMissedROI.push({
            investmentId: investment.id,
            userId: investment.idnum,
            userName: userData.name || userData.userName,
            plan: investment.plan,
            missedDays,
            missedROI,
            newBalance
          });
        }

        // Update summary
        report.totalsummary.totalMissedROI += totalCredit;
        report.totalsummary.totalUsersAffected.add(investment.idnum);
        report.totalsummary.totalMissedDays += missedDays;
        report.processedCount++;

        // Log result
        if (calculation.isCompleted) {
          console.log(`✅ Investment ${investment.id} COMPLETED:`);
          console.log(`   - Missed ROI: $${missedROI.toFixed(2)}`);
          console.log(`   - Bonus: $${totalBonus.toFixed(2)}`);
          console.log(`   - Total Credit: $${totalCredit.toFixed(2)}`);
          console.log(`   - New Balance: $${newBalance.toFixed(2)}`);
        } else {
          console.log(`💰 Investment ${investment.id}: Credited ${missedDays} missed days`);
          console.log(`   - Amount: $${missedROI.toFixed(2)}`);
          console.log(`   - New Balance: $${newBalance.toFixed(2)}`);
        }

      } catch (invError) {
        console.error(`❌ Error processing investment ${investment.id}:`, invError.message);
        report.errors.push({
          investmentId: investment.id,
          error: invError.message
        });
      }
    }

    // Print summary report
    console.log('\n' + '='.repeat(80));
    console.log('📋 BACKFILL SUMMARY REPORT');
    console.log('='.repeat(80));
    console.log(`\n📊 Statistics:`);
    console.log(`   Total Investments Processed: ${report.processedCount}`);
    console.log(`   Investments Completed: ${report.completedInvestments.length}`);
    console.log(`   Investments with Missed ROI: ${report.creditedMissedROI.length}`);
    console.log(`   Errors: ${report.errors.length}`);

    console.log(`\n💰 Financial Summary:`);
    console.log(`   Total Credit Amount: $${report.totalsummary.totalMissedROI.toFixed(2)}`);
    console.log(`   Unique Users Affected: ${report.totalsummary.totalUsersAffected.size}`);
    console.log(`   Total Missed Days Credited: ${report.totalsummary.totalMissedDays}`);

    if (report.completedInvestments.length > 0) {
      console.log(`\n✅ Completed Investments (${report.completedInvestments.length}):`);
      report.completedInvestments.forEach(inv => {
        console.log(`   - ${inv.investmentId} (User: ${inv.userId}) | ${inv.plan}`);
        console.log(`     ROI: $${inv.missedROI.toFixed(2)} | Bonus: $${inv.bonusCredit.toFixed(2)} | Total: $${inv.totalCredit.toFixed(2)}`);
      });
    }

    if (report.creditedMissedROI.length > 0) {
      console.log(`\n💳 Partial Credits (${report.creditedMissedROI.length}):`);
      report.creditedMissedROI.forEach(inv => {
        console.log(`   - ${inv.investmentId} (User: ${inv.userId}) | ${inv.plan}`);
        console.log(`     Days: ${inv.missedDays} | Amount: $${inv.missedROI.toFixed(2)}`);
      });
    }

    if (report.errors.length > 0) {
      console.log(`\n⚠️  Errors (${report.errors.length}):`);
      report.errors.forEach(err => {
        console.log(`   - ${err.investmentId}: ${err.error}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✨ Backfill process completed at: ${new Date().toISOString()}`);
    console.log('='.repeat(80) + '\n');

  } catch (err) {
    console.error('❌ Fatal error in backfill process:', err);
  }
}

// Run the backfill
backfillMissedROI();
