// Clear all investment data
// Run with: node clear-investments.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function clearInvestments() {
  console.log('🗑️ Removing all investment data...\n')

  try {
    // Get current count
    const { data: before } = await supabase.from('investments').select('*')
    console.log(`📊 Current investments: ${before?.length || 0}`)

    // Delete all investments
    const { error } = await supabase
      .from('investments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // This matches all rows

    if (error) {
      console.error('❌ Error deleting investments:', error.message)
      return
    }

    // Verify deletion
    const { data: after } = await supabase.from('investments').select('*')
    console.log(`✅ Investments after deletion: ${after?.length || 0}`)

    console.log('\n✅ All investment data has been cleared!')
    console.log('Users can now create fresh investments.')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

clearInvestments()