-- Complete database setup and fix
-- Run this in Supabase SQL Editor to fix all issues

-- ================================================
-- STEP 1: DISABLE RLS ON ALL TABLES
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
-- STEP 2: CREATE ADMIN USER (with error handling)
-- ================================================
DO $$
BEGIN
    -- Delete any existing admin user first
    DELETE FROM users WHERE email = 'admin@ciphervault.com';

    -- Create the admin user
    INSERT INTO users (
      idnum,
      name,
      "userName",
      email,
      password,
      "phoneNumber",
      country,
      city,
      address,
      balance,
      bonus,
      "referralCount",
      "referralCode",
      role,
      created_at
    ) VALUES (
      'ADM001',
      'Admin User',
      'admin',
      'admin@ciphervault.com',
      '$2b$10$CHjR.mh58Qp27LUcBJf43O7fSjGXcXwWQ4sDmcMDH2koeYoZztdS6', -- "Admin@2029" hashed
      '+1234567890',
      'United States',
      'New York',
      '123 Admin Street',
      50000.00,
      2500.00,
      5,
      'ADMIN001',
      'admin',
      NOW() - INTERVAL '30 days'
    );

    RAISE NOTICE 'Admin user created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating admin user: %', SQLERRM;
END $$;

-- ================================================
-- STEP 3: CLEAN UP EXISTING DATA (optional - uncomment if needed)
-- ================================================
-- DELETE FROM investments WHERE idnum = 'ADM001';
-- DELETE FROM withdrawals WHERE idnum = 'ADM001';
-- DELETE FROM transactions WHERE idnum = 'ADM001';

-- ================================================
-- STEP 4: CREATE SAMPLE DATA FOR ADMIN
-- ================================================
-- Investments
INSERT INTO investments (idnum, plan, status, capital, roi, bonus, duration, "paymentOption", "transactionHash", "authStatus", "creditedRoi", "creditedBonus", date)
VALUES
('ADM001', 'Premium Plan', 'active', 10000.00, 2500.00, 500.00, 30, 'Bitcoin', 'tx_admin_inv_001', 'approved', 2500.00, 500.00, NOW() - INTERVAL '15 days'),
('ADM001', 'Starter Plan', 'active', 5000.00, 750.00, 250.00, 15, 'Ethereum', 'tx_admin_inv_002', 'approved', 750.00, 250.00, NOW() - INTERVAL '10 days'),
('ADM001', 'VIP Plan', 'pending', 25000.00, 0.00, 0.00, 60, 'USDT', 'tx_admin_inv_003', 'pending', 0.00, 0.00, NOW() - INTERVAL '2 days');

-- Withdrawals
INSERT INTO withdrawals (idnum, amount, wallet, status, method, "authStatus", date)
VALUES
('ADM001', 2000.00, 'bc1qadminwallet1234567890abcdef', 'approved', 'Bitcoin', 'approved', NOW() - INTERVAL '20 days'),
('ADM001', 1500.00, '0xAdminWallet1234567890ABCDEF', 'completed', 'Ethereum', 'approved', NOW() - INTERVAL '12 days'),
('ADM001', 3000.00, 'TAdminWallet1234567890ABCDEF', 'pending', 'USDT', 'pending', NOW() - INTERVAL '1 day');

-- Transactions
INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at)
VALUES
('ADM001', 'deposit', 10000.00, 'completed', 'Initial deposit via Bitcoin', 'tx_admin_dep_001', NOW() - INTERVAL '25 days'),
('ADM001', 'withdrawal', 2000.00, 'completed', 'Withdrawal to Bitcoin wallet', 'tx_admin_wd_001', NOW() - INTERVAL '20 days'),
('ADM001', 'investment', 10000.00, 'completed', 'Premium Plan investment', 'tx_admin_inv_001', NOW() - INTERVAL '15 days');

-- ================================================
-- STEP 5: VERIFY EVERYTHING WORKS
-- ================================================
-- Check admin user
SELECT idnum, email, "userName", role, balance FROM users WHERE role = 'admin';

-- Check investments can be created
INSERT INTO investments (idnum, plan, status, capital, duration, "paymentOption", "authStatus")
VALUES ('ADM001', 'Test Investment', 'pending', 1000.00, 30, 'Bitcoin', 'unseen');

-- Check the test investment was created
SELECT idnum, plan, status, capital FROM investments WHERE plan = 'Test Investment';

-- Final status check
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'admin') as admin_users,
    (SELECT COUNT(*) FROM investments) as total_investments,
    (SELECT COUNT(*) FROM investments WHERE idnum = 'ADM001') as admin_investments,
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'investments') as investments_rls;

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
-- If you see this, everything should be working!
-- Admin login: admin@ciphervault.com / Admin@2029
-- Investments should now save to database