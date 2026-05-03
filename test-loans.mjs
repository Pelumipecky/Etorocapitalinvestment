// Test loans functionality
// Run with: node test-loans.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testLoans() {
  console.log('🧪 Testing loans functionality...\n')

  try {
    // Fetch loans
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false })

    if (loansError) {
      console.error('❌ Loans fetch error:', loansError.message)
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

    console.log(`💰 Loans: ${loans.length}`)
    console.log(`👥 Users: ${users.length}\n`)

    // Join loans with users (like the admin dashboard does)
    const loansWithUsers = loans.map(loan => {
      const user = users.find(u => u.idnum === loan.idnum)
      return {
        ...loan,
        userName: user?.userName || user?.name || 'Unknown User',
        userEmail: user?.email || ''
      }
    })

    console.log('📋 Loan Status Summary:')
    const pendingLoans = loansWithUsers.filter(l => l.status === 'pending').length
    const approvedLoans = loansWithUsers.filter(l => l.status === 'approved').length
    const rejectedLoans = loansWithUsers.filter(l => l.status === 'rejected').length

    console.log(`⏳ Pending: ${pendingLoans}`)
    console.log(`✅ Approved: ${approvedLoans}`)
    console.log(`❌ Rejected: ${rejectedLoans}\n`)

    if (loansWithUsers.length > 0) {
      console.log('📄 Recent Loans:')
      loansWithUsers.slice(0, 3).forEach((loan, index) => {
        console.log(`${index + 1}. ${loan.userName} - $${loan.amount} - ${loan.status} (${new Date(loan.created_at).toLocaleDateString()})`)
      })
    } else {
      console.log('📄 No loans found in database')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLoans()