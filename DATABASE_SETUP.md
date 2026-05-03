# 🗄️ Database Setup Guide - eToro Trust Capital

This guide will help you connect your eToro Trust Capital application to Supabase database.

## 📋 Prerequisites

- A Supabase account (free tier works fine)
- Node.js and npm installed
- The eToro Trust Capital application cloned locally

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
  - **Name**: eToro Trust Capital (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click **"Create new project"** and wait 2-3 minutes for setup

### 2. Run the Database Schema

1. In your Supabase project, navigate to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see: **"Success. No rows returned"**

This creates all necessary tables:
- ✅ users
- ✅ investments
- ✅ withdrawals
- ✅ loans
- ✅ notifications
- ✅ kyc_verifications
- ✅ transactions
- ✅ referrals

### 3. Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** > **API** (left sidebar)
2. Find these two values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public** key: A long JWT token starting with `eyJ...`

### 4. Configure Environment Variables

1. Open the `.env` file in the root of your project
2. Update it with your credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Replace**:
   - `YOUR_PROJECT_ID` with your actual project ID
   - `your_anon_key_here` with your actual anon key

**⚠️ IMPORTANT**: Never commit the `.env` file to version control!

### 5. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `@types/bcryptjs` - TypeScript types

### 6. Restart Development Server

```bash
npm run dev
```

## 🎯 Testing the Connection

### Test 1: Create a New Account

1. Navigate to `/signup`
2. Fill in the signup form:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Phone: 1234567890
   - Password: testpass123
   - Confirm Password: testpass123
   - Check both checkboxes
3. Click **"Sign Up"**
4. If successful, you'll be redirected to the dashboard

### Test 2: Verify in Supabase

1. Go to your Supabase project
2. Navigate to **Table Editor** > **users**
3. You should see your new user account!

### Test 3: Login

1. Log out (if logged in)
2. Navigate to `/login`
3. Enter your email and password
4. Click **"Log In"**
5. You should be redirected to the dashboard with your data

## 📊 Understanding the Data Flow

### Signup Flow
```
User fills signup form
  ↓
AuthContext.signup() called
  ↓
supabaseAuth.signup() in supabaseUtils.ts
  ↓
Password hashed with bcrypt
  ↓
User record created in Supabase 'users' table
  ↓
User data stored in localStorage
  ↓
Redirect to dashboard
```

### Login Flow
```
User enters credentials
  ↓
AuthContext.login() called
  ↓
supabaseAuth.login() in supabaseUtils.ts
  ↓
Fetch user from Supabase by email
  ↓
Compare password with bcrypt
  ↓
User data stored in localStorage
  ↓
Redirect to dashboard
```

### Dashboard Data
```
Dashboard loads
  ↓
Check localStorage for activeUser
  ↓
Fetch user's investments from Supabase
  ↓
Display user balance, ROI, investments
  ↓
Real-time updates via Supabase subscriptions (optional)
```

## 🔒 Security Features

### Row Level Security (RLS)
The schema includes RLS policies that ensure:
- Users can only view/edit their own data
- Admins have elevated permissions
- Investment data is protected
- Transactions are immutable once created

### Password Security
- Passwords are hashed using bcrypt (10 rounds)
- Plain passwords are never stored
- Password comparison happens securely

### Session Management
- User sessions stored in localStorage
- Automatic session refresh on page load
- Secure logout clears all session data

## 🛠️ Troubleshooting

### Issue: "Supabase client is unavailable"
**Solution**: 
- Check that `.env` file exists and has correct values
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the dev server after changing `.env`

### Issue: "Email already registered"
**Solution**: 
- This email is already in the database
- Try a different email or login with existing credentials

### Issue: "Invalid email or password"
**Solution**: 
- Verify the email exists in Supabase Table Editor
- Ensure you're using the correct password
- Passwords are case-sensitive

### Issue: "Cannot read properties of undefined"
**Solution**: 
- Ensure the database schema is properly loaded
- Check browser console for specific errors
- Verify all tables exist in Supabase Table Editor

### Issue: Network errors / timeouts
**Solution**: 
- Check your internet connection
- Verify Supabase project is not paused (free tier pauses after inactivity)
- Check Supabase status page: [https://status.supabase.com](https://status.supabase.com)

## 📚 Advanced Features

### Real-time Subscriptions
Enable real-time updates for live data:

```typescript
import { supabaseRealtime } from '@/lib/supabaseUtils'

// Subscribe to investment changes
const subscription = supabaseRealtime.subscribeToInvestments((payload) => {
  console.log('Investment updated:', payload)
  // Refresh your data here
})

// Cleanup on unmount
return () => {
  subscription.unsubscribe()
}
```

### Custom Queries
Add custom database queries in `supabaseUtils.ts`:

```typescript
async getActiveInvestments(idnum: string): Promise<InvestmentRecord[]> {
  const { data, error } = await db
    .from('investments')
    .select('*')
    .eq('idnum', idnum)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return (data || []).map(mapInvestmentRecord)
}
```

## 🎓 Next Steps

1. **Customize User Profiles**: Add avatar upload using Supabase Storage
2. **Email Verification**: Implement email verification flow
3. **Password Reset**: Add password recovery functionality
4. **Admin Dashboard**: Build admin interfaces for managing users
5. **Analytics**: Track user behavior and investment patterns
6. **Notifications**: Send email/SMS notifications via Supabase Edge Functions

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 💡 Tips

- **Free Tier Limits**: Supabase free tier includes 500MB database, 2GB bandwidth, 50K monthly active users
- **Database Backups**: Enable automatic backups in Supabase dashboard (Settings > Database)
- **Monitor Usage**: Check usage stats in Supabase dashboard (Settings > Usage)
- **Development vs Production**: Create separate Supabase projects for dev and prod environments

---

**Need help?** Check the console logs in your browser's Developer Tools (F12) for detailed error messages.
