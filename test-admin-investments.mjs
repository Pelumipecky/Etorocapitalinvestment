// Test admin dashboard with user-joined investments
// Run with: node test-admin-investments.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testAdminInvestments() {
  console.log('🧪 Testing admin investments with user data...\n')

  try {
    // Fetch investments
    const { data: investments, error: invError } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false })

    if (invError) {
      console.error('❌ Investments fetch error:', invError.message)
      return
    }

    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      console.error('❌ Users fetch error:', usersError.message)
      return
    }

    console.log(`📈 Investments: ${investments.length}`)
    console.log(`👥 Users: ${users.length}\n`)

    // Join investments with users (like the admin dashboard does)
    const investmentsWithUsers = investments.map(investment => {
      const user = users.find(u => u.idnum === investment.idnum)
      return {
        ...investment,
        userName: user?.userName || user?.name || 'Unknown User',
        userEmail: user?.email || ''
      }
    })

    console.log('📋 Investment Requests:')
    investmentsWithUsers.forEach(inv => {
      console.log(`  - ${inv.userName} (${inv.userEmail}): ${inv.plan} Plan - $${inv.capital} (${inv.status})`)
    })

    console.log('\n✅ Admin dashboard should now show user names with investments!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testAdminInvestments()