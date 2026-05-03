// Final verification script - check all admin data
// Run with: node verify-admin-data.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function verifyAdminData() {
  console.log('🔍 Verifying all admin data...\n')

  try {
    // Check investments
    const { data: investments, error: invError } = await supabase
      .from('investments')
      .select('*')
      .eq('idnum', 'USR480113')

    if (invError) {
      console.error('❌ Investments error:', invError.message)
    } else {
      console.log(`📈 Investments: ${investments.length}`)
      investments.forEach(inv => {
        console.log(`  - ${inv.plan} Plan: $${inv.capital} (${inv.status})`)
      })
    }

    // Check withdrawals
    const { data: withdrawals, error: wdError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('idnum', 'USR480113')

    if (wdError) {
      console.error('❌ Withdrawals error:', wdError.message)
    } else {
      console.log(`💰 Withdrawals: ${withdrawals.length}`)
      withdrawals.forEach(wd => {
        console.log(`  - $${wd.amount} via ${wd.method} (${wd.status})`)
      })
    }

    // Check loans
    const { data: loans, error: loanError } = await supabase
      .from('loans')
      .select('*')
      .eq('idnum', 'USR480113')

    if (loanError) {
      console.error('❌ Loans error:', loanError.message)
    } else {
      console.log(`🏦 Loans: ${loans.length}`)
      loans.forEach(loan => {
        console.log(`  - $${loan.amount} at ${loan.interestRate}% (${loan.status})`)
      })
    }

    // Check KYC
    const { data: kyc, error: kycError } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('idnum', 'USR480113')

    if (kycError) {
      console.error('❌ KYC error:', kycError.message)
    } else {
      console.log(`🆔 KYC: ${kyc.length}`)
      kyc.forEach(k => {
        console.log(`  - ${k.fullName} (${k.status})`)
      })
    }

    console.log('\n✅ Admin dashboard should now display real data!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

verifyAdminData()