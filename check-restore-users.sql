-- Check what happened to users and restore if possible
-- Run this in Supabase SQL Editor

-- Check current state of users table
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count_by_role FROM users GROUP BY role;

-- Check if users table exists and has structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- If users were accidentally deleted, here are some test users you can restore:
-- Uncomment and modify the INSERT statements below to recreate test users

/*
-- Test User 1
INSERT INTO users (
  idnum, name, "userName", email, password, balance, bonus, role, created_at
) VALUES (
  'USR001',
  'John Doe',
  'johndoe',
  'john@example.com',
  '$2b$10$CHjR.mh58Qp27LUcBJf43O7fSjGXcXwWQ4sDmcMDH2koeYoZztdS6', -- Same password as admin
  5000.00,
  100.00,
  'user',
  NOW() - INTERVAL '10 days'
);

-- Test User 2
INSERT INTO users (
  idnum, name, "userName", email, password, balance, bonus, role, created_at
) VALUES (
  'USR002',
  'Jane Smith',
  'janesmith',
  'jane@example.com',
  '$2b$10$CHjR.mh58Qp27LUcBJf43O7fSjGXcXwWQ4sDmcMDH2koeYoZztdS6', -- Same password as admin
  2500.00,
  50.00,
  'user',
  NOW() - INTERVAL '5 days'
);

-- Test User 3
INSERT INTO users (
  idnum, name, "userName", email, password, balance, bonus, role, created_at
) VALUES (
  'USR003',
  'Bob Johnson',
  'bobjohnson',
  'bob@example.com',
  '$2b$10$CHjR.mh58Qp27LUcBJf43O7fSjGXcXwWQ4sDmcMDH2koeYoZztdS6', -- Same password as admin
  10000.00,
  200.00,
  'user',
  NOW() - INTERVAL '15 days'
);
*/

-- After running the INSERT statements above, verify users were created:
-- SELECT idnum, email, "userName", role, balance FROM users WHERE role = 'user';