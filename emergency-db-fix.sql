-- Emergency fix: Disable RLS and ensure database access
-- Run this if users can't login after running schema scripts

-- Disable RLS on all tables (development mode)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE deposits DISABLE ROW LEVEL SECURITY;

-- Check if users table has data
SELECT COUNT(*) as total_users FROM users;

-- Check if admin user exists
SELECT idnum, email, "userName", role FROM users WHERE role IN ('admin', 'superadmin');

-- If no admin exists, you can create one by running create-admin-user.sql
-- Or manually create one with this query (replace with your desired credentials):
/*
INSERT INTO users (
  idnum, name, "userName", email, password, role, balance, bonus,
  "investmentCount", "referralCount", "referralBonusTotal"
) VALUES (
  'USR123ADMIN',
  'Admin User',
  'admin',
  'admin@ciphervault.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- "Admin123!" hashed
  'admin',
  10000,
  1000,
  0,
  0,
  0
);
*/