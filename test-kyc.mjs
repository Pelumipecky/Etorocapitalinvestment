// Test KYC functionality
// Run with: node test-kyc.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testKyc() {
  console.log('🧪 Testing KYC functionality...\n')

  try {
    // Test fetching KYC requests
    const { data: kycRequests, error: kycError } = await supabase
      .from('kyc_verifications')
      .select('*')
      .order('submittedAt', { ascending: false })

    if (kycError) {
      console.error('❌ KYC fetch error:', kycError.message)
      return
    }

    console.log(`📋 KYC Requests: ${kycRequests.length}`)

    if (kycRequests.length === 0) {
      console.log('ℹ️ No KYC requests found in database')
      console.log('The admin dashboard KYC tab should show an empty table')
      return
    }

    // Get users for joining
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      console.error('❌ Users fetch error:', usersError.message)
      return
    }

    // Join KYC with users
    const kycWithUsers = kycRequests.map(kyc => {
      const user = users.find(u => u.idnum === kyc.idnum)
      return {
        ...kyc,
        userName: user?.userName || user?.name || 'Unknown User',
        userEmail: user?.email || ''
      }
    })

    console.log('📋 KYC Requests with User Info:')
    kycWithUsers.forEach(kyc => {
      console.log(`  - ${kyc.userName} (${kyc.userEmail}): ${kyc.status} - Submitted: ${new Date(kyc.submittedAt).toLocaleDateString()}`)
    })

    console.log('\n✅ KYC functionality working correctly!')
    console.log('Admin dashboard should now show real KYC data (or empty table if no requests)')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testKyc()