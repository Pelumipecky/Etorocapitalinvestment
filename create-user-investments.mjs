// Create real user investments (not admin)
// Run with: node create-user-investments.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function createUserInvestments() {
  console.log('🔄 Creating real user investments...\n')

  try {
    // Get non-admin users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .neq('role', 'admin')

    if (usersError) {
      console.error('❌ Users fetch error:', usersError.message)
      return
    }

    if (users.length === 0) {
      console.log('⚠️ No regular users found. Creating test user...')
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          idnum: 'USR' + Math.floor(Math.random() * 1000000),
          userName: 'JohnDoe',
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: '$2b$10$8K3dC7iHnZrNjQkqLkVzUe8qQyqQyqQyqQyqQyqQyqQyqQyqQyqQy',
          balance: 10000,
          bonus: 500,
          role: 'user'
        }])
        .select()

      if (createError) {
        console.error('❌ Error creating user:', createError.message)
        return
      }

      users.push(newUser[0])
      console.log(`✅ Created user: ${newUser[0].userName}`)
    }

    console.log(`👥 Found ${users.length} regular users\n`)

    // Create investments for first 2 users
    const investmentsToCreate = []
    
    for (let i = 0; i < Math.min(2, users.length); i++) {
      const user = users[i]
      
      // Pending investment
      investmentsToCreate.push({
        idnum: user.idnum,
        plan: 'Premium Plan',
        status: 'pending',
        capital: 15000,
        roi: 2250,
        bonus: 750,
        duration: 10,
        "paymentOption": 'Bitcoin',
        "authStatus": 'pending',
        "creditedRoi": 0,
        "creditedBonus": 0
      })

      // Active investment
      investmentsToCreate.push({
        idnum: user.idnum,
        plan: 'Starter Plan',
        status: 'active',
        capital: 3000,
        roi: 450,
        bonus: 150,
        duration: 5,
        "paymentOption": 'Ethereum',
        "authStatus": 'approved',
        "creditedRoi": 450,
        "creditedBonus": 150
      })
    }

    // Insert investments
    const { data: newInvestments, error: invError } = await supabase
      .from('investments')
      .insert(investmentsToCreate)
      .select()

    if (invError) {
      console.error('❌ Error creating investments:', invError.message)
      return
    }

    console.log(`✅ Created ${newInvestments.length} user investments\n`)

    // Display created investments with user info
    for (const inv of newInvestments) {
      const user = users.find(u => u.idnum === inv.idnum)
      console.log(`  - ${user?.userName}: ${inv.plan} - $${inv.capital} (${inv.status})`)
    }

    console.log('\n✅ Admin dashboard should now show real user investment requests!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createUserInvestments()