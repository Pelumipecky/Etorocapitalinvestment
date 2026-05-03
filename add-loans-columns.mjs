// Add missing columns to loans table
// Run with: node add-loans-columns.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function addLoansColumns() {
  console.log('🔧 Adding missing columns to loans table...\n')

  try {
    // Add purpose column
    console.log('📝 Adding purpose column...')
    const { error: purposeError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE loans ADD COLUMN IF NOT EXISTS purpose TEXT;'
    })

    if (purposeError) {
      console.error('❌ Error adding purpose column:', purposeError.message)
    } else {
      console.log('✅ Purpose column added successfully')
    }

    // Add totalRepayment column
    console.log('💰 Adding totalRepayment column...')
    const { error: repaymentError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE loans ADD COLUMN IF NOT EXISTS "totalRepayment" NUMERIC;'
    })

    if (repaymentError) {
      console.error('❌ Error adding totalRepayment column:', repaymentError.message)
    } else {
      console.log('✅ TotalRepayment column added successfully')
    }

    // Verify columns were added
    console.log('\n🔍 Verifying columns...')
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'loans')
      .in('column_name', ['purpose', 'totalRepayment'])

    if (verifyError) {
      console.error('❌ Error verifying columns:', verifyError.message)
    } else {
      console.log('📋 Loans table columns:')
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable ? 'nullable' : 'not null'})`)
      })
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  }
}

addLoansColumns()