-- Create Admin User for eToro Trust Capital
-- Run this in your Supabase SQL Editor to create an admin account with comprehensive data

-- First, create the admin user
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
  '$2b$10$REPLACE_WITH_YOUR_BCRYPT_HASH', -- Generate your own bcrypt hash for custom password
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

-- Create sample loans for the admin
INSERT INTO loans (idnum, amount, status, "interestRate", duration, "authStatus", date) VALUES
('ADM001', 15000.00, 'approved', 8.5, 12, 'approved', NOW() - INTERVAL '25 days'),
('ADM001', 8000.00, 'active', 7.2, 6, 'approved', NOW() - INTERVAL '8 days'),
('ADM001', 20000.00, 'pending', 9.0, 24, 'pending', NOW() - INTERVAL '3 days');

-- Create KYC verification request for the admin
INSERT INTO kyc_verifications (idnum, "fullName", "dateOfBirth", nationality, "documentType", "documentNumber", status, "submittedAt") VALUES
('ADM001', 'Admin User', '1985-05-15', 'United States', 'passport', 'P123456789', 'approved', NOW() - INTERVAL '28 days');

-- Create sample transactions for the admin
INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at) VALUES
('ADM001', 'deposit', 50000.00, 'completed', 'Initial admin deposit', 'dep_admin_001', NOW() - INTERVAL '30 days'),
('ADM001', 'investment', 10000.00, 'completed', 'Premium Plan investment', 'inv_admin_001', NOW() - INTERVAL '15 days'),
('ADM001', 'roi', 2500.00, 'completed', 'ROI from Premium Plan', 'roi_admin_001', NOW() - INTERVAL '10 days'),
('ADM001', 'withdrawal', 2000.00, 'completed', 'Bitcoin withdrawal', 'wd_admin_001', NOW() - INTERVAL '20 days'),
('ADM001', 'bonus', 500.00, 'completed', 'Investment bonus', 'bon_admin_001', NOW() - INTERVAL '15 days'),
('ADM001', 'loan', 15000.00, 'completed', 'Business loan approval', 'loan_admin_001', NOW() - INTERVAL '25 days');

-- Create sample notifications for the admin
INSERT INTO notifications (idnum, title, message, type, read, created_at) VALUES
('ADM001', 'Welcome to eToro Trust Capital', 'Your admin account has been successfully created!', 'success', true, NOW() - INTERVAL '30 days'),
('ADM001', 'Investment Approved', 'Your Premium Plan investment of $10,000 has been approved.', 'success', true, NOW() - INTERVAL '15 days'),
('ADM001', 'ROI Credited', 'Your ROI of $2,500 has been credited to your account.', 'info', true, NOW() - INTERVAL '10 days'),
('ADM001', 'Withdrawal Processed', 'Your Bitcoin withdrawal of $2,000 has been processed.', 'success', true, NOW() - INTERVAL '20 days'),
('ADM001', 'New Referral Bonus', 'You earned $100 bonus from a new referral!', 'info', false, NOW() - INTERVAL '5 days');

-- Create sample downline referrals for the admin (create some referred users first)
INSERT INTO users (idnum, name, "userName", email, password, balance, "referredByCode", role, created_at) VALUES
('REF001', 'John Smith', 'johnsmith', 'john@example.com', '$2b$10$dummyhash', 2500.00, 'ADMIN001', 'user', NOW() - INTERVAL '20 days'),
('REF002', 'Sarah Johnson', 'sarahj', 'sarah@example.com', '$2b$10$dummyhash', 1800.00, 'ADMIN001', 'user', NOW() - INTERVAL '18 days'),
('REF003', 'Mike Wilson', 'mikew', 'mike@example.com', '$2b$10$dummyhash', 3200.00, 'ADMIN001', 'user', NOW() - INTERVAL '15 days'),
('REF004', 'Emma Davis', 'emmad', 'emma@example.com', '$2b$10$dummyhash', 950.00, 'ADMIN001', 'user', NOW() - INTERVAL '12 days'),
('REF005', 'Alex Brown', 'alexb', 'alex@example.com', '$2b$10$dummyhash', 4100.00, 'ADMIN001', 'user', NOW() - INTERVAL '8 days');

-- Create additional regular users for admin to manage
INSERT INTO users (idnum, name, "userName", email, password, "phoneNumber", country, city, balance, bonus, role, created_at) VALUES
('USR001', 'Alice Cooper', 'alicec', 'alice@example.com', '$2b$10$dummyhash', '+1555123456', 'United States', 'Los Angeles', 12500.00, 750.00, 'user', NOW() - INTERVAL '25 days'),
('USR002', 'Bob Wilson', 'bobw', 'bob@example.com', '$2b$10$dummyhash', '+1555234567', 'Canada', 'Toronto', 8750.00, 450.00, 'user', NOW() - INTERVAL '22 days'),
('USR003', 'Carol Davis', 'carold', 'carol@example.com', '$2b$10$dummyhash', '+1555345678', 'United Kingdom', 'London', 15200.00, 1200.00, 'user', NOW() - INTERVAL '19 days'),
('USR004', 'David Miller', 'davidm', 'david@example.com', '$2b$10$dummyhash', '+1555456789', 'Australia', 'Sydney', 6300.00, 300.00, 'user', NOW() - INTERVAL '16 days'),
('USR005', 'Eva Garcia', 'evag', 'eva@example.com', '$2b$10$dummyhash', '+1555567890', 'Spain', 'Madrid', 18900.00, 950.00, 'user', NOW() - INTERVAL '14 days'),
('USR006', 'Frank Johnson', 'frankj', 'frank@example.com', '$2b$10$dummyhash', '+1555678901', 'Germany', 'Berlin', 4200.00, 200.00, 'user', NOW() - INTERVAL '12 days'),
('USR007', 'Grace Lee', 'gracel', 'grace@example.com', '$2b$10$dummyhash', '+1555789012', 'South Korea', 'Seoul', 25600.00, 1800.00, 'user', NOW() - INTERVAL '10 days'),
('USR008', 'Henry Brown', 'henryb', 'henry@example.com', '$2b$10$dummyhash', '+1555890123', 'Japan', 'Tokyo', 7800.00, 600.00, 'user', NOW() - INTERVAL '8 days');

-- Create investments for regular users
INSERT INTO investments (idnum, plan, status, capital, roi, bonus, duration, "paymentOption", "transactionHash", "authStatus", "creditedRoi", "creditedBonus", date) VALUES
('USR001', 'Premium Plan', 'active', 10000.00, 2500.00, 500.00, 30, 'Bitcoin', 'tx_usr001_inv_001', 'approved', 2500.00, 500.00, NOW() - INTERVAL '20 days'),
('USR001', 'Starter Plan', 'active', 2500.00, 375.00, 125.00, 15, 'USDT', 'tx_usr001_inv_002', 'approved', 375.00, 125.00, NOW() - INTERVAL '10 days'),
('USR002', 'VIP Plan', 'active', 15000.00, 4500.00, 1500.00, 60, 'Ethereum', 'tx_usr002_inv_001', 'approved', 4500.00, 1500.00, NOW() - INTERVAL '18 days'),
('USR003', 'Premium Plan', 'pending', 20000.00, 0.00, 0.00, 30, 'Bitcoin', 'tx_usr003_inv_001', 'pending', 0.00, 0.00, NOW() - INTERVAL '2 days'),
('USR004', 'Starter Plan', 'active', 5000.00, 750.00, 250.00, 15, 'USDT', 'tx_usr004_inv_001', 'approved', 750.00, 250.00, NOW() - INTERVAL '12 days'),
('USR005', 'VIP Plan', 'active', 30000.00, 9000.00, 3000.00, 60, 'Bitcoin', 'tx_usr005_inv_001', 'approved', 9000.00, 3000.00, NOW() - INTERVAL '10 days'),
('USR006', 'Starter Plan', 'pending', 3000.00, 0.00, 0.00, 15, 'Ethereum', 'tx_usr006_inv_001', 'pending', 0.00, 0.00, NOW() - INTERVAL '1 day'),
('USR007', 'Premium Plan', 'active', 25000.00, 6250.00, 2500.00, 30, 'USDT', 'tx_usr007_inv_001', 'approved', 6250.00, 2500.00, NOW() - INTERVAL '8 days'),
('USR008', 'VIP Plan', 'pending', 10000.00, 0.00, 0.00, 60, 'Bitcoin', 'tx_usr008_inv_001', 'pending', 0.00, 0.00, NOW() - INTERVAL '3 days');

-- Create withdrawals for regular users
INSERT INTO withdrawals (idnum, amount, wallet, status, method, "authStatus", date) VALUES
('USR001', 1500.00, 'bc1qalicewallet1234567890abcdef', 'approved', 'Bitcoin', 'approved', NOW() - INTERVAL '15 days'),
('USR002', 2000.00, '0xBobWallet1234567890ABCDEF', 'completed', 'Ethereum', 'approved', NOW() - INTERVAL '12 days'),
('USR003', 3000.00, 'TCarolWallet1234567890ABCDEF', 'pending', 'USDT', 'pending', NOW() - INTERVAL '1 day'),
('USR004', 800.00, 'bc1qdavidwallet1234567890abcdef', 'approved', 'Bitcoin', 'approved', NOW() - INTERVAL '8 days'),
('USR005', 5000.00, '0xEvaWallet1234567890ABCDEF', 'completed', 'Ethereum', 'approved', NOW() - INTERVAL '6 days'),
('USR006', 1200.00, 'TFrankWallet1234567890ABCDEF', 'pending', 'USDT', 'pending', NOW() - INTERVAL '2 days'),
('USR007', 4000.00, 'bc1qgracewallet1234567890abcdef', 'approved', 'Bitcoin', 'approved', NOW() - INTERVAL '5 days'),
('USR008', 1500.00, '0xHenryWallet1234567890ABCDEF', 'pending', 'Ethereum', 'pending', NOW() - INTERVAL '1 day');

-- Create loans for regular users
INSERT INTO loans (idnum, amount, status, "interestRate", duration, "authStatus", date) VALUES
('USR001', 8000.00, 'approved', 8.5, 12, 'approved', NOW() - INTERVAL '20 days'),
('USR002', 12000.00, 'active', 7.2, 18, 'approved', NOW() - INTERVAL '15 days'),
('USR003', 25000.00, 'pending', 9.0, 24, 'pending', NOW() - INTERVAL '3 days'),
('USR004', 5000.00, 'approved', 6.8, 6, 'approved', NOW() - INTERVAL '10 days'),
('USR005', 35000.00, 'active', 8.0, 36, 'approved', NOW() - INTERVAL '12 days'),
('USR006', 3000.00, 'pending', 7.5, 12, 'pending', NOW() - INTERVAL '2 days'),
('USR007', 20000.00, 'approved', 8.2, 24, 'approved', NOW() - INTERVAL '8 days'),
('USR008', 15000.00, 'pending', 9.5, 18, 'pending', NOW() - INTERVAL '4 days');

-- Create KYC verification requests for regular users
INSERT INTO kyc_verifications (idnum, "fullName", "dateOfBirth", nationality, "documentType", "documentNumber", status, "submittedAt") VALUES
('USR001', 'Alice Cooper', '1990-03-15', 'United States', 'passport', 'P987654321', 'approved', NOW() - INTERVAL '25 days'),
('USR002', 'Bob Wilson', '1988-07-22', 'Canada', 'drivers_license', 'DL123456789', 'approved', NOW() - INTERVAL '22 days'),
('USR003', 'Carol Davis', '1992-11-08', 'United Kingdom', 'passport', 'P555666777', 'pending', NOW() - INTERVAL '5 days'),
('USR004', 'David Miller', '1985-01-30', 'Australia', 'passport', 'P444555666', 'approved', NOW() - INTERVAL '16 days'),
('USR005', 'Eva Garcia', '1991-09-12', 'Spain', 'id_card', 'ID333444555', 'approved', NOW() - INTERVAL '14 days'),
('USR006', 'Frank Johnson', '1987-05-18', 'Germany', 'passport', 'P222333444', 'pending', NOW() - INTERVAL '3 days'),
('USR007', 'Grace Lee', '1993-12-25', 'South Korea', 'drivers_license', 'DL111222333', 'approved', NOW() - INTERVAL '10 days'),
('USR008', 'Henry Brown', '1989-06-14', 'Japan', 'passport', 'P000111222', 'pending', NOW() - INTERVAL '2 days');

-- Create transactions for regular users
INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at) VALUES
('USR001', 'deposit', 12500.00, 'completed', 'Initial deposit', 'dep_usr001_001', NOW() - INTERVAL '25 days'),
('USR001', 'investment', 10000.00, 'completed', 'Premium Plan investment', 'inv_usr001_001', NOW() - INTERVAL '20 days'),
('USR001', 'roi', 2500.00, 'completed', 'ROI from Premium Plan', 'roi_usr001_001', NOW() - INTERVAL '15 days'),
('USR002', 'deposit', 8750.00, 'completed', 'Initial deposit', 'dep_usr002_001', NOW() - INTERVAL '22 days'),
('USR002', 'investment', 15000.00, 'completed', 'VIP Plan investment', 'inv_usr002_001', NOW() - INTERVAL '18 days'),
('USR003', 'deposit', 15200.00, 'completed', 'Initial deposit', 'dep_usr003_001', NOW() - INTERVAL '19 days'),
('USR004', 'deposit', 6300.00, 'completed', 'Initial deposit', 'dep_usr004_001', NOW() - INTERVAL '16 days'),
('USR005', 'deposit', 18900.00, 'completed', 'Initial deposit', 'dep_usr005_001', NOW() - INTERVAL '14 days'),
('USR006', 'deposit', 4200.00, 'completed', 'Initial deposit', 'dep_usr006_001', NOW() - INTERVAL '12 days'),
('USR007', 'deposit', 25600.00, 'completed', 'Initial deposit', 'dep_usr007_001', NOW() - INTERVAL '10 days'),
('USR008', 'deposit', 7800.00, 'completed', 'Initial deposit', 'dep_usr008_001', NOW() - INTERVAL '8 days');

-- Create notifications for regular users
INSERT INTO notifications (idnum, title, message, type, read, created_at) VALUES
('USR001', 'Welcome to eToro Trust Capital', 'Welcome! Your account has been created successfully.', 'success', true, NOW() - INTERVAL '25 days'),
('USR003', 'KYC Verification Required', 'Please complete your KYC verification to unlock all features.', 'warning', false, NOW() - INTERVAL '5 days'),
('USR006', 'KYC Verification Required', 'Please complete your KYC verification to unlock all features.', 'warning', false, NOW() - INTERVAL '3 days'),
('USR008', 'KYC Verification Required', 'Please complete your KYC verification to unlock all features.', 'warning', false, NOW() - INTERVAL '2 days');

-- Create referral relationships
INSERT INTO referrals ("referrerId", "referredId", "referralCode", "bonusEarned", level, created_at) VALUES
('ADM001', 'REF001', 'ADMIN001', 100.00, 1, NOW() - INTERVAL '20 days'),
('ADM001', 'REF002', 'ADMIN001', 75.00, 1, NOW() - INTERVAL '18 days'),
('ADM001', 'REF003', 'ADMIN001', 150.00, 1, NOW() - INTERVAL '15 days'),
('ADM001', 'REF004', 'ADMIN001', 50.00, 1, NOW() - INTERVAL '12 days'),
('ADM001', 'REF005', 'ADMIN001', 200.00, 1, NOW() - INTERVAL '8 days'),
('USR001', 'USR002', 'REF001', 50.00, 2, NOW() - INTERVAL '22 days'),
('USR003', 'USR004', 'REF003', 75.00, 2, NOW() - INTERVAL '16 days'),
('USR005', 'USR006', 'REF005', 100.00, 2, NOW() - INTERVAL '12 days');

-- Update admin's referral count and bonus
UPDATE users SET
  "referralCount" = 5,
  "referralBonusTotal" = 575.00,
  bonus = bonus + 575.00
WHERE idnum = 'ADM001';

-- Verify the admin user was created with all data
SELECT
  u.idnum,
  u.name,
  u."userName",
  u.email,
  u.balance,
  u.bonus,
  u."referralCount",
  u."referralBonusTotal",
  u.role,
  COUNT(DISTINCT i.id) as investment_count,
  COUNT(DISTINCT w.id) as withdrawal_count,
  COUNT(DISTINCT l.id) as loan_count,
  COUNT(DISTINCT k.id) as kyc_count,
  COUNT(DISTINCT r.id) as referral_count
FROM users u
LEFT JOIN investments i ON u.idnum = i.idnum
LEFT JOIN withdrawals w ON u.idnum = w.idnum
LEFT JOIN loans l ON u.idnum = l.idnum
LEFT JOIN kyc_verifications k ON u.idnum = k.idnum
LEFT JOIN referrals r ON u.idnum = r."referrerId"
WHERE u.email = 'admin@ciphervault.com'
GROUP BY u.idnum, u.name, u."userName", u.email, u.balance, u.bonus, u."referralCount", u."referralBonusTotal", u.role;

-- Show system-wide statistics for admin overview
SELECT
  'SYSTEM_STATS' as category,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.role = 'admin' THEN u.id END) as admin_users,
  COUNT(DISTINCT CASE WHEN u.role = 'user' THEN u.id END) as regular_users,
  COUNT(DISTINCT i.id) as total_investments,
  COUNT(DISTINCT CASE WHEN i.status = 'pending' THEN i.id END) as pending_investments,
  COUNT(DISTINCT CASE WHEN i.status = 'active' THEN i.id END) as active_investments,
  COUNT(DISTINCT w.id) as total_withdrawals,
  COUNT(DISTINCT CASE WHEN w.status = 'pending' THEN w.id END) as pending_withdrawals,
  COUNT(DISTINCT l.id) as total_loans,
  COUNT(DISTINCT CASE WHEN l.status = 'pending' THEN l.id END) as pending_loans,
  COUNT(DISTINCT k.id) as total_kyc_requests,
  COUNT(DISTINCT CASE WHEN k.status = 'pending' THEN k.id END) as pending_kyc_requests,
  COUNT(DISTINCT r.id) as total_referrals
FROM users u
LEFT JOIN investments i ON u.idnum = i.idnum
LEFT JOIN withdrawals w ON u.idnum = w.idnum
LEFT JOIN loans l ON u.idnum = l.idnum
LEFT JOIN kyc_verifications k ON u.idnum = k.idnum
LEFT JOIN referrals r ON u.idnum = r."referrerId";