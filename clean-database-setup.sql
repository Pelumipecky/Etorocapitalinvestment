-- Clean Database Setup - No Mock Data
-- Run this once to set up your database properly

-- ================================================
-- DISABLE ROW LEVEL SECURITY (required for development)
-- ================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;

-- ================================================
-- CREATE BASIC ADMIN USER
-- ================================================
-- Delete any existing admin first
DELETE FROM users WHERE email = 'admin@ciphervault.com';

-- Create clean admin user
INSERT INTO users (
  idnum,
  name,
  "userName",
  email,
  password,
  role,
  balance,
  created_at
) VALUES (
  'ADM001',
  'Admin',
  'admin',
  'admin@ciphervault.com',
  '$2b$10$CHjR.mh58Qp27LUcBJf43O7fSjGXcXwWQ4sDmcMDH2koeYoZztdS6', -- "Admin@2029"
  'admin',
  0, -- Start with 0 balance
  NOW()
);

-- ================================================
-- VERIFY SETUP
-- ================================================
SELECT
    idnum,
    email,
    "userName",
    role,
    balance
FROM users
WHERE role = 'admin';

-- Check RLS is disabled
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'investments', 'withdrawals', 'transactions')
ORDER BY tablename;

-- ================================================
-- READY TO USE
-- ================================================
-- Your database is now clean and ready!
-- Admin login: admin@ciphervault.com / Admin@2029
-- All tables are empty except for the admin user
-- You can now create real users and data through the app