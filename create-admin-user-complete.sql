-- Create Admin User for eToro Trust Capital
-- Run this in your Supabase SQL Editor to create an admin account

-- Insert admin user with generated bcrypt hash
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
  50000.00,  -- Admin balance for system operations
  2500.00,
  5,  -- Has 5 referrals
  'ADMIN001',
  'admin',
  NOW() - INTERVAL '30 days'
);

-- Create sample investments for the admin
INSERT INTO investments (idnum, plan, status, capital, roi, bonus, duration, "paymentOption", "transactionHash", "authStatus", "creditedRoi", "creditedBonus", date) VALUES
('ADM001', 'Premium Plan', 'active', 10000.00, 2500.00, 500.00, 30, 'Bitcoin', 'tx_admin_inv_001', 'approved', 2500.00, 500.00, NOW() - INTERVAL '15 days'),
('ADM001', 'Starter Plan', 'active', 5000.00, 750.00, 250.00, 15, 'Ethereum', 'tx_admin_inv_002', 'approved', 750.00, 250.00, NOW() - INTERVAL '10 days'),
('ADM001', 'VIP Plan', 'pending', 25000.00, 0.00, 0.00, 60, 'USDT', 'tx_admin_inv_003', 'pending', 0.00, 0.00, NOW() - INTERVAL '2 days');

-- Create sample withdrawals for the admin
INSERT INTO withdrawals (idnum, amount, wallet, status, method, "authStatus", date) VALUES
('ADM001', 2000.00, 'bc1qadminwallet1234567890abcdef', 'approved', 'Bitcoin', 'approved', NOW() - INTERVAL '20 days'),
('ADM001', 1500.00, '0xAdminWallet1234567890ABCDEF', 'completed', 'Ethereum', 'approved', NOW() - INTERVAL '12 days'),
('ADM001', 3000.00, 'TAdminWallet1234567890ABCDEF', 'pending', 'USDT', 'pending', NOW() - INTERVAL '1 day');

-- Create sample transactions for the admin
INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at) VALUES
('ADM001', 'deposit', 10000.00, 'completed', 'Initial deposit via Bitcoin', 'tx_admin_dep_001', NOW() - INTERVAL '25 days'),
('ADM001', 'withdrawal', 2000.00, 'completed', 'Withdrawal to Bitcoin wallet', 'tx_admin_wd_001', NOW() - INTERVAL '20 days'),
('ADM001', 'investment', 10000.00, 'completed', 'Premium Plan investment', 'tx_admin_inv_001', NOW() - INTERVAL '15 days');

-- Create sample KYC verification for the admin
INSERT INTO kyc_verifications (idnum, status, "documentType", "documentNumber", "verificationDate", notes) VALUES
('ADM001', 'approved', 'passport', 'P123456789', NOW() - INTERVAL '25 days', 'Admin KYC verification completed');

-- Create sample notifications for the admin
INSERT INTO notifications (idnum, type, title, message, "isRead", date) VALUES
('ADM001', 'system', 'Welcome to eToro Trust Capital', 'Your admin account has been created successfully.', true, NOW() - INTERVAL '30 days'),
('ADM001', 'investment', 'Investment Approved', 'Your Premium Plan investment of $10,000 has been approved.', true, NOW() - INTERVAL '15 days'),
('ADM001', 'withdrawal', 'Withdrawal Processed', 'Your withdrawal of $2,000 has been processed.', true, NOW() - INTERVAL '20 days');

-- Verify admin user was created
SELECT idnum, email, "userName", role, balance FROM users WHERE role = 'admin';