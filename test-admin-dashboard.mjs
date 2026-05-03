// Test admin dashboard data fetching
// Run with: node test-admin-dashboard.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testAdminDashboard() {
  console.log('🧪 Testing admin dashboard data fetching...\n')

  try {
    // Test investments fetch
    const { data: investments, error: invError } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false })

    if (invError) {
      console.error('❌ Investments fetch error:', invError.message)
      return
    }

    console.log(`📈 Investments fetched: ${investments.length}`)
    investments.forEach(inv => {
      console.log(`  - ${inv.plan} Plan: $${inv.capital} (${inv.status}) for user ${inv.idnum}`)
    })

    // Test withdrawals fetch
    const { data: withdrawals, error: wdError } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false })

    if (wdError) {
      console.error('❌ Withdrawals fetch error:', wdError.message)
      return
    }

    console.log(`💰 Withdrawals fetched: ${withdrawals.length}`)
    withdrawals.forEach(wd => {
      console.log(`  - $${wd.amount} via ${wd.method} (${wd.status}) for user ${wd.idnum}`)
    })

    // Test users fetch
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('❌ Users fetch error:', usersError.message)
      return
    }

    console.log(`👥 Users fetched: ${users.length}`)
    users.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Role: ${user.role || 'user'}`)
    })

    console.log('\n✅ Admin dashboard data fetching works correctly!')
    console.log('The admin dashboard should now display real data instead of mock data.')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testAdminDashboard()