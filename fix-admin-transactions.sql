-- Fix transactions for existing admin user
-- Run this after the admin user is created

-- Add sample transactions for the admin (only if admin exists)
INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at)
SELECT 'ADM001', 'deposit', 10000.00, 'completed', 'Initial deposit via Bitcoin', 'tx_admin_dep_001', NOW() - INTERVAL '25 days'
WHERE EXISTS (SELECT 1 FROM users WHERE idnum = 'ADM001');

INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at)
SELECT 'ADM001', 'withdrawal', 2000.00, 'completed', 'Withdrawal to Bitcoin wallet', 'tx_admin_wd_001', NOW() - INTERVAL '20 days'
WHERE EXISTS (SELECT 1 FROM users WHERE idnum = 'ADM001');

INSERT INTO transactions (idnum, type, amount, status, description, reference, created_at)
SELECT 'ADM001', 'investment', 10000.00, 'completed', 'Premium Plan investment', 'tx_admin_inv_001', NOW() - INTERVAL '15 days'
WHERE EXISTS (SELECT 1 FROM users WHERE idnum = 'ADM001');

-- Verify admin user and transactions
SELECT idnum, email, "userName", role, balance FROM users WHERE role = 'admin';
SELECT type, amount, status, description FROM transactions WHERE idnum = 'ADM001';