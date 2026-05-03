// Insert investments into database
// Run with: node insert-investments.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function insertInvestments() {
  console.log('🔄 Inserting investments into database...')

  const investments = [
    {
      idnum: 'USR480113', // Admin user ID from test
      plan: 'Premium Plan',
      status: 'active',
      capital: 10000,
      roi: 2500,
      bonus: 500,
      duration: 30,
      "paymentOption": 'Bitcoin',
      "transactionHash": 'tx_admin_inv_001',
      "authStatus": 'approved',
      "creditedRoi": 2500,
      "creditedBonus": 500,
      date: new Date().toISOString()
    },
    {
      idnum: 'USR480113',
      plan: 'Starter Plan',
      status: 'active',
      capital: 5000,
      roi: 750,
      bonus: 250,
      duration: 15,
      "paymentOption": 'Ethereum',
      "transactionHash": 'tx_admin_inv_002',
      "authStatus": 'approved',
      "creditedRoi": 750,
      "creditedBonus": 250,
      date: new Date().toISOString()
    },
    {
      idnum: 'USR480113',
      plan: 'VIP Plan',
      status: 'pending',
      capital: 25000,
      roi: 0,
      bonus: 0,
      duration: 60,
      "paymentOption": 'USDT',
      "transactionHash": 'tx_admin_inv_003',
      "authStatus": 'pending',
      "creditedRoi": 0,
      "creditedBonus": 0,
      date: new Date().toISOString()
    }
  ]

  try {
    const { data, error } = await supabase
      .from('investments')
      .insert(investments)
      .select()

    if (error) {
      console.error('❌ Error inserting investments:', error.message)
      return
    }

    console.log(`✅ Successfully inserted ${data.length} investments!`)

    // Verify the insertions
    const { data: verifyData, error: verifyError } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false })

    if (!verifyError) {
      console.log(`📊 Total investments in database: ${verifyData.length}`)
      verifyData.forEach((inv, idx) => {
        console.log(`${idx + 1}. ${inv.plan} - $${inv.capital} - ${inv.status}`)
      })
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

insertInvestments()