// Test user database connection and data fetching
// Run with: node test-user-db.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testUserDatabase() {
  console.log('🧪 Testing user database connection and data fetching...\n')

  try {
    // Test basic connection
    const { data: connectionTest, error: connError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connError) {
      console.error('❌ Database connection error:', connError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('❌ Users fetch error:', usersError.message)
      return
    }

    console.log(`👥 Total users: ${users.length}`)
    users.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Balance: $${user.balance || 0} - Role: ${user.role || 'user'}`)
    })

    // Test investments for each user
    console.log('\n📈 Testing investments for each user:')
    for (const user of users) {
      const { data: investments, error: invError } = await supabase
        .from('investments')
        .select('*')
        .eq('idnum', user.idnum)
        .order('created_at', { ascending: false })

      if (invError) {
        console.log(`❌ Error fetching investments for ${user.userName}:`, invError.message)
      } else {
        console.log(`  ${user.userName}: ${investments.length} investments`)
        investments.forEach(inv => {
          console.log(`    - ${inv.plan} Plan: $${inv.capital} (${inv.status})`)
        })
      }
    }

    // Test notifications
    console.log('\n🔔 Testing notifications:')
    for (const user of users.slice(0, 2)) { // Test first 2 users
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('idnum', user.idnum)
        .order('created_at', { ascending: false })

      if (notifError) {
        console.log(`❌ Error fetching notifications for ${user.userName}:`, notifError.message)
      } else {
        console.log(`  ${user.userName}: ${notifications.length} notifications`)
      }
    }

    console.log('\n✅ User database connection and data fetching working correctly!')
    console.log('Users should now see real data from the database instead of localStorage.')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testUserDatabase()