# Profit Email Notifications Implementation

## Overview

This document describes the automated email notification system for profit/ROI credits to users. When profits are credited to users' accounts through daily ROI processing or backfill operations, they automatically receive email notifications with detailed information about their earnings.

## Features

### Email Notification Contents
Users receive emails containing:
- ✅ **Profit Amount** - Total profit credited (ROI + any bonuses)
- ✅ **Investment Plan/Package** - Name of the investment plan
- ✅ **Current Balance** - Updated account balance after profit credit
- ✅ **Date/Time Credited** - Exact timestamp when profit was credited
- ✅ **Dashboard Link** - Quick access to view investments

### Notification Types
1. **Daily ROI Credits** - Sent during the daily ROI credit job (scheduled at 12:00 AM UTC)
2. **Backfill Credits** - Sent when missed ROI is credited through the backfill script
3. **Investment Completion** - Sent when investment completes with final ROI + bonus

## System Architecture

### 1. Daily ROI Processing (`scripts/credit-daily-roi.js`)

**How it Works:**
```
Every 24 hours (scheduled):
├─ Query active investments
├─ Calculate daily ROI for each investment
├─ Update investment and user balances
├─ Fetch user email and name from database
└─ Send profit notification email via API endpoint
```

**Key Changes:**
- Added `sendProfitNotificationEmail()` function to send notifications via API
- Modified user data fetch to include `email`, `firstName`, `lastName`, `full_name`
- Sends email asynchronously after ROI is credited (non-blocking)

### 2. Backfill Script (`scripts/backfill-missed-roi.js`)

**How it Works:**
```
Manual execution (when needed):
├─ Query active investments
├─ Calculate missed ROI since start date
├─ Credit missed ROI to balances
├─ Fetch user data
└─ Send profit notification email via API endpoint
```

**Key Changes:**
- Replaced emailjs with API endpoint calls for consistency
- Uses same `sendProfitNotificationEmail()` pattern
- Sends notifications for backfilled amounts

### 3. API Endpoint (`api/index.js`)

**Endpoint:** `POST /api/notify/profit`

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "planName": "7-Day Plan",
  "roiAmount": 30.00,
  "bonusAmount": 5.00,
  "newBalance": 1235.50
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "profit-1234567890",
  "details": {
    "userEmail": "user@example.com",
    "planName": "7-Day Plan",
    "totalAmount": 35.00,
    "newBalance": 1235.50
  }
}
```

### 4. Email Template (`api/emailTemplates.js`)

**Template:** `roiCredited()`

**Features:**
- Professional branded header with company logo
- Clear profit summary table with:
  - Profit amount (highlighted in gold)
  - Investment plan name
  - Date/time credited (formatted locale string)
  - Current balance
- Dashboard action button
- Helpful tip about balance usage (withdrawal or reinvestment)
- Google Translate option for multilingual support
- Company footer with legal notice

## Configuration

### Environment Variables Required

```env
# API Configuration
API_URL=http://localhost:3000

# Email Service (TurboSMTP)
EMAIL_FROM=noreply@etorocapital.online
EMAIL_REPLY_TO=support@etorocapital.online
ADMIN_EMAIL=admin@etorocapital.online

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Schema

**Required fields in `users` table:**
```sql
- email (TEXT) - User's email address
- firstName (TEXT) - User's first name (optional)
- lastName (TEXT) - User's last name (optional)
- full_name (TEXT) - User's full name (optional)
- balance (NUMERIC) - Current account balance
- bonus (NUMERIC) - Bonus balance
```

**Required fields in `investments` table:**
```sql
- id (UUID) - Unique investment ID
- idnum (TEXT) - User ID reference
- plan (TEXT) - Investment plan name
- capital (NUMERIC) - Investment amount
- creditedRoi (NUMERIC) - Total ROI already credited
- creditedBonus (NUMERIC) - Total bonus already credited
- startDate (TIMESTAMP) - When investment started earning ROI
- status (TEXT) - Current status (Active/completed)
```

## Implementation Details

### Email Sending Flow

1. **ROI Calculation & Database Update**
   ```javascript
   // Update investment and user balances in database
   ├─ Calculate ROI to credit
   ├─ Update investments table with creditedRoi
   └─ Update users table with new balance
   ```

2. **Fetch User Information**
   ```javascript
   // Get user email and name
   const { data: userData } = await supabase
     .from('users')
     .select('email, firstName, lastName, full_name, balance')
     .eq('idnum', investment.idnum)
   ```

3. **Send Email Notification**
   ```javascript
   // Call API endpoint
   const response = await fetch('http://localhost:3000/api/notify/profit', {
     method: 'POST',
     body: {
       userEmail, userName, planName,
       roiAmount, bonusAmount, newBalance
     }
   })
   ```

4. **Email Service Processing**
   ```javascript
   // In API endpoint
   ├─ Validate request parameters
   ├─ Call emailService.sendRoiCredit()
   └─ Log response for tracking
   ```

### Error Handling

- **Non-blocking:** Email failures don't block ROI crediting
- **Graceful degradation:** System continues if email service is unavailable
- **Logging:** All email attempts are logged for debugging
- **Retries:** Failed emails are logged but not automatically retried
- **Fallback:** If API endpoint unavailable, profit credit still completes

### User Name Fallback Logic

The system tries multiple fields to determine user name (in order):
1. `userData.full_name` - Full name field
2. `userData.firstName + userData.lastName` - Concat first and last
3. `userData.firstName` - First name only
4. `User {idnum}` - Fallback to user ID

## Usage Examples

### Scheduled Daily ROI Credit

**Configuration (node-schedule):**
```javascript
// In api/scheduler.js
const job = schedule.scheduleJob('0 0 0 * * *', creditDailyROI);
// Runs daily at 12:00 AM UTC
```

**Change Schedule:**
```javascript
// 2:00 AM UTC:
const job = schedule.scheduleJob('0 0 2 * * *', creditDailyROI);

// 6:00 PM UTC:
const job = schedule.scheduleJob('0 0 18 * * *', creditDailyROI);
```

### Manual Backfill Execution

```bash
# Backfill missed ROI and send notifications
node scripts/backfill-missed-roi.js
```

### Direct API Endpoint Call

```bash
curl -X POST http://localhost:3000/api/notify/profit \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "planName": "3-Day Plan",
    "roiAmount": 50.00,
    "bonusAmount": 10.00,
    "newBalance": 1260.00
  }'
```

## Email Template Preview

### Subject Line
```
"Daily Profit Credited" or "Daily Investment Return Credited"
```

### Email Structure
```
┌─────────────────────────────────────┐
│  eToro Trust Capital (Logo)         │
│  Daily Profit Credited              │ (Title)
├─────────────────────────────────────┤
│                                     │
│  Hello John,                        │
│  Great news! Your daily investment │
│  returns have been credited...      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Profit Summary              │   │
│  ├─────────────────────────────┤   │
│  │ Profit Amount:  +$50.00    │   │
│  │ Investment Plan: 3-Day Plan│   │
│  │ Credited:      2024-05-16  │   │
│  │ New Balance:    $1,260.00  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [View Dashboard Button]            │
│                                     │
│  💡 Tip: Profits can be withdrawn  │
│  or reinvested...                  │
│                                     │
├─────────────────────────────────────┤
│  © 2024 eToro Trust Capital         │
│  Google Translate Link              │
└─────────────────────────────────────┘
```

## Monitoring & Debugging

### Log Files to Check

**Daily ROI Process:**
```bash
# Check logs for ROI credit process
grep "ProfitEmail\|EmailNotification" your-app.log

# Check for email sending errors
grep "❌.*EmailNotification" your-app.log
```

**API Endpoint:**
```bash
# Check profit notification endpoint
grep "\[ProfitEmail\]" your-api.log
```

### Sample Log Output

```
[2024-05-16T00:00:00Z] Starting daily ROI crediting process...
[EmailNotification] Sending profit notification to user@example.com...
[ProfitEmail] Profit notification request received
[ProfitEmail] Details: {
  userEmail: 'user@example.com',
  userName: 'John Doe',
  planName: '7-Day Plan',
  roiAmount: 30,
  bonusAmount: 0,
  newBalance: 1230
}
[ProfitEmail] ✅ Profit notification sent to user@example.com
Credited investment-123: ROI $30.00.
```

## Testing

### Test Daily ROI Email

1. **Manually run credit-daily-roi:**
   ```bash
   node scripts/credit-daily-roi.js
   ```

2. **Check API logs** for successful email sends
3. **Verify email** received with correct details

### Test Backfill Email

1. **Manually run backfill:**
   ```bash
   node scripts/backfill-missed-roi.js
   ```

2. **Check for backfill notifications** in logs
3. **Verify user receives email** with backfilled amount

### Test API Endpoint Directly

```bash
# Send test request
curl -X POST http://localhost:3000/api/notify/profit \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "planName": "Test Plan",
    "roiAmount": 25.50,
    "bonusAmount": 5.50,
    "newBalance": 1125.50
  }'

# Expected response:
# {"success":true,"messageId":"profit-1234567890",...}
```

## Troubleshooting

### Issue: Emails not being sent

**Check:**
1. API service is running on configured port
2. Email service credentials are valid
3. User email addresses in database are correct
4. Check logs for specific errors

**Solution:**
```bash
# Verify API is running
curl http://localhost:3000/api/health

# Check email service status
npm run test-email

# Check database connectivity
npm run test-db
```

### Issue: Profit calculation is incorrect

**Check:**
1. Plan configuration in PLAN_CONFIG matches database
2. Investment startDate is set correctly
3. creditedRoi value is accurate

### Issue: Email contains formatting issues

**Check:**
1. Amount formatting (should show 2 decimal places)
2. Email template is using correct styles
3. User name extraction is working

## Performance Considerations

- **Async Email Sending:** Emails sent asynchronously (non-blocking)
- **Batch Processing:** Daily job processes all active investments
- **Connection Pooling:** Uses fetch with keep-alive
- **Rate Limiting:** API has rate limiting (default 100 requests/15 min)
- **Database Indexes:** Index on `users(idnum)` and `investments(status, authStatus)`

## Security Notes

- Email addresses are only used for notification
- No sensitive data (passwords, tokens) in emails
- Service role key used only server-side
- API endpoint validates all inputs
- No user data exposed in error messages

## Future Enhancements

1. **Email Templates:** Add more customization options
2. **Unsubscribe:** Allow users to opt-out of notifications
3. **Digest Emails:** Combine multiple profits into one email
4. **Email Scheduling:** Allow users to choose notification frequency
5. **SMS Notifications:** Add SMS alerts for larger profits
6. **Push Notifications:** Browser/mobile push alerts

## Related Documentation

- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database structure
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Feature overview
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Email service configuration
- [CRON_JOB_SETUP.md](CRON_JOB_SETUP.md) - Scheduler configuration
