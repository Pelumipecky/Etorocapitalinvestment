// Reset all data to fresh state for testing
// Run with: node reset-all-data.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function resetAll() {
  console.log('🧹 Resetting all user data to fresh state...\n')

  try {
    // Reset user balances to 0
    const { error: balanceError } = await supabase
      .from('users')
      .update({ balance: 0, bonus: 0 })
      .neq('role', 'admin')

    if (balanceError) console.error('❌ Balance reset error:', balanceError.message)
    else console.log('✅ User balances reset to $0')

    // Clear investments
    const { error: invError } = await supabase
      .from('investments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (invError) console.error('❌ Investments error:', invError.message)
    else console.log('✅ Investments cleared')

    // Clear withdrawals
    const { error: wdError } = await supabase
      .from('withdrawals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (wdError) console.error('❌ Withdrawals error:', wdError.message)
    else console.log('✅ Withdrawals cleared')

    // Clear loans
    const { error: loanError } = await supabase
      .from('loans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (loanError) console.error('❌ Loans error:', loanError.message)
    else console.log('✅ Loans cleared')

    // Verify final state
    console.log('\n📊 Final Database Status:')
    const { data: users } = await supabase.from('users').select('userName, email, balance, bonus, role')
    users?.forEach(u => console.log('  -', u.userName, '(' + u.role + ') - Balance: $' + u.balance + ', Bonus: $' + u.bonus))

    const { data: inv } = await supabase.from('investments').select('*')
    console.log('  Investments:', inv?.length || 0)

    const { data: wd } = await supabase.from('withdrawals').select('*')
    console.log('  Withdrawals:', wd?.length || 0)

    console.log('\n✅ Everything is fresh and clean! Ready to test investment flow.')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

resetAll()