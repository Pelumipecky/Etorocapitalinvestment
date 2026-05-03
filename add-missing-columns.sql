-- ================================================
-- ADD MISSING COLUMNS TO USERS TABLE
-- ================================================
-- Run this script in your Supabase SQL Editor to add missing columns
-- to an existing users table

-- Step 1: Add missing columns (these will be no-ops if columns already exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin'));

-- Add missing columns to loans table
ALTER TABLE loans ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "totalRepayment" NUMERIC;

-- Add comprehensive loan application columns
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "fullName" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "dateOfBirth" DATE;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "maritalStatus" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS dependents INTEGER;

ALTER TABLE loans ADD COLUMN IF NOT EXISTS "employmentStatus" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "employerName" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "jobTitle" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "monthlyIncome" NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "workExperience" INTEGER;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "employerPhone" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "employerAddress" TEXT;

ALTER TABLE loans ADD COLUMN IF NOT EXISTS "monthlyExpenses" NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "otherIncome" NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "existingDebts" NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS collateral TEXT;

ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference1Name" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference1Phone" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference1Relationship" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference2Name" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference2Phone" TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS "reference2Relationship" TEXT;

-- Step 2: Migrate admin column to role if it exists
DO $$
BEGIN
    -- Check if admin column exists and migrate
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'admin') THEN
        -- Update roles based on admin status
        UPDATE users SET role = 'admin' WHERE admin = true;
        UPDATE users SET role = 'user' WHERE admin = false OR admin IS NULL;

        -- Drop the old admin column
        ALTER TABLE users DROP COLUMN admin;
    END IF;
END $$;

-- Step 3: Verify the migration was successful
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('phoneNumber', 'country', 'city', 'address', 'role', 'admin')
ORDER BY column_name;

-- Verify loans table columns
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'loans'
AND column_name IN ('purpose', 'totalRepayment')
ORDER BY column_name;
