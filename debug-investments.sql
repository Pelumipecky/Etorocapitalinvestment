-- Debug Investment Data Persistence
-- Run this in Supabase SQL Editor after creating an investment

-- Check all investments in the database
SELECT
    id,
    idnum,
    plan,
    status,
    capital,
    "authStatus",
    date,
    created_at
FROM investments
ORDER BY created_at DESC
LIMIT 10;

-- Check if admin user exists and get their idnum
SELECT idnum, email, "userName", role FROM users WHERE role = 'admin';

-- Check investments for admin user specifically
SELECT
    id,
    idnum,
    plan,
    status,
    capital,
    "authStatus",
    date
FROM investments
WHERE idnum = 'ADM001'
ORDER BY date DESC;

-- Check total counts
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM investments) as total_investments,
    (SELECT COUNT(*) FROM investments WHERE idnum = 'ADM001') as admin_investments;

-- Check RLS status (should be NO for all)
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('investments', 'users')
ORDER BY tablename;

-- Test creating a simple investment manually
INSERT INTO investments (idnum, plan, status, capital, duration, "paymentOption", "authStatus")
VALUES ('ADM001', 'Debug Test Investment', 'pending', 500.00, 30, 'Bitcoin', 'unseen');

-- Verify the test investment was created
SELECT idnum, plan, status, capital FROM investments WHERE plan = 'Debug Test Investment';