-- Debug login issue: Check if admin user exists and has correct data
-- Run this in Supabase SQL Editor

-- Check if admin user exists
SELECT idnum, email, "userName", role, balance FROM users WHERE email = 'admin@ciphervault.com';

-- Check if any users exist at all
SELECT COUNT(*) as total_users FROM users;

-- Check users table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check if RLS is disabled (should show 'NO' for all tables)
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'investments', 'withdrawals', 'transactions', 'deposits')
ORDER BY tablename;

-- Test password hash manually (this should return true if hash is correct)
-- Note: Replace 'Admin@2029' with the actual password you're trying
SELECT idnum, email,
       CASE WHEN password IS NOT NULL THEN 'Password hash exists' ELSE 'No password hash' END as password_status
FROM users WHERE email = 'admin@ciphervault.com';