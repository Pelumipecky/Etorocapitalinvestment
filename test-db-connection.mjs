import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase database connection...')

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing environment variables:')
    console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set')
    console.error('   VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set' : 'Not set')
    return false
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    // Test basic connection with a simple query
    const { data, error } = await supabase.from('users').select('count').limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      console.error('   This might mean:')
      console.error('   - The database schema hasn\'t been applied')
      console.error('   - The Supabase project is not active')
      console.error('   - The environment variables are incorrect')
      return false
    }

    console.log('✅ Database connection successful!')
    console.log('📊 Connection details:')
    console.log('   - Supabase URL:', SUPABASE_URL.substring(0, 30) + '...')
    console.log('   - Project ID:', SUPABASE_URL.split('.')[0].split('//')[1])

    // Test if tables exist by trying to select from them
    const tables = ['users', 'investments', 'withdrawals', 'transactions', 'loans', 'notifications']
    console.log('\n📋 Checking tables:')

    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (tableError) {
          console.log(`   ❌ ${table}: ${tableError.message}`)
        } else {
          console.log(`   ✅ ${table}: Available`)
        }
      } catch (err) {
        console.log(`   ❌ ${table}: Error - ${err.message}`)
      }
    }

    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

// Run the test
testDatabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database is ready to use!')
    console.log('You can now:')
    console.log('- Register new users')
    console.log('- Create investments')
    console.log('- Process withdrawals')
    console.log('- Use all database features')
  } else {
    console.log('\n⚠️  Database connection issues detected.')
    console.log('Please check:')
    console.log('1. Your Supabase project is active')
    console.log('2. Environment variables are correct (.env file)')
    console.log('3. Database schema has been applied (run supabase-schema.sql)')
    console.log('4. Network connectivity to Supabase')
  }
})