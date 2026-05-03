# Backfill Missed ROI Guide

## Overview

The **backfill script** credits all missed ROI from the day each investment was created/approved until today. This is essential for:
- Catching up on ROI that wasn't credited due to scheduler downtime
- Ensuring fair compensation for all users
- Completing investments that reached their duration while scheduler was inactive

---

## How It Works

### Calculation Logic

For each active investment, the script:

1. **Calculates total days elapsed** since investment start date
2. **Determines expected ROI** based on:
   - Capital amount
   - Daily rate percentage
   - Number of days (capped at investment duration)
3. **Compares with already-credited ROI**
4. **Credits the difference** to user balance
5. **Completes investment** if duration has passed (adds bonus)

### Example Calculation

```
Investment: 15-Day Plan
Capital: $1,000
Daily Rate: 3.5%
Start Date: Dec 1, 2025
Today: Dec 27, 2025 (26 days elapsed)

Expected ROI = $1,000 × 0.035 × 15 days = $525
Already Credited = $100
Missed ROI = $525 - $100 = $425

Since 26 days > 15 days (duration):
- Investment is COMPLETED
- Add bonus: $1,000 × 0.105 = $105
- Total credit = $425 + $105 = $530
```

---

## Running the Backfill

### Prerequisites

1. **Environment variables configured** (`.env` file):
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

2. **Dependencies installed**:
   ```bash
   npm install
   ```

3. **Database tables exist**:
   - `investments` table with: id, idnum, capital, plan, status, date, startDate, creditedRoi, creditedBonus
   - `users` table with: idnum, balance, bonus, email, name, userName

### Run Backfill

**Option 1: Via npm script (Recommended)**
```bash
npm run backfill-roi
```

**Option 2: Direct node execution**
```bash
node scripts/backfill-missed-roi.js
```

### Output Example

```
================================================================================
🔄 BACKFILL MISSED ROI - Starting Process
================================================================================
⏰ Started at: 2025-12-27T10:30:45.123Z

📊 Found 47 active investments

💰 Investment inv_001: Credited 5 missed days
   - Amount: $175.00
   - New Balance: $3,500.00

✅ Investment inv_002 COMPLETED:
   - Missed ROI: $525.00
   - Bonus: $105.00
   - Total Credit: $630.00
   - New Balance: $2,800.00

================================================================================
📋 BACKFILL SUMMARY REPORT
================================================================================

📊 Statistics:
   Total Investments Processed: 45
   Investments Completed: 3
   Investments with Missed ROI: 42
   Errors: 2

💰 Financial Summary:
   Total Credit Amount: $18,450.75
   Unique Users Affected: 38
   Total Missed Days Credited: 156

✅ Completed Investments (3):
   - inv_002 (User: 1001) | 15-Day Plan
     ROI: $525.00 | Bonus: $105.00 | Total: $630.00

================================================================================
✨ Backfill process completed at: 2025-12-27T10:35:22.456Z
================================================================================
```

---

## Email Notifications

### Enable Email Notifications

Add to `.env`:
```env
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAILJS_SERVICE_ID=service_id
VITE_EMAILJS_TEMPLATE_ID=template_id
VITE_EMAILJS_PUBLIC_KEY=public_key
EMAILJS_PRIVATE_KEY=private_key
```

### Email Content

Users receive "Backfill ROI Credit" emails with:
- Number of missed days credited
- Total ROI amount
- Investment plan and ID
- New account balance
- Thank you message for patience

---

## Important Notes

### ✅ What Gets Updated

| Field | Updated |
|-------|---------|
| User `balance` | ✅ Increased by missed ROI + bonus |
| User `bonus` | ✅ Increased by completion bonus (if applicable) |
| Investment `creditedRoi` | ✅ Set to total expected ROI |
| Investment `creditedBonus` | ✅ Set if completed |
| Investment `status` | ✅ Changed to "completed" if duration passed |
| Investment `updated_at` | ✅ Set to current timestamp |

### ⚠️ What Happens Per Investment Status

**Active Investments NOT yet complete:**
- Credits missed daily ROI only
- Keeps investment status as "Active"
- Continues until investment duration ends

**Active Investments NOW complete:**
- Credits all remaining ROI
- Adds completion bonus
- Changes status to "completed"
- Marks investment as finished

### 🛡️ Data Safety

The script:
- ✅ Only processes investments with status = "Active"
- ✅ Validates each investment has a known plan
- ✅ Verifies user exists before updating balance
- ✅ Tracks and logs all errors
- ✅ Does NOT double-credit (checks creditedRoi already)

---

## Troubleshooting

### Script Won't Run

**Error: "Missing Supabase configuration"**
```bash
# Check .env file has:
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# If empty, add to .env file
```

**Error: "Cannot find module '@supabase/supabase-js'"**
```bash
# Install dependencies
npm install
```

### No Investments Processed

```bash
# Check database for active investments
# Query: SELECT * FROM investments WHERE status = 'Active'

# If no results, create test investments first
npm run seed
```

### Users Not Receiving Emails

```bash
# Check .env has EmailJS configured
grep EMAIL .env

# If missing:
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAILJS_SERVICE_ID=your_id
VITE_EMAILJS_TEMPLATE_ID=your_template
VITE_EMAILJS_PUBLIC_KEY=your_key
EMAILJS_PRIVATE_KEY=your_private_key
```

### Only Some Investments Processed

Check logs for error details:
```bash
npm run backfill-roi 2>&1 | grep -E "⚠️|❌"
```

Common errors:
- User not found (check users table)
- Unknown plan (plan name doesn't match PLAN_CONFIG)
- Database connection failed (check Supabase credentials)

---

## Safety Checks Before Running

### 1. Backup Database
If possible, export a backup of your data:
```sql
-- Export investments table
SELECT * FROM investments;

-- Export users table (balance column)
SELECT idnum, balance, bonus FROM users;
```

### 2. Review Expected Changes
Run in a test environment first to see the report without committing changes.

### 3. Verify Investment Data
```sql
-- Check for investments with missing creditedRoi
SELECT id, plan, capital, creditedRoi, status FROM investments WHERE status = 'Active';

-- Check for investments with wrong dates
SELECT id, date, startDate, status FROM investments WHERE date IS NULL;
```

---

## After Running Backfill

### Verification Steps

1. **Check user balances increased:**
   ```sql
   SELECT idnum, balance FROM users ORDER BY balance DESC LIMIT 10;
   ```

2. **Verify completed investments:**
   ```sql
   SELECT id, plan, status, creditedRoi, creditedBonus FROM investments 
   WHERE status = 'completed' ORDER BY updated_at DESC;
   ```

3. **Check for any errors:**
   - Review console output for ⚠️ or ❌ symbols
   - Check email logs if notifications enabled

### Next Steps

1. **Monitor daily credits:** ROI will continue crediting daily via scheduler
2. **Send announcement:** Notify users about backfilled credits
3. **Keep scheduler running:** Prevent future missed credits

---

## Script Details

### File Location
```
scripts/backfill-missed-roi.js
```

### Dependencies
- `@supabase/supabase-js` - Database operations
- `dotenv` - Environment variables
- `@emailjs/nodejs` - Email notifications

### Key Functions
- `calculateMissedROI()` - Calculate missed days and amounts
- `backfillMissedROI()` - Main processing loop
- `sendBackfillEmail()` - Send user notifications

### Processing Order
1. Fetch all active investments
2. For each investment:
   - Calculate expected vs. credited ROI
   - Update investment record
   - Update user balance
   - Send email notification
   - Log to report
3. Generate summary report
4. Output final statistics

---

## Command Reference

```bash
# Run backfill with full report
npm run backfill-roi

# Run and save output to file
npm run backfill-roi > backfill-report.txt

# Run and monitor for errors
npm run backfill-roi 2>&1 | grep -E "Error|Warning|❌|⚠️"

# Run in production (careful!)
NODE_ENV=production npm run backfill-roi
```

---

## FAQ

**Q: Can I run this multiple times?**
A: Yes! It's safe to run multiple times. It won't double-credit because it calculates based on actual daily rate, not manual entries.

**Q: What if an investment was already completed before backfill?**
A: The script checks the duration and only credits what's owed, then marks it as "completed" if not already.

**Q: Does this affect pending/rejected investments?**
A: No, only processes investments with status = "Active"

**Q: Can I undo a backfill?**
A: You would need to restore from a database backup. Always backup before running.

**Q: How long does it take?**
A: Depends on investment count. ~50 investments usually takes 5-10 seconds.

---

## Support

If you encounter issues:

1. Check the console output for detailed error messages
2. Verify `.env` configuration
3. Confirm database tables exist
4. Check Supabase credentials
5. Review error logs in the report

For questions, see [COMPLETE_ROI_SETUP.md](COMPLETE_ROI_SETUP.md)
