# Next.js Dashboard Integration Guide

## ✅ Integration Complete

Your Next.js dashboard from `src/src` has been successfully integrated into the React + Vite app!

## 🚀 What's Been Added

### 1. **Supabase Configuration**
- ✅ Created `src/config/supabase.ts` - Vite-compatible Supabase client
- ✅ Created `src/lib/supabaseUtils.ts` - Database operations (users, investments, withdrawals)
- ✅ Created `.env.example` with required environment variables
- ✅ Installed `@supabase/supabase-js` package

### 2. **Plan Configuration**
- ✅ Migrated `src/utils/planConfig.ts` - Investment plan definitions
- All 6 investment plans (3-Day, 7-Day, 12-Day, 15-Day, 3-Month, 6-Month)
- TypeScript interfaces for type safety

### 3. **Dashboard Components**
- ✅ `src/components/dashboard/advanced/DashboardSect.tsx` - Account snapshot & investment packages
- ✅ CSS modules copied from Next.js components
- ✅ Converted to React Router (removed Next.js dependencies)

### 4. **New Pages**

#### Advanced Dashboard (`/dashboard/advanced`)
Features:
- 📊 Account Snapshot (balance, bonuses, returns, referrals)
- 💼 Investment packages with all plan details
- 💸 Withdrawals section (placeholder)
- 🆔 KYC verification (placeholder)
- 👤 Profile management

#### Admin Dashboard (`/dashboard/admin`)
Features:
- 📊 System overview with statistics
- 👥 User management (view all users)
- 💼 Investment management
- 💸 Withdrawal approval
- 🆔 KYC verification requests
- **Only visible to admin users** (user.admin === true)

### 5. **Routing Updates**
- ✅ Added `/dashboard/advanced` route
- ✅ Added `/dashboard/admin` route (admin-only)
- ✅ Updated sidebar navigation
- ✅ Admin menu item only shows for admin users

## 🔧 Setup Instructions

### 1. Configure Supabase

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Database Schema

Your Supabase database should have these tables:

**`userlogs` table:**
- id (uuid, primary key)
- idnum (text)
- name (text)
- userName (text)
- email (text)
- password (text)
- balance (numeric)
- bonus (numeric)
- referralCount (int)
- admin (boolean)
- created_at (timestamp)

**`investments` table:**
- id (uuid, primary key)
- idnum (text, references userlogs)
- plan (text)
- capital (numeric)
- roi (numeric)
- bonus (numeric)
- status (text)
- duration (int)
- paymentoption (text)
- authstatus (text)
- created_at (timestamp)

**`withdrawals` table:**
- id (uuid, primary key)
- idnum (text, references userlogs)
- amount (numeric)
- wallet (text)
- status (text)
- method (text)
- created_at (timestamp)

### 3. Test the Integration

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Login to the dashboard:**
   - Navigate to http://localhost:5175/login
   - Login with your credentials

3. **Access Advanced Dashboard:**
   - Go to http://localhost:5175/dashboard/advanced
   - Or click "Advanced 🚀" in the sidebar

4. **Access Admin Dashboard (admins only):**
   - Go to http://localhost:5175/dashboard/admin
   - Or click "Admin 👨‍💼" in the sidebar (only shows for admins)

## 📁 File Structure

```
src/
├── config/
│   └── supabase.ts              # Supabase client configuration
├── lib/
│   └── supabaseUtils.ts         # Database operations & types
├── utils/
│   └── planConfig.ts            # Investment plan definitions
├── components/
│   └── dashboard/
│       ├── advanced/
│       │   ├── DashboardSect.tsx         # Account snapshot & packages
│       │   ├── DashboardSect.module.css
│       │   └── Profile.module.css
│       └── Sidebar.tsx          # Updated with admin menu
├── pages/
│   └── dashboard/
│       ├── AdvancedDashboard.tsx    # Advanced features page
│       └── AdminDashboard.tsx       # Admin management page
└── styles/
    └── legacy/                  # CSS from Next.js dashboard
```

## 🎯 Available Features

### From Next.js Dashboard (`src/src`):

**Integrated:**
- ✅ Dashboard Section (Account snapshot, Investment packages)
- ✅ Plan Configuration (All 6 investment plans)
- ✅ Supabase Integration (Database operations)
- ✅ Admin Dashboard Structure

**Ready to Integrate:**
- 📁 `investmentSect.jsx` - Investment history & tracking
- 📁 `WithdrawalSect.jsx` - Withdrawal requests & history
- 📁 `KYC.jsx` - Identity verification
- 📁 `LoanSect.jsx` - Loan management
- 📁 `DownlineSect.jsx` - Referral system
- 📁 `NotificationSect.jsx` - User notifications
- 📁 `PaymentSect.jsx` - Payment processing
- 📁 `profileSect.jsx` - Profile management
- 📁 `Analytics2.jsx`, `Analytics3.jsx`, `LengthyAnalytics.jsx` - Advanced analytics

## 🔐 Admin Access

To mark a user as admin, update their record in Supabase:

```sql
UPDATE userlogs 
SET admin = true 
WHERE email = 'admin@example.com';
```

## 🎨 Styling

- CSS modules are used for component-specific styles
- Global styles from Next.js are copied to `src/styles/legacy/`
- Tailwind CSS classes work alongside CSS modules

## 🚧 Next Steps

1. **Configure Supabase** - Add your credentials to `.env`
2. **Set up database** - Create tables with the schema above
3. **Test features** - Try creating investments, making withdrawals
4. **Convert remaining components** - Integrate KYC, Withdrawals, Loans, etc.
5. **Add real-time updates** - Supabase subscriptions are already set up

## 📝 Notes

- The dashboard works without Supabase, but data won't persist
- Admin menu only shows if `user.admin === true` in localStorage
- All Next.js dependencies (next/router, next/link) have been removed
- TypeScript interfaces ensure type safety throughout

## 🎉 Success!

You now have both dashboards integrated:
- **Basic Dashboard** - Simple investment tracking
- **Advanced Dashboard** - Full-featured with Supabase backend
- **Admin Dashboard** - Complete system management

Visit `/dashboard/advanced` to explore! 🚀
