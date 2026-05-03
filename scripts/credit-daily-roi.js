import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createRequire } from 'module';

dotenv.config();
const require = createRequire(import.meta.url);
// Attempt to load emailService
let emailService;
try {
  const module = await import('../api/emailService.js');
  emailService = module.default;
} catch (e) {
  console.warn('Could not load emailService, emails will be skipped', e.message);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EMAIL_NOTIFICATIONS_ENABLED = process.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true';

// Investment plan configurations (should match the ones in planConfig.ts)
const PLAN_CONFIG = {
  '3-Day Plan': { durationDays: 3, dailyRate: 0.10, bonus: 0.05 },
  '7-Day Plan': { durationDays: 7, dailyRate: 0.10, bonus: 0.075 },
  '12-Day Plan': { durationDays: 12, dailyRate: 0.03, bonus: 0.09 },
  '15-Day Plan': { durationDays: 15, dailyRate: 0.035, bonus: 0.105 },
  '3-Month Plan': { durationDays: 90, dailyRate: 0.04, bonus: 0.12 },
  '6-Month Plan': { durationDays: 180, dailyRate: 0.045, bonus: 0.135 }
};

/**
 * Send ROI notification email
 */
async function sendROINotificationEmail(userEmail, userName, roiAmount, investmentPlan, currentBalance, totalEarnings) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) {
    console.log(`📧 Email notifications disabled. Would have sent ROI email to: ${userEmail}`);
    return;
  }
  
  if (emailService) {
    try {
      await emailService.sendRoiCredit(userEmail, userName, investmentPlan, roiAmount, currentBalance);
      console.log(`📧 ROI Email sent to ${userEmail}`);
    } catch (error) {
       console.error(`❌ ROI Email failed for ${userEmail}:`, error.message);
    }
  } else {
    console.log('Skipping email (service not loaded)');
  }
}


      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        subject: '💰 Daily ROI Credited - Cypher Vault',
        message: `Great news! Your daily ROI of $${roiAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from the ${investmentPlan} has been credited to your account. Total earnings so far: $${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Current balance: $${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        notification_type: 'success',
        app_name: 'Cypher Vault',
        year: new Date().getFullYear(),
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log(`✅ ROI notification email sent to ${userEmail}`);
    } else {
      console.log(`⚠️ EmailJS private key not configured. Skipping email for ${userEmail}`);
    }
  } catch (error) {
    console.error(`❌ Failed to send ROI notification email to ${userEmail}:`, error);
  }
}

/**
 * Send investment completion email
 */
async function sendInvestmentCompletionEmail(userEmail, userName, investmentPlan, totalROI, bonusAmount, currentBalance) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) {
    console.log(`📧 Email notifications disabled. Would have sent completion email to: ${userEmail}`);
    return;
  }

  try {
    if (EMAILJS_PRIVATE_KEY) {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      });

      const totalEarnings = totalROI + bonusAmount;
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        subject: '🎉 Investment Plan Completed - Cypher Vault',
        message: `Congratulations! Your ${investmentPlan} investment has completed successfully. Total ROI earned: $${totalROI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Bonus credited: $${bonusAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Total earnings: $${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Your new balance: $${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        notification_type: 'success',
        app_name: 'Cypher Vault',
        year: new Date().getFullYear(),
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log(`✅ Investment completion email sent to ${userEmail}`);
    } else {
      console.log(`⚠️ EmailJS private key not configured. Skipping email for ${userEmail}`);
    }
  } catch (error) {
    console.error(`❌ Failed to send completion email to ${userEmail}:`, error);
  }
}

async function creditDailyROI() {
  try {
    console.log('Starting daily ROI crediting process...');

    // Get all active investments
    const { data: activeInvestments, error: invError } = await supabase
      .from('investments')
      .select('*')
      .eq('status', 'Active')
      .or('authStatus.is.null,authStatus.eq.approved');

    if (invError) {
      console.error('Error fetching active investments:', invError);
      return;
    }

    if (!activeInvestments || activeInvestments.length === 0) {
      console.log('No active investments found to credit ROI');
      return;
    }

    console.log(`Found ${activeInvestments.length} active investments to process`);

    for (const investment of activeInvestments) {
      try {
        const planConfig = PLAN_CONFIG[investment.plan];
        if (!planConfig) {
          console.warn(`Unknown plan: ${investment.plan} for investment ${investment.id}`);
          continue;
        }

        // Calculate daily ROI amount
        const dailyRoiAmount = investment.capital * planConfig.dailyRate;

        // Check if investment is still within duration
        // Use startDate (approval date) if available, otherwise fall back to creation date
        const startDate = investment.startDate ? new Date(investment.startDate) : new Date(investment.date);
        const now = new Date();
        const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

        // Check if we already credited ROI today (compare dates)
        // Use startDate as baseline for crediting, not creation date
        const investmentStartDate = investment.startDate ? new Date(investment.startDate) : new Date(investment.date);
        const lastCreditDate = investment.updated_at ? new Date(investment.updated_at) : investmentStartDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastCreditDay = new Date(lastCreditDate);
        lastCreditDay.setHours(0, 0, 0, 0);

        if (lastCreditDay >= today) {
          console.log(`ROI already credited today for investment ${investment.id}`);
          continue;
        }

        if (daysElapsed >= planConfig.durationDays) {
          // Investment completed - credit all remaining ROI plus final bonus
          const totalExpectedRoi = investment.capital * planConfig.dailyRate * planConfig.durationDays;
          const remainingRoi = totalExpectedRoi - (investment.creditedRoi || 0);
          const finalBonus = investment.capital * planConfig.bonus;

          // Update investment as completed
          await supabase
            .from('investments')
            .update({
              status: 'completed',
              creditedRoi: totalExpectedRoi,
              creditedBonus: finalBonus,
              updated_at: new Date().toISOString()
            })
            .eq('id', investment.id);

          // Credit remaining ROI and bonus to user's balance
          const { data: userData } = await supabase
            .from('users')
            .select('balance, bonus, email, name, userName')
            .eq('idnum', investment.idnum)
            .single();

          if (userData) {
            const newBalance = (userData.balance || 0) + remainingRoi;
            const newBonus = (userData.bonus || 0) + finalBonus;

            await supabase
              .from('users')
              .update({
                balance: newBalance,
                bonus: newBonus,
                updated_at: new Date().toISOString()
              })
              .eq('idnum', investment.idnum);

            // Send investment completion email
            const userEmail = userData.email;
            const userName = userData.name || userData.userName;
            await sendInvestmentCompletionEmail(userEmail, userName, investment.plan, remainingRoi, finalBonus, newBalance);
          }

          console.log(`Completed investment ${investment.id}: Credited remaining ROI $${remainingRoi.toFixed(2)} and final bonus $${finalBonus.toFixed(2)}`);
          continue;
        }

        // Credit daily ROI for active investment
        await supabase
          .from('investments')
          .update({
            creditedRoi: (investment.creditedRoi || 0) + dailyRoiAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id);

        // Get user data for balance update
        const { data: userData } = await supabase
          .from('users')
          .select('balance, email, name, userName')
          .eq('idnum', investment.idnum)
          .single();

        if (userData) {
          const newBalance = (userData.balance || 0) + dailyRoiAmount;
          await supabase
            .from('users')
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('idnum', investment.idnum);

          // Send daily ROI notification email
          const userEmail = userData.email;
          const userName = userData.name || userData.userName;
          const totalEarnings = (investment.creditedRoi || 0) + dailyRoiAmount;
          await sendROINotificationEmail(userEmail, userName, dailyRoiAmount, investment.plan, newBalance, totalEarnings);
        }

        console.log(`Credited $${dailyRoiAmount.toFixed(2)} daily ROI for investment ${investment.id} (${investment.plan})`);

      } catch (invProcessError) {
        console.error(`Error processing investment ${investment.id}:`, invProcessError);
      }
    }

    console.log('Daily ROI crediting process completed successfully');

  } catch (err) {
    console.error('Script error:', err);
  }
}

// Run the daily ROI crediting
creditDailyROI();