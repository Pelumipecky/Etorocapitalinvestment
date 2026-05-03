import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. See .env.example')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function createUserAndProfile(user) {
  // create user via admin API
  const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true
  })
  if (createErr) {
    console.error('Error creating user', user.email, createErr)
    throw createErr
  }

  const userId = createdUser.user.id

  // insert profile row
  const profile = {
    id: userId,
    username: user.username,
    full_name: user.full_name,
    created_at: new Date().toISOString()
  }
  const { error: profileErr } = await supabase.from('profiles').insert(profile)
  if (profileErr) {
    console.error('Error inserting profile for', user.email, profileErr)
    throw profileErr
  }

  // seed a wallet for USDT and BTC
  const wallets = [
    { user_id: userId, currency: 'USDT', balance: 1000 },
    { user_id: userId, currency: 'BTC', balance: 0.01 }
  ]
  const { error: walletErr } = await supabase.from('wallets').insert(wallets)
  if (walletErr) {
    console.error('Error inserting wallets for', user.email, walletErr)
    throw walletErr
  }

  // add a demo deposit transaction
  const { error: txErr } = await supabase.from('transactions').insert({
    user_id: userId,
    type: 'deposit',
    currency: 'USDT',
    amount: 1000,
    status: 'completed',
    created_at: new Date().toISOString()
  })
  if (txErr) {
    console.error('Error inserting transaction for', user.email, txErr)
    throw txErr
  }

  console.log('Seeded user', user.email, 'id=', userId)
  return userId
}

async function run() {
  try {
    const sampleUsers = [
      { email: 'alice@example.com', password: 'Password123!', username: 'alice', full_name: 'Alice Example' },
      { email: 'bob@example.com', password: 'Password123!', username: 'bob', full_name: 'Bob Example' }
    ]

    for (const u of sampleUsers) {
      // check if user already exists by email
      const { data: existing, error: fetchErr } = await supabase.from('profiles').select('id').eq('username', u.username).limit(1)
      if (fetchErr) throw fetchErr
      if (existing && existing.length > 0) {
        console.log('User', u.username, 'already seeded, skipping')
        continue
      }

      await createUserAndProfile(u)
    }

    console.log('Seeding completed')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
}

run()
