# Daily ROI Crediting - Implementation Guide

## Overview
The daily ROI (Return on Investment) crediting system has been fixed to automatically credit earnings to active investments every day at **12:00 AM (midnight) UTC**.

## What Was Fixed

### 1. **Syntax Errors in Script**
   - Fixed malformed `.eq()` call on line 217 of `scripts/credit-daily-roi.js`
   - Fixed incomplete email sending logic for daily ROI notifications
   - Added proper user data retrieval before balance updates

### 2. **Missing Scheduler**
   - Added `node-schedule` package to automatically run ROI crediting at 12am daily
   - Created new scheduler module: `server/scheduler.js`
   - Integrated scheduler with Express server startup

### 3. **Server Integration**
   - Updated `server/index.js` to initialize the scheduler when server starts
   - Added `/api/scheduler/status` endpoint to check scheduler status
   - Added necessary dependencies to `server/package.json`

## How It Works

### Daily Automatic Crediting
The scheduler runs every day at **12:00 AM UTC** and:
1. Fetches all active investments from the database
2. Calculates daily ROI for each investment based on plan configuration
3. Checks if ROI was already credited today (prevents duplicate crediting)
4. Credits ROI to user balances
5. Completes investments when duration expires and credits final bonus
6. Sends email notifications (if configured)

### Plan Configuration
Each plan has specific daily rates:
```javascript
{
  '3-Day Plan': { durationDays: 3, dailyRate: 0.10, bonus: 0.05 },
  '7-Day Plan': { durationDays: 7, dailyRate: 0.10, bonus: 0.075 },
  '12-Day Plan': { durationDays: 12, dailyRate: 0.03, bonus: 0.09 },
  '15-Day Plan': { durationDays: 15, dailyRate: 0.035, bonus: 0.105 },
  '3-Month Plan': { durationDays: 90, dailyRate: 0.04, bonus: 0.12 },
  '6-Month Plan': { durationDays: 180, dailyRate: 0.045, bonus: 0.135 }
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
# Install server dependencies (includes node-schedule)
cd server
npm install
cd ..
```

### 2. Verify Environment Variables
Ensure your `.env` file has:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_EMAIL_NOTIFICATIONS_ENABLED=true  # Optional
VITE_EMAILJS_SERVICE_ID=your_service_id  # Optional
VITE_EMAILJS_TEMPLATE_ID=your_template_id  # Optional
EMAILJS_PRIVATE_KEY=your_private_key  # Optional
```

### 3. Start the Server
The scheduler automatically initializes when the server starts:
```bash
npm run server:start
```

You should see scheduler initialization logs:
```
✅ Daily ROI Scheduler initialized
⏰ Scheduled to run every day at 12:00 AM (midnight) UTC
🕐 Next execution: <timestamp>
```

## Testing the Scheduler

### Option 1: Check Scheduler Status
```bash
curl http://localhost:3000/api/scheduler/status
```

Response:
```json
{
  "status": "enabled",
  "message": "Daily ROI scheduler is running",
  "schedule": "Every day at 12:00 AM (midnight) UTC",
  "note": "Server must remain running for scheduler to work"
}
```

### Option 2: Manually Trigger ROI Crediting
```bash
# Via API endpoint
curl -X POST http://localhost:3000/api/credit-daily-roi

# Via npm script (one-time)
npm run credit-daily-roi
```

### Option 3: Check Server Logs
Watch for these messages during scheduled runs:
```
⏰ [timestamp] Starting daily ROI crediting process...
📊 Found N active investments to process
💰 Credited $X.XX ROI for investment ID (plan name)
✅ Completed investment ID: Credited remaining ROI...
```

## Monitoring & Troubleshooting

### Scheduler Not Running?
1. **Check server is running**: The scheduler only works if the server process is active
2. **Verify Supabase credentials**: Check `.env` file has valid `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. **Check logs**: Look for initialization message when server starts
4. **Manual test**: Run `curl -X POST http://localhost:3000/api/credit-daily-roi`

### ROI Not Crediting Today?
1. Check if ROI was already credited today (system prevents duplicate daily credits)
2. Verify investment status is "Active"
3. Verify investment is within its duration period
4. Check server logs for errors

### Email Notifications Not Sending?
1. Ensure `VITE_EMAIL_NOTIFICATIONS_ENABLED=true` in `.env`
2. Provide valid EmailJS credentials:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `EMAILJS_PRIVATE_KEY`
3. Check server logs for EmailJS errors

## Files Modified

1. **scripts/credit-daily-roi.js**
   - Fixed syntax errors
   - Corrected user data retrieval and email sending logic

2. **server/scheduler.js** (NEW)
   - Complete scheduling implementation
   - Daily ROI calculation and crediting logic
   - Email notification handlers

3. **server/index.js**
   - Added scheduler import and initialization
   - Added `/api/scheduler/status` endpoint

4. **server/package.json**
   - Added `node-schedule` and `@emailjs/nodejs` dependencies

5. **package.json**
   - Added `server:dev` script for development

## Important Notes

- ⏰ **Timezone**: Scheduler runs at 12:00 AM UTC. If you need a different timezone, modify the cron expression in `server/scheduler.js` line 141:
  ```javascript
  const job = schedule.scheduleJob('0 0 0 * * *', creditDailyROI);
  // Current: 0 0 0 = 00:00:00 (midnight UTC)
  // Change first number to shift hours, second to shift minutes
  ```

- 🔄 **Server Uptime**: The scheduler requires the server to be continuously running. Consider:
  - Deploying on a service that keeps processes alive (Heroku, Railway, etc.)
  - Setting up PM2 or similar process manager for auto-restart
  - Using a serverless cron service as backup

- 💾 **Database Updates**: All credits are persisted immediately to Supabase database

- 📧 **Email Sending**: Optional but recommended for user engagement and transparency

## Next Steps

1. Install dependencies: `npm install` and `cd server && npm install`
2. Configure `.env` with valid Supabase credentials
3. Start server: `npm run server:start`
4. Monitor logs to confirm scheduler initializes
5. Investments will be automatically credited daily at 12am UTC

---

For questions or issues, check the server logs and ensure:
- ✅ Supabase credentials are valid
- ✅ Database tables exist (investments, users)
- ✅ Server process is running
- ✅ Investments have status "Active"
