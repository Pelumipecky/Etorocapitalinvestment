// Insert additional admin data (withdrawals, loans, etc.)
// Run with: node insert-admin-data.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function insertAdminData() {
  console.log('🔄 Inserting additional admin data...')

  // Insert withdrawals
  const withdrawals = [
    {
      idnum: 'USR480113',
      amount: 2000,
      wallet: 'bc1qadminwallet1234567890abcdef',
      status: 'approved',
      method: 'Bitcoin',
      "authStatus": 'approved',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days ago
    },
    {
      idnum: 'USR480113',
      amount: 1500,
      wallet: '0xAdminWallet1234567890ABCDEF',
      status: 'completed',
      method: 'Ethereum',
      "authStatus": 'approved',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
    },
    {
      idnum: 'USR480113',
      amount: 3000,
      wallet: 'TAdminWallet1234567890ABCDEF',
      status: 'pending',
      method: 'USDT',
      "authStatus": 'pending',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ]

  // Insert loans
  const loans = [
    {
      idnum: 'USR480113',
      amount: 15000,
      status: 'approved',
      "interestRate": 8.5,
      duration: 12,
      "authStatus": 'approved',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 days ago
    },
    {
      idnum: 'USR480113',
      amount: 8000,
      status: 'active',
      "interestRate": 7.2,
      duration: 6,
      "authStatus": 'approved',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
    },
    {
      idnum: 'USR480113',
      amount: 20000,
      status: 'pending',
      "interestRate": 9.0,
      duration: 24,
      "authStatus": 'pending',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ]

  // Insert KYC
  const kyc = [
    {
      idnum: 'USR480113',
      "fullName": 'Admin User',
      "dateOfBirth": '1985-05-15',
      nationality: 'United States',
      "documentType": 'passport',
      "documentNumber": 'P123456789',
      status: 'approved',
      "submittedAt": new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString() // 28 days ago
    }
  ]

  try {
    // Insert withdrawals
    const { data: withdrawalData, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert(withdrawals)
      .select()

    if (withdrawalError) {
      console.error('❌ Error inserting withdrawals:', withdrawalError.message)
    } else {
      console.log(`✅ Inserted ${withdrawalData.length} withdrawals`)
    }

    // Insert loans
    const { data: loanData, error: loanError } = await supabase
      .from('loans')
      .insert(loans)
      .select()

    if (loanError) {
      console.error('❌ Error inserting loans:', loanError.message)
    } else {
      console.log(`✅ Inserted ${loanData.length} loans`)
    }

    // Insert KYC
    const { data: kycData, error: kycError } = await supabase
      .from('kyc_verifications')
      .insert(kyc)
      .select()

    if (kycError) {
      console.error('❌ Error inserting KYC:', kycError.message)
    } else {
      console.log(`✅ Inserted ${kycData.length} KYC records`)
    }

    console.log('\n📊 Admin data summary:')
    console.log('- Investments: 3')
    console.log('- Withdrawals: 3')
    console.log('- Loans: 3')
    console.log('- KYC: 1')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

insertAdminData()