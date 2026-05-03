// Test database connection and check investments
// Run with: node test-investments.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not set!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      return
    }

    console.log('✅ Supabase connection successful!')

    // Check investments table
    console.log('\n📊 Checking investments table...')
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (investmentsError) {
      console.error('❌ Error fetching investments:', investmentsError.message)
      return
    }

    console.log(`✅ Found ${investments.length} investments:`)
    investments.forEach((inv, idx) => {
      console.log(`${idx + 1}. ${inv.plan} - $${inv.capital} - ${inv.status} - User: ${inv.idnum}`)
    })

    // Test creating an investment
    console.log('\n💰 Testing investment creation...')
    const testInvestment = {
      idnum: 'USRMIWD9LDQXIQ58', // Using Pecky's ID
      plan: 'Test Plan',
      capital: 1000,
      roi: 10,
      duration: 30,
      paymentOption: 'Bitcoin',
      transactionHash: 'test_tx_hash_123',
      status: 'pending',
      authStatus: 'unseen'
    }

    const { data: newInvestment, error: createError } = await supabase
      .from('investments')
      .insert([testInvestment])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating investment:', createError.message)
      console.error('❌ Error details:', createError)
    } else {
      console.log('✅ Investment created successfully:', newInvestment)
    }

    // Check users table
    console.log('\n👥 Checking users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('idnum, name, email, role')
      .order('created_at', { ascending: false })
      .limit(5)

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    console.log(`✅ Found ${users.length} users:`)
    users.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.name} (${user.email}) - ${user.role} - ID: ${user.idnum}`)
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testConnection()