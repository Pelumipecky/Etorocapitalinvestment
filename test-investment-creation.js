// Test investment creation and data persistence
// Run with: node test-investment-creation.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInvestmentCreation() {
  console.log('🧪 Testing investment creation and persistence...\n')

  try {
    // Check current investments
    const { data: before, error: beforeError } = await supabase
      .from('investments')
      .select('*')
      .eq('idnum', 'ADM001')

    if (beforeError) {
      console.error('❌ Error fetching investments:', beforeError.message)
      return
    }

    console.log(`📊 Investments before: ${before?.length || 0}`)

    // Create a test investment
    const testInvestment = {
      idnum: 'ADM001',
      plan: 'Test Investment',
      status: 'pending',
      capital: 1000.00,
      duration: 30,
      paymentOption: 'Bitcoin',
      authStatus: 'unseen'
    }

    console.log('📤 Creating investment:', testInvestment)

    const { data: created, error: createError } = await supabase
      .from('investments')
      .insert([testInvestment])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating investment:', createError.message)
      return
    }

    console.log('✅ Investment created:', created)

    // Fetch investments again
    const { data: after, error: afterError } = await supabase
      .from('investments')
      .select('*')
      .eq('idnum', 'ADM001')

    if (afterError) {
      console.error('❌ Error fetching investments after creation:', afterError.message)
      return
    }

    console.log(`📊 Investments after: ${after?.length || 0}`)
    console.log('✅ Test completed successfully!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testInvestmentCreation()