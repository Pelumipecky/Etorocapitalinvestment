-- Check admin user and investment issues
-- Run this in Supabase SQL Editor

-- Check if admin user exists
SELECT idnum, email, "userName", role, balance, created_at FROM users WHERE role = 'admin';

-- Check all users
SELECT idnum, email, "userName", role, balance FROM users ORDER BY created_at DESC LIMIT 10;

-- Check if any investments exist
SELECT COUNT(*) as total_investments FROM investments;

-- Check recent investments
SELECT idnum, plan, status, capital, "authStatus", date FROM investments ORDER BY date DESC LIMIT 10;

-- Check RLS status on key tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'investments', 'withdrawals', 'transactions')
ORDER BY tablename;

-- Check if we can insert a test investment (this should work if RLS is disabled)
-- Uncomment the line below to test:
/*
INSERT INTO investments (idnum, plan, status, capital, roi, bonus, duration, "paymentOption", "authStatus")
VALUES ('ADM001', 'Test Plan', 'pending', 1000.00, 0, 0, 30, 'Bitcoin', 'pending');
*/