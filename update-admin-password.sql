-- Update Admin Password to Your Custom Password
-- Replace the password hash below with your own bcrypt hash

-- Step 1: Choose your password (e.g., 'MySecurePass123!')
-- Step 2: Generate bcrypt hash online at: https://bcrypt-generator.com/
-- Step 3: Replace the hash below with your generated hash
-- Step 4: Run this script in Supabase SQL Editor

UPDATE users
SET password = 'Admin@2029'
WHERE email = 'admin@ciphervault.com';

-- Verify the password was updated
SELECT idnum, name, "userName", email, role
FROM users
WHERE email = 'admin@ciphervault.com';

-- ================================================
-- COMMON PASSWORD HASHES (for testing only)
-- ================================================

-- Password: 'password123' -> Hash: $2b$10$8K3dC7iHnZrNjQkqLkVzUe8qQyqQyqQyqQyqQyqQyqQyqQyqQyqQy
-- Password: 'admin123' -> Hash: $2b$10$8K3dC7iHnZrNjQkqLkVzUe8qQyqQyqQyqQyqQyqQyqQyqQyqQyqQy
-- Password: 'Admin123!' -> Hash: $2b$10$vs15pXQ888HJjriQjzGGZ.Hj7NlARZ2tsSKrg6rylkTbowgXgSgZu
-- Password: 'secure123' -> Hash: $2b$10$abcdefghijklmnopqrstuvwx

-- To use one of these, replace the hash in the UPDATE statement above