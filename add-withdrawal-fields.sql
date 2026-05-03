-- Add missing fields to withdrawals table for proper withdrawal submission
-- Run this in your Supabase SQL Editor if you have existing data

ALTER TABLE withdrawals
ADD COLUMN IF NOT EXISTS "walletAddress" TEXT,
ADD COLUMN IF NOT EXISTS "bankName" TEXT,
ADD COLUMN IF NOT EXISTS "accountNumber" TEXT,
ADD COLUMN IF NOT EXISTS "accountName" TEXT,
ADD COLUMN IF NOT EXISTS "routingNumber" TEXT;

-- Update the wallet column to be nullable since we're now using walletAddress for crypto
ALTER TABLE withdrawals
ALTER COLUMN wallet DROP NOT NULL;