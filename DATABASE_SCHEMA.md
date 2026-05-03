# Database Schema Setup Guide

## Overview
This document describes all the required database tables for the eToro Trust Capital application and how to set them up in Supabase.

## Required Tables

### 1. **users** - User accounts and profile information
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Unique user identifier
- `name` (TEXT) - Full name
- `userName` (TEXT) - Unique username
- `email` (TEXT) - Unique email address
- `password` (TEXT) - Hashed password (bcrypt)
- `phoneNumber` (TEXT) - Phone number
- `country` (TEXT) - Country
- `city` (TEXT) - City
- `address` (TEXT) - Address
- `balance` (NUMERIC) - Account balance
- `bonus` (NUMERIC) - Bonus balance
- `avatar` (TEXT) - Avatar image identifier
- `investmentCount` (INTEGER) - Number of investments
- `referralCount` (INTEGER) - Number of referrals
- `referralBonusTotal` (NUMERIC) - Total referral bonuses earned
- `referralCode` (TEXT) - User's unique referral code
- `referralCodeExpiresAt` (TIMESTAMP) - Referral code expiration
- `referralCodeIssuedAt` (TIMESTAMP) - Referral code issue date
- `referredByCode` (TEXT) - Referral code used to sign up
- `referralLevel` (INTEGER) - Referral level
- `authStatus` (TEXT) - Authentication status
- `role` (TEXT) - User role: 'user', 'admin', or 'superadmin'
- `date` (TIMESTAMP) - Account creation date
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### 2. **investments** - Investment records
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `plan` (TEXT) - Investment plan name
- `status` (TEXT) - Status: 'pending', 'active', 'completed'
- `capital` (NUMERIC) - Investment amount
- `roi` (NUMERIC) - Return on investment
- `bonus` (NUMERIC) - Bonus amount
- `duration` (INTEGER) - Duration in days
- `paymentOption` (TEXT) - Payment method
- `transactionHash` (TEXT) - Blockchain transaction hash
- `authStatus` (TEXT) - Admin approval status
- `creditedRoi` (NUMERIC) - ROI already credited
- `creditedBonus` (NUMERIC) - Bonus already credited
- `date` (TIMESTAMP) - Investment date
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### 3. **withdrawals** - Withdrawal requests
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `amount` (NUMERIC) - Withdrawal amount
- `wallet` (TEXT) - Destination wallet address
- `status` (TEXT) - Status: 'pending', 'approved', 'rejected'
- `method` (TEXT) - Withdrawal method
- `authStatus` (TEXT) - Admin approval status
- `date` (TIMESTAMP) - Request date
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### 4. **loans** - Loan requests
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `amount` (NUMERIC) - Loan amount
- `status` (TEXT) - Status: 'pending', 'approved', 'rejected'
- `interestRate` (NUMERIC) - Interest rate percentage
- `duration` (INTEGER) - Loan duration in days
- `authStatus` (TEXT) - Admin approval status
- `date` (TIMESTAMP) - Request date
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### 5. **notifications** - User notifications
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `title` (TEXT) - Notification title
- `message` (TEXT) - Notification message
- `type` (TEXT) - Type: 'info', 'success', 'warning', 'error'
- `read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Creation timestamp

### 6. **kyc_verifications** - KYC verification records
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `fullName` (TEXT) - Full legal name
- `dateOfBirth` (DATE) - Date of birth
- `nationality` (TEXT) - Nationality
- `documentType` (TEXT) - ID document type
- `documentNumber` (TEXT) - ID document number
- `documentFrontUrl` (TEXT) - Front of ID document URL
- `documentBackUrl` (TEXT) - Back of ID document URL
- `selfieUrl` (TEXT) - Selfie photo URL
- `status` (TEXT) - Status: 'pending', 'approved', 'rejected'
- `rejectionReason` (TEXT) - Reason for rejection
- `submittedAt` (TIMESTAMP) - Submission timestamp
- `reviewedAt` (TIMESTAMP) - Review timestamp
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### 7. **transactions** - Transaction history
**Columns:**
- `id` (UUID) - Primary key
- `idnum` (TEXT) - Foreign key to users
- `type` (TEXT) - Type: 'deposit', 'withdrawal', 'investment', 'roi', 'bonus', 'referral'
- `amount` (NUMERIC) - Transaction amount
- `status` (TEXT) - Status: 'completed', 'pending', 'failed'
- `description` (TEXT) - Transaction description
- `reference` (TEXT) - Transaction reference
- `created_at` (TIMESTAMP) - Creation timestamp

### 8. **referrals** - Referral tracking
**Columns:**
- `id` (UUID) - Primary key
- `referrerId` (TEXT) - Foreign key to users (referrer)
- `referredId` (TEXT) - Foreign key to users (referred user)
- `referralCode` (TEXT) - Referral code used
- `bonusEarned` (NUMERIC) - Bonus earned from referral
- `level` (INTEGER) - Referral level (1, 2, or 3)
- `created_at` (TIMESTAMP) - Creation timestamp

## Setup Instructions

### For New Database:
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run the SQL script
5. All tables will be created with proper indexes and relationships

### For Existing Database (Missing Columns):
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `add-missing-columns.sql`
4. Paste and run the SQL script
5. Missing columns will be added to the users table

## Database Features

✅ **Foreign Keys** - Proper relationships between tables  
✅ **Indexes** - Optimized for common queries  
✅ **Triggers** - Automatic `updated_at` timestamp updates  
✅ **Constraints** - Data integrity enforcement  
✅ **Cascade Deletes** - Clean up related records when users are deleted  

## Row Level Security (RLS)

⚠️ **Currently DISABLED for development**

RLS policies are commented out in the schema for easier testing. Before deploying to production:
1. Uncomment the RLS ENABLE statements
2. Add appropriate policies for each table
3. Test access control thoroughly

## Verifying Setup

After running the schema, verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected tables:
- investments
- kyc_verifications
- loans
- notifications
- referrals
- transactions
- users
- withdrawals

## Environment Variables

Ensure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Testing Database Connection

Run the app locally and try to sign up. Check the browser console for connection status:
- ✅ `[supabaseConfig] Supabase client initialized successfully`
- ❌ `[supabaseConfig] Supabase not configured`

## Troubleshooting

**Issue:** "Cannot create account"  
**Solution:** Run `add-missing-columns.sql` to add phoneNumber, country, city, address fields

**Issue:** "Failed to fetch"  
**Solution:** Check your internet connection and Supabase project status

**Issue:** "Email already registered"  
**Solution:** Use a different email or login with the existing account

**Issue:** "Role violation"  
**Solution:** Ensure role column accepts 'user', 'admin', 'superadmin'

## Admin Account

To create an admin account, use the signup form with special code:
- Navigate to `/signup`
- Use referral code: `ADMIN2024`
- Account will be created with admin role

Or run `create-admin-user.sql` directly in Supabase SQL Editor.
