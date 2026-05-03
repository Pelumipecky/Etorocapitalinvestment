-- Diagnostic queries to check database state
-- Run these one by one in Supabase SQL Editor

-- 1. Check if users table exists and has data
SELECT COUNT(*) as user_count FROM users;

-- 2. Check if RLS is enabled on users table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. Check a sample user (if exists)
SELECT idnum, email, "userName", role, balance
FROM users
LIMIT 5;

-- 4. Check if we can query the table directly
SELECT 'Database connection OK' as status;