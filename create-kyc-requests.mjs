// Create sample KYC requests for testing
// Run with: node create-kyc-requests.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function createKycRequests() {
  console.log('🔄 Creating sample KYC requests...\n')

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
          userName: 'TestUser',
          name: 'Test User',
          email: 'test.user@example.com',
          password: '$2b$10$8K3dC7iHnZrNjQkqLkVzUe8qQyqQyqQyqQyqQyqQyqQyqQyqQyqQy',
          balance: 5000,
          bonus: 250,
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

    // Create KYC requests for first 2 users
    const kycRequests = []

    for (let i = 0; i < Math.min(2, users.length); i++) {
      const user = users[i]
      
      kycRequests.push({
        idnum: user.idnum,
        fullName: user.name || user.userName,
        dateOfBirth: '1990-05-15',
        nationality: 'United States',
        documentType: 'passport',
        documentNumber: `P${Math.floor(Math.random() * 100000000)}`,
        status: 'pending',
        submittedAt: new Date().toISOString()
      })
    }

    // Insert KYC requests
    const { data: newKyc, error: kycError } = await supabase
      .from('kyc_verifications')
      .insert(kycRequests)
      .select()

    if (kycError) {
      console.error('❌ Error creating KYC requests:', kycError.message)
      return
    }

    console.log(`✅ Created ${newKyc.length} KYC requests\n`)

    // Display created KYC requests
    for (const kyc of newKyc) {
      const user = users.find(u => u.idnum === kyc.idnum)
      console.log(`  - ${user?.userName}: ${kyc.fullName} - ${kyc.status} (${kyc.documentType})`)
    }

    console.log('\n✅ Admin dashboard KYC tab should now show pending requests for approval!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createKycRequests()