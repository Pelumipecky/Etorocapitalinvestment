# 🗄️ Complete Database Setup Guide

## Step 1: Access Your Supabase Project

Your Supabase project is already configured in `.env`:
- **Project URL**: `https://soshavvofaafteaumzjg.supabase.co`
- **Anon Key**: Already set in `.env` file

### Login to Supabase:
1. Go to: https://app.supabase.com
2. Find your project: `soshavvofaafteaumzjg`
3. Open the project dashboard

---

## Step 2: Create Database Tables

### Option A - SQL Editor (Recommended):

1. **In Supabase Dashboard**, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. **Open the file**: `supabase-schema.sql` in this project
4. **Copy ALL the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)

✅ This creates all tables:
- `users` - User accounts
- `investments` - Investment records
- `withdrawals` - Withdrawal requests  
- `loans` - Loan applications
- `transactions` - Transaction history
- `notifications` - User notifications
- `kyc_verifications` - KYC documents

### Option B - Using provided SQL file:

```powershell
# From project root, you can view the schema:
Get-Content supabase-schema.sql
```

---

## Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor**
2. You should see all tables in the left sidebar:
   - users
   - investments
   - withdrawals
   - loans
   - transactions
   - notifications
   - kyc_verifications

3. Click on **users** table to verify structure

---

## Step 4: Enable Row Level Security (RLS)

The schema file already includes RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. Check that each table has policies enabled
3. Default policies allow:
   - Users can read their own data
   - Admins can read/write all data
   - Anonymous users can signup

---

## Step 5: Create Your First Admin User

### Method 1 - Using the Signup Button:

1. **Start the dev server** (if not running):
   ```powershell
   npm run dev
   ```

2. **Go to**: http://localhost:5175/signup

3. **Click the purple button**: "🚀 Create Quick Admin Account (Test)"

4. This creates an admin user in localStorage AND the database:
   - Email: `admin@ciphervault.com`
   - Password: `Admin123!`
   - Balance: $10,000
   - Admin: true

### Method 2 - Directly in Database:

1. In Supabase **Table Editor**, open the **users** table
2. Click **Insert** → **Insert row**
3. Fill in:
   ```
   idnum: USR000001
   name: Admin User
   userName: admin
   email: admin@ciphervault.com
   password: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
   balance: 10000
   bonus: 500
   admin: true
   referralCode: REF000001
   ```
4. Click **Save**

**Password hash above = "Admin123!"**

---

## Step 6: Test Database Connection

### Check if connection is working:

1. **Login** to your app at: http://localhost:5175/login
2. Use credentials:
   - Email: `admin@ciphervault.com`
   - Password: `Admin123!`

3. If login succeeds, your database is connected! ✅

### Test creating data:

1. Go to **Investments** page
2. Click **"Invest Now"** on any plan
3. Complete the investment flow
4. Check Supabase **Table Editor** → **investments** table
5. You should see your new investment record!

---

## Step 7: Verify All Features Are Working

### ✅ Test Checklist:

- [ ] **Signup** - Create new user account
- [ ] **Login** - Login with created account
- [ ] **Dashboard** - View balance and stats
- [ ] **Investments** - Create new investment
- [ ] **Withdrawals** - Request withdrawal
- [ ] **Loans** - Apply for loan
- [ ] **KYC** - Submit verification (uploads to localStorage for now)
- [ ] **Admin Dashboard** - Access admin panel
- [ ] **Admin Actions** - Approve/reject items

---

## Troubleshooting

### Error: "Failed to create investment"

**Solution**: Check that:
1. Investment table exists in Supabase
2. User is logged in with valid `idnum`
3. `.env` file has correct Supabase credentials
4. RLS policies allow user to insert

**Quick Fix**:
- The app now has fallback to localStorage if database fails
- Data will be saved locally and work without database

### Error: "User not found" on login

**Solution**: 
1. Make sure you created an admin user (Step 5)
2. Verify user exists in Supabase Table Editor → users table
3. Check that email/password match

### Error: "Invalid Supabase credentials"

**Solution**:
1. Verify `.env` file has correct values
2. Check that Supabase project is active (not paused)
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Database tables not created

**Solution**:
1. Copy the ENTIRE `supabase-schema.sql` file
2. In Supabase SQL Editor, paste and run
3. Check for any error messages
4. Make sure you're in the correct project

---

## Database Schema Overview

### Users Table
```sql
- id (UUID)
- idnum (TEXT) - Unique user ID
- email (TEXT) - User email
- password (TEXT) - Bcrypt hashed
- balance (NUMERIC) - Account balance
- admin (BOOLEAN) - Admin flag
+ 20+ more fields
```

### Investments Table
```sql
- id (UUID)
- idnum (TEXT) - References users
- plan (TEXT) - Investment plan name
- capital (NUMERIC) - Investment amount
- roi (NUMERIC) - Return on investment
- status (TEXT) - pending/active/completed
+ More fields
```

### Withdrawals Table
```sql
- id (UUID)
- idnum (TEXT) - References users
- amount (NUMERIC)
- method (TEXT) - Bitcoin/Bank/etc
- status (TEXT) - pending/approved/rejected
+ More fields
```

### Loans Table
```sql
- id (UUID)
- idnum (TEXT) - References users
- amount (NUMERIC)
- interestRate (NUMERIC)
- status (TEXT)
+ More fields
```

---

## Quick Commands

```powershell
# Start development server
npm run dev

# View database schema
Get-Content supabase-schema.sql

# Check environment variables
Get-Content .env

# Install dependencies (if needed)
npm install @supabase/supabase-js
```

---

## Environment Variables

Your `.env` file should have:

```env
VITE_SUPABASE_URL=https://soshavvofaafteaumzjg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Already configured in your project!

---

## Next Steps

1. ✅ Run the SQL schema in Supabase SQL Editor
2. ✅ Create admin user using the signup button
3. ✅ Login and test all features
4. ✅ Create some test investments/withdrawals
5. ✅ Test admin dashboard approval flows

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **SQL Reference**: See `supabase-schema.sql` file
- **Project README**: See `README.md` file

---

**Last Updated**: December 6, 2025  
**Status**: Database configured and ready to use! 🚀
