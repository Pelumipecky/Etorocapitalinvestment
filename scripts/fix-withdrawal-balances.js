
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or Key in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deductPastWithdrawals() {
  console.log('🔄 Starting backfill of withdrawal deductions...');

  // 1. Get all users
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, idnum, email, balance, userName');

  if (userError) {
    console.error('❌ Error fetching users:', userError);
    return;
  }

  // 2. Get all withdrawals that represent money leaving (Not Rejected)
  // We exclude withdrawals created in the last 1 hour to avoid double-deducting 
  // the ones created after the recent "fix" was deployed.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: withdrawals, error: withdrawalError } = await supabase
    .from('withdrawals')
    .select('*')
    .neq('status', 'Rejected')
    .neq('status', 'rejected')
    .lt('created_at', oneHourAgo); // Only touch old ones

  if (withdrawalError) {
    console.error('❌ Error fetching withdrawals:', withdrawalError);
    return;
  }

  console.log(`📊 Found ${users.length} users and ${withdrawals.length} potential undeducted withdrawals (older than 1h).`);

  // 3. Process each user
  for (const user of users) {
    // Find user's withdrawals
    const userWithdrawals = withdrawals.filter(w => w.idnum === user.idnum);
    
    if (userWithdrawals.length === 0) continue;

    // Calculate total to deduct
    const totalToDeduct = userWithdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    if (totalToDeduct > 0) {
      const currentBalance = Number(user.balance) || 0;
      const newBalance = currentBalance - totalToDeduct;

      console.log(`\n👤 User: ${user.email} (${user.userName})`);
      console.log(`   Current Balance: $${currentBalance.toLocaleString()}`);
      console.log(`   Past Withdrawals: ${userWithdrawals.length} items`);
      console.log(`   Total to Deduct: $${totalToDeduct.toLocaleString()}`);
      console.log(`   New Balance: $${newBalance.toLocaleString()}`);

      // 4. Update the user
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('idnum', user.idnum);

      if (updateError) {
        console.error(`   ❌ Failed to update balance: ${updateError.message}`);
      } else {
        console.log(`   ✅ Balance successfully updated.`);
      }
    }
  }

  console.log('\n✨ Backfill complete.');
}

deductPastWithdrawals();
