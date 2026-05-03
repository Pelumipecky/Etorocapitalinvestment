-- ================================================
-- BINANCE CLONE DATABASE SCHEMA
-- ================================================
-- This SQL file creates all required tables for the Binance Clone application
-- Run this in your Supabase SQL Editor to set up the database

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT UNIQUE NOT NULL,
  name TEXT,
  "userName" TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "phoneNumber" TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  balance NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  "completedTrades" INTEGER DEFAULT 0,
  date TIMESTAMP DEFAULT NOW(),
  avatar TEXT,
  "investmentCount" INTEGER DEFAULT 0,
  "referralCount" INTEGER DEFAULT 0,
  "referralBonusTotal" NUMERIC DEFAULT 0,
  "referralCode" TEXT UNIQUE,
  "referralCodeExpiresAt" TIMESTAMP,
  "referralCodeIssuedAt" TIMESTAMP,
  "referredByCode" TEXT,
  "referralLevel" INTEGER DEFAULT 0,
  "authStatus" TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_idnum ON users(idnum);
CREATE INDEX IF NOT EXISTS idx_users_userName ON users("userName");
CREATE INDEX IF NOT EXISTS idx_users_referralCode ON users("referralCode");
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ================================================
-- INVESTMENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  capital NUMERIC NOT NULL,
  roi NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  duration INTEGER NOT NULL,
  "paymentOption" TEXT,
  "transactionHash" TEXT,
  "paymentProofUrl" TEXT,
  "authStatus" TEXT DEFAULT 'pending',
  "creditedRoi" NUMERIC DEFAULT 0,
  "creditedBonus" NUMERIC DEFAULT 0,
  "startDate" TIMESTAMP,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_investments_idnum ON investments(idnum);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_authStatus ON investments("authStatus");
CREATE INDEX IF NOT EXISTS idx_investments_created_at ON investments(created_at);

-- ================================================
-- WITHDRAWALS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  wallet TEXT,
  "walletAddress" TEXT,
  "bankName" TEXT,
  "accountNumber" TEXT,
  "accountName" TEXT,
  "routingNumber" TEXT,
  status TEXT DEFAULT 'pending',
  method TEXT NOT NULL,
  "authStatus" TEXT DEFAULT 'pending',
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_withdrawals_idnum ON withdrawals(idnum);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_authStatus ON withdrawals("authStatus");
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);

-- ================================================
-- LOANS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  "interestRate" NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  "authStatus" TEXT DEFAULT 'pending',
  purpose TEXT,
  "totalRepayment" NUMERIC,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Personal Information
  "fullName" TEXT,
  "dateOfBirth" DATE,
  "phoneNumber" TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  "maritalStatus" TEXT,
  dependents INTEGER,

  -- Work Information
  "employmentStatus" TEXT,
  "employerName" TEXT,
  "jobTitle" TEXT,
  "monthlyIncome" NUMERIC,
  "workExperience" INTEGER,
  "employerPhone" TEXT,
  "employerAddress" TEXT,

  -- Financial Information
  "monthlyExpenses" NUMERIC,
  "otherIncome" NUMERIC,
  "existingDebts" NUMERIC,
  collateral TEXT,

  -- References
  "reference1Name" TEXT,
  "reference1Phone" TEXT,
  "reference1Relationship" TEXT,
  "reference2Name" TEXT,
  "reference2Phone" TEXT,
  "reference2Relationship" TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_loans_idnum ON loans(idnum);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_authStatus ON loans("authStatus");

-- ================================================
-- NOTIFICATIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_idnum ON notifications(idnum);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ================================================
-- KYC VERIFICATIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  "fullName" TEXT NOT NULL,
  "dateOfBirth" DATE NOT NULL,
  nationality TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "documentNumber" TEXT NOT NULL,
  "documentFrontUrl" TEXT,
  "documentBackUrl" TEXT,
  "selfieUrl" TEXT,
  status TEXT DEFAULT 'pending',
  "rejectionReason" TEXT,
  "submittedAt" TIMESTAMP DEFAULT NOW(),
  "reviewedAt" TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_kyc_idnum ON kyc_verifications(idnum);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_verifications(status);

-- ================================================
-- TRANSACTIONS TABLE (for transaction history)
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'investment', 'roi', 'bonus', 'referral'
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'completed',
  description TEXT,
  reference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_idnum ON transactions(idnum);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ================================================
-- REFERRALS TABLE (tracking referral relationships)
-- ================================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "referrerId" TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  "referredId" TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  "referralCode" TEXT NOT NULL,
  "bonusEarned" NUMERIC DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE("referrerId", "referredId")
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrerId ON referrals("referrerId");
CREATE INDEX IF NOT EXISTS idx_referrals_referredId ON referrals("referredId");

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investments_updated_at ON investments;
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_withdrawals_updated_at ON withdrawals;
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loans_updated_at ON loans;
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kyc_updated_at ON kyc_verifications;
CREATE TRIGGER update_kyc_updated_at BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DEPOSITS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum TEXT NOT NULL REFERENCES users(idnum) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  "walletAddress" TEXT,
  "bankName" TEXT,
  "accountNumber" TEXT,
  "accountName" TEXT,
  "routingNumber" TEXT,
  "transactionHash" TEXT,
  "paymentProofUrl" TEXT,
  status TEXT DEFAULT 'pending',
  "authStatus" TEXT DEFAULT 'pending',
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_deposits_idnum ON deposits(idnum);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_authStatus ON deposits("authStatus");
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON deposits(created_at);

-- Add trigger for deposits table
DROP TRIGGER IF EXISTS update_deposits_updated_at ON deposits;
CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON deposits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- DISABLED FOR DEVELOPMENT - Uncomment to enable in production
-- Enable RLS on all tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- DEVELOPMENT MODE: RLS is DISABLED for easier testing
-- All operations allowed without restrictions
-- WARNING: Enable RLS policies before deploying to production!

-- ================================================
-- NOTES
-- ================================================
-- 1. Run this script in your Supabase SQL Editor
-- 2. RLS is DISABLED for development - enable before production
-- 3. All tables created with proper indexes and foreign keys
-- 4. The schema uses 'idnum' as a text-based user identifier
-- 5. Passwords are hashed with bcrypt in the application layer
-- 6. Create users through the signup form at /signup