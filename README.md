# Cypher Vault Investments — Modern Investment Dashboard

Cypher Vault is a comprehensive investment platform built with React, TypeScript, Vite, and Supabase. It features a modern dark-themed UI with complete database integration for user authentication, investment management, KYC verification, and portfolio tracking.

## 🌟 Key Features

### 💼 Dashboard & Analytics
- **Real-time Statistics** - Total balance, investments, earnings, and active positions
- **Investment Overview** - Detailed investment statistics with ROI tracking
- **Quick Actions** - Fast access to create investments and view history
- **Notifications** - Real-time alerts for transactions, system updates, and investment tips

### 💰 Investment Management
- **6 Investment Plans** - From 3-day to 6-month plans with 3-5% daily ROI
- **3-Step Investment Flow**:
  1. Select amount and payment method
  2. Confirm investment details
  3. Complete payment with crypto or bank transfer
- **Payment Options** - Bitcoin, Ethereum, USDT, and Bank Transfer
- **Investment History** - Track all investments with status and returns

### 👤 Profile & KYC
- **Personal Information** - Complete profile management with avatar upload
- **Edit Mode** - Toggle to edit email, phone, and address
- **KYC Verification** - 5-step document upload system:
  1. Introduction & requirements
  2. Personal information entry
  3. Document upload (ID, address proof, selfie)
  4. Review & submit
  5. Success confirmation
- **Verification Status** - Visual progress tracking
- **Security** - Password change and account deletion

### 💳 Wallet & Withdrawals
- **Fiat Balance** - USD balance tracking
- **Crypto Balance** - BTC holdings display
- **5-Step Withdrawal Flow**:
  1. Enter amount to withdraw
  2. Select payment method (Crypto/Bank)
  3. Enter payment details
  4. Review & confirm
  5. Success confirmation
- **Transaction History** - Complete activity log with professional tables
- **Payment Methods** - Bitcoin, Ethereum, USDT, Bank Transfer

### 💵 Loan System
- **4-Step Loan Application**:
  1. Enter loan amount
  2. Select duration & view terms
  3. Review loan details
  4. Success confirmation
- **Flexible Terms** - 30, 60, or 90-day durations
- **Interest Rates** - 5%, 8%, or 10% based on duration
- **Loan History** - Track all loan applications

### 🤝 Referral Program
- **Unique Referral Links** - Share and earn bonuses
- **Downline Tracking** - Monitor referral network
- **Referral Earnings** - Track bonus from referrals

### 💬 Support Center
- **Live Chat** - Real-time support (coming soon)
- **Email Support** - 24-hour response time
- **Ticket System** - Issue tracking (coming soon)
- **FAQ Section** - 6+ common questions answered

### 👨‍💼 Admin Dashboard (NEW!)
- **Modern Sidebar Navigation** - Clean, organized admin interface
- **Overview Tab**:
  - 4 gradient stat cards (Users, Investments, Pending Investments, Pending Withdrawals)
  - Quick Actions grid with pending counts
  - Recent Activity feed
- **User Management**:
  - View all registered users
  - Edit user details & balances
  - User status management
- **Investment Management**:
  - Approve/reject pending investments
  - Track total investment volume
  - Monitor investment status
- **Withdrawal Management**:
  - Process pending withdrawal requests
  - Approve/reject withdrawals
  - Track total withdrawal volume
- **KYC Management**:
  - Review verification requests
  - Approve/reject documents
  - Track verification status
- **Access Control**: Only users with `admin: true` can access admin panel
- **Admin Menu**: Special "Admin Panel" link appears in user dashboard for admin users

### 🔐 Security & Authentication
- **Bcrypt Password Hashing** - Industry-standard security
- **Email/Username Login** - Flexible login options
- **Secure Sessions** - Protected user data
- **Admin Authentication** - Separate admin access control
- **Input Validation** - Form validation and sanitization

## 🎨 Design Highlights

- **Modern Dark Theme** - Elegant gradients with golden accents (#f0b90b)
- **Responsive Design** - Mobile-first, fully responsive
- **Smooth Animations** - Transitions and hover effects
- **Professional UI** - Clean cards, tables, and modals
- **Icon Integration** - Icofont library for consistent icons

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Set Up Supabase Database

**📘 For detailed database setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)**

Quick steps:
1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor
3. Get your project URL and anon key from Settings > API
4. Update `.env` file with your credentials (see below)

### 3. Configure Environment Variables

The `.env` file is already configured with a Supabase project. To use your own:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT**: Never commit real credentials to version control!

### 4. Run Development Server

```powershell
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal)

### 5. Create Your First Account

1. Navigate to `/signup`
2. Fill in the registration form
3. Your account will be created in Supabase!
4. Login at `/login` with your credentials

### 6. Access Admin Dashboard (Optional)

To enable admin features for your account:

**Option 1 - Quick Testing (Browser Console):**
```javascript
// After logging in as a regular user:
// 1. Open DevTools (F12)
// 2. Go to Console tab
// 3. Run these commands:
const user = JSON.parse(localStorage.getItem('activeUser'));
user.admin = true;
localStorage.setItem('activeUser', JSON.stringify(user));
location.reload();
```

**Option 2 - Database Level (Recommended for Production):**
1. Open your Supabase dashboard
2. Navigate to Table Editor → `users` table
3. Add a column named `admin` with type `boolean` (if not exists)
4. Find your user record
5. Set `admin = true` for that user
6. User will see "Admin Panel" link after next login

**Option 3 - During Development:**
- In the signup flow, you can manually add `admin: true` to the user object before saving

Once admin access is enabled:
- An "Admin Panel" button appears in the user dashboard sidebar
- Navigate to `/dashboard/admin` to access the admin dashboard
- Manage users, approve investments/withdrawals, and review KYC requests

## 🚀 Deployment Guide

This is a Single Page Application (SPA) with client-side routing. The 404 error occurs because deployment servers don't know how to handle routes like `/dashboard` or `/admin` that don't correspond to actual files.

### ✅ Automatic Configuration Added

The following deployment configuration has been added to fix 404 errors:

- **`vercel.json`** - For Vercel deployments (automatically handles SPA routing)

### 🚀 Deploy to Vercel

#### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub repo
```

#### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Vercel will automatically detect `vercel.json` and configure routing
5. Deploy - all routes will work correctly!

#### Option 3: GitHub Integration
1. Push your code to GitHub (already done!)
2. Connect Vercel to your GitHub account
3. Import the `ciphervault` repository
4. Deploy automatically

### 🔧 Build Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### ⚠️ Common Issues & Solutions

**404 on Direct Links:**
- ✅ **FIXED** - `vercel.json` handles all SPA routes
- Routes like `/dashboard`, `/admin`, `/login` now work

**Environment Variables:**
- Set these in Vercel dashboard under Project Settings > Environment Variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

**Build Errors:**
- Run `npm run build` locally first to catch issues
- Check TypeScript errors with `npx tsc --noEmit`

**Database Connection:**
- Supabase works in production with the provided `.env` config
- No additional setup needed for the database

### 🎯 Vercel Deployment Checklist

- ✅ Build passes locally (`npm run build`)
- ✅ `vercel.json` present in root directory
- ✅ Environment variables configured in Vercel dashboard
- ✅ Database schema applied in Supabase
- ✅ GitHub repository connected to Vercel
- ✅ Test all routes after deployment

### 🔧 Build Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### ⚠️ Common Issues & Solutions

**404 on Direct Links:**
- ✅ Fixed with deployment configurations above
- Routes like `/dashboard`, `/admin`, `/login` now work

**Environment Variables:**
- Ensure `.env` variables are set in your deployment platform
- Never commit real credentials to version control

**Build Errors:**
- Run `npm run build` locally first to catch issues
- Check TypeScript errors with `npx tsc --noEmit`

**Database Connection:**
- Supabase works in production with the provided `.env` config
- No additional setup needed for the database

### 🎯 Deployment Checklist

- ✅ Build passes locally (`npm run build`)
- ✅ Environment variables configured
- ✅ Database schema applied in Supabase
- ✅ Deployment platform configured (Vercel/Netlify auto-detect configs)
- ✅ Test all routes after deployment

## ⏰ Daily ROI Crediting System

The application includes an automated system to credit daily ROI (Return on Investment) to active investments. This ensures users receive their earnings automatically.

### How It Works

1. **Investment Activation**: When investments are approved by admins, they become "active"
2. **Daily Crediting**: A scheduled process runs daily to credit ROI based on the investment plan
3. **Balance Updates**: ROI amounts are added to user's account balance
4. **Completion**: When investment duration ends, final bonus is credited and investment is marked "completed"

### Investment Plans & Rates

| Plan | Duration | Daily ROI | Final Bonus |
|------|----------|-----------|-------------|
| 3-Day Plan | 3 days | 2.0% | 5.0% |
| 7-Day Plan | 7 days | 2.5% | 7.5% |
| 12-Day Plan | 12 days | 3.0% | 9.0% |
| 15-Day Plan | 15 days | 3.5% | 10.5% |
| 3-Month Plan | 90 days | 4.0% | 12.0% |
| 6-Month Plan | 180 days | 4.5% | 13.5% |

### Setting Up Daily ROI Crediting

#### Option 1: Cron Job (Recommended for Production)

**On Linux/Mac:**
```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * cd /path/to/your/app && npm run credit-daily-roi
```

**On Windows (Task Scheduler):**
1. Open Task Scheduler
2. Create new task
3. Set trigger to "Daily" at your preferred time
4. Set action to "Start a program"
5. Program: `cmd.exe`
6. Arguments: `/c cd /path/to/your/app && npm run credit-daily-roi`

#### Option 2: Server Endpoint (For Cloud Hosting)

The server includes a `/api/credit-daily-roi` endpoint that can be called by external cron services:

```bash
# Manual execution
curl -X POST http://your-server-url/api/credit-daily-roi

# Or use services like:
# - GitHub Actions scheduled workflows
# - AWS Lambda scheduled functions
# - Google Cloud Scheduler
# - Cron-job.org
```

#### Option 3: Manual Execution

For testing or one-time execution:
```bash
npm run credit-daily-roi
```

### Monitoring ROI Crediting

- Check server logs for crediting activity
- Monitor user balances in the dashboard
- Verify investment `creditedRoi` and `creditedBonus` fields in database
- The system prevents double-crediting on the same day

### Important Notes

- ✅ ROI is only credited once per day per investment
- ✅ Completed investments receive final bonus automatically
- ✅ System handles multiple active investments per user
- ✅ All calculations use the original investment capital amount
- ✅ Failed crediting attempts are logged but don't stop the process

## 🗄️ Database Schema

The application uses the following Supabase tables:

- **users** - User accounts with authentication and profile data
- **investments** - Investment plans and tracking
- **withdrawals** - Withdrawal requests and history
- **loans** - Loan applications and management
- **transactions** - Complete transaction audit trail
- **notifications** - User notifications system
- **kyc_verifications** - KYC/identity verification
- **referrals** - Referral tracking and rewards

All tables include:
- ✅ Row Level Security (RLS) policies
- ✅ Automated timestamps
- ✅ Foreign key constraints
- ✅ Proper indexes for performance

## 🔐 Authentication Flow

### Signup
1. User fills registration form (email, password, name, username)
2. Password is hashed with bcrypt (10 rounds)
3. User record created in Supabase `users` table
4. Unique user ID generated automatically
5. User session stored in localStorage
6. Redirect to dashboard

### Login
1. User enters email and password
2. Email lookup in Supabase database
3. Password verification using bcrypt
4. User data fetched and stored in session
5. Redirect to appropriate dashboard (user/admin)

### Session Management
- Sessions persist in localStorage
- Automatic session refresh on page load
- Secure logout clears all session data
- Protected routes require authentication

## 💻 Available Scripts

```powershell
## 💻 Available Scripts

```powershell
npm install         # Install all dependencies
npm run dev         # Start development server (usually http://localhost:5176)
npm run build       # Build for production
npm run preview     # Preview production build locally
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5.4.21
- **Routing**: React Router DOM v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom bcrypt (not Supabase Auth)
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Icofont library
- **Password Hashing**: bcryptjs (10 rounds)

## 📊 Dashboard Navigation

The user dashboard includes 8 main sections:

1. **📊 Dashboard** - Overview with statistics and quick actions
2. **💳 Wallet** - Fiat/crypto balances and transaction history
3. **👤 Profile & KYC** - Personal info, KYC verification, settings
4. **📈 Investments** - Investment packages, history, and creation
5. **💰 Withdrawals** - Withdrawal requests and history
6. **🏦 Loans** - Loan applications (placeholder)
7. **👥 Downline** - Referral network tracking
8. **💬 Support** - Help center with FAQs

## 📦 Investment Plans

| Plan | Daily ROI | Duration | Capital Range | Featured |
|------|-----------|----------|---------------|----------|
| 3-Day Plan | 3% | 3 days | $100 - $999 | |
| 7-Day Plan | 4% | 7 days | $1,000 - $5,000 | |
| 15-Day Plan | 4% | 15 days | $3,000 - $9,000 | ⭐ |
| 3-Month Plan | 4% | 90 days | $5,000 - $15,000 | |
| 6-Month Plan | 5% | 180 days | $15,999+ | |

## 💳 Payment Methods

- **Bitcoin (BTC)** - Bitcoin Network
- **Ethereum (ETH)** - Ethereum Network (ERC-20)
- **USDT** - Ethereum Network (ERC-20)
- **Bank Transfer** - Traditional banking

Each payment method includes:
- Copy-to-clipboard functionality
- Network information (for crypto)
- QR code placeholder
- Detailed payment instructions

## 🔒 Security Features

- ✅ bcrypt password hashing (10 rounds)
- ✅ Row Level Security (RLS) in Supabase
- ✅ Secure session management with localStorage
- ✅ Input validation on all forms
- ✅ SQL injection prevention via Supabase
- ✅ Email OR username login support
- ✅ Protected routes requiring authentication

## 📁 Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Login.tsx             # Login (email/username)
│   │   ├── Signup.tsx            # Registration
│   │   └── dashboard/
│   │       └── UserDashboard.tsx # Main dashboard (1800+ lines)
│   ├── lib/
│   │   ├── supabaseClient.ts     # Supabase client
│   │   └── supabaseUtils.ts      # Database functions
│   ├── utils/
│   │   └── planConfig.ts         # Investment plan configs
│   ├── styles/
│   │   ├── modern-dashboard.css  # Dashboard styles (1600+ lines)
│   │   └── global.css            # Global styles
│   └── App.tsx                   # Main app with routing
├── supabase-schema.sql           # Complete database schema
├── DATABASE_SETUP.md             # Database setup guide
├── IMPLEMENTATION_SUMMARY.md     # Detailed feature docs
└── .env                          # Environment variables
```

## 🗄️ Database Schema

8 Supabase tables with full RLS policies:

- **users** - User accounts with bcrypt authentication
- **investments** - Investment records and tracking
- **withdrawals** - Withdrawal requests
- **loans** - Loan applications
- **transactions** - Transaction history
- **notifications** - User notifications
- **kyc_verifications** - KYC documents
- **referrals** - Referral network

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for SQL schema.

## 🔐 Authentication Flow

### Signup
1. User fills registration form
2. Password hashed with bcrypt (10 rounds)
3. User created in Supabase `users` table
4. Unique IDs generated (id, idnum, referralCode)
5. Session stored in localStorage
6. Redirect to dashboard

### Login
1. User enters email OR username + password
2. Database lookup (tries email first, then username)
3. bcrypt password verification
4. User data fetched
5. Session created
6. Redirect to dashboard

## 📸 Screenshots

### Dashboard Overview
- Real-time balance and investment statistics
- Quick action buttons
- Notification bell with unread count

### Investment Creation
- 3-step modal flow
- Payment method selection
- Crypto/bank payment details with copy buttons

### Profile & KYC
- Complete personal information
- KYC verification progress
- Document upload areas

### Support Center
- Live chat (coming soon)
- Email support
- FAQ section

## 🚧 Coming Soon

- ⏰ Live chat functionality
- ⏰ Ticket system
- ⏰ Real QR code generation
- ⏰ Document upload to Supabase Storage
- ⏰ Email verification
- ⏰ Two-factor authentication
- ⏰ Real-time price charts

## ✅ Recently Added

- ✅ **Complete Admin Dashboard** - Modern UI with full management capabilities
- ✅ **Investment Modal Flow** - 3-step process (select → confirm → payment)
- ✅ **Withdrawal System** - 5-step flow with crypto/bank support
- ✅ **Loan Application** - 4-step process with flexible terms
- ✅ **KYC Verification** - 5-step document upload system
- ✅ **Transaction Tables** - Professional tables for all history views
- ✅ **Admin Access Control** - Role-based dashboard access
- ✅ **Profile Edit Mode** - Toggle edit mode for user details

## 📝 Notes

- **Default Port**: http://localhost:5176 (may vary)
- **Admin Access**: See "Access Admin Dashboard" section above
- **Test Accounts**: Create via signup form
- **Payment Addresses**: Sample addresses (replace in production)
- **Documentation**: See IMPLEMENTATION_SUMMARY.md for details

## 🤝 Contributing

This is a demonstration project. For production use:
1. Replace sample payment addresses with real wallets
2. Implement proper document upload to storage
3. Add email verification system
4. Set up proper environment variables
5. Configure production Supabase instance
6. Review and enhance security measures

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Email**: Cyphervault6@gmail.com
- **Response Time**: Within 24 hours
- **Availability**: 24/7

---

**Built with ❤️ using React, TypeScript, Vite, and Supabase**

For detailed implementation notes, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
```
├── public/               # Static assets (favicons, illustrations)
├── src/
│   ├── components/       # Navbar, Footer, ThemeToggle, AuthCard, etc.
│   ├── lib/              # Supabase client factory
│   ├── pages/            # Home, Login, Signup
│   ├── styles/           # Global CSS tokens + section styles
│   ├── theme/            # Theme context + provider
│   └── main.tsx          # React entry point
├── server/               # Optional Express API for service-role tasks
├── scripts/              # Supabase seeding helpers
├── sql/                  # Database helpers / schema files
└── legacy *.html files   # Original static pages kept for reference
```

## Optional Express + Supabase Backend

The Express app under `server/` handles contact submissions and other secure workflows using the Supabase service-role key.

```powershell
cd server
copy .env.example .env
# populate SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

- Endpoints: `/api/health`, `/api/contact`, `/api/signup`, `/api/login`.
- Run the SQL in `sql/schema.sql` to create the required tables (for example `public.contacts`).
- Rotate the service-role key immediately if it leaks.

## Theme & Routing Notes

- Navbar links cover both SPA sections (`/#packages`, `/#faq`, `/#contact`) and legacy detail pages when needed.
- `ThemeProvider` stores the palette under `ciphervault-theme` in `localStorage`; delete that key to reset to system defaults.
- Legacy HTML pages still reference `supabase-config.js`; update those placeholders if you plan to serve them.

## Troubleshooting

- **Missing env vars** – the app logs warnings if Supabase values are absent, but API calls will fail. Double-check `.env` before running `npm run dev`.
- **Type errors** – run `npm run typecheck` (or `tsc --noEmit`) for detailed diagnostics when builds break.
- **Server issues** – install dependencies inside `/server` separately and ensure Node 18+.

## Legacy HTML Pages

Files such as `about.html`, `packages.html`, and `values.html` remain in the repo for historical reference. They are no longer bundled by Vite but can guide future React ports.

Happy shipping! :rocket:
- Endpoints: `/api/health`, `/api/contact`, `/api/signup`, `/api/login`.
- Run the SQL in `sql/schema.sql` to provision the required tables (`public.contacts`, etc.).
- Keep the service role key secret and rotate if compromised.

## Theme & Routing Notes

- Navbar covers both SPA sections (`/#packages`, `/#faq`, `/#contact`) and legacy detail pages where still needed.
- `ThemeProvider` stores preference under `ciphervault-theme`. Remove that key to reset to system defaults.
- Legacy static pages still reference `supabase-config.js`; update those placeholders if you plan to deploy them.

## Troubleshooting

- Missing Vite env vars trigger console warnings but Supabase calls will fail. Double-check `.env` before running `npm run dev`.
- If TypeScript errors stop the build, run `npm run typecheck` (or `tsc --noEmit`) for detailed diagnostics.
- When using the optional server, ensure Node.js ≥ 18 and install dependencies inside `/server` separately from the frontend.

Happy shipping! :rocket:

## Optional: Run a small Node backend that uses Supabase (server-side)

This project includes a simple Express server in `server/` that uses your Supabase service_role key for safe server-only operations (create users, insert contact messages, etc.). Use this when you want server-side validation, webhooks, or to avoid placing secret keys in the browser.

Quick steps (PowerShell):

```powershell
cd server
copy .env.example .env
# Edit .env and paste your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev

# In a separate terminal (project root) start a dev static server for the frontend:
cd ..
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Notes:
- The server exposes these endpoints: `/api/health`, `/api/contact`, `/api/signup` and `/api/login`.
- Make sure you run the SQL in `sql/schema.sql` to create all necessary tables (including the new `public.contacts` table).
- Never commit your Supabase service_role key — keep it in environment variables and rotate it if it leaks.
#   c i p h e r v a u l t 
 
 #   c i p h e r v a u l t 
 
 