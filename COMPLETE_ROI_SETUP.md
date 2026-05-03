# Daily ROI Crediting - Complete Setup Guide

## Overview

The system now has **two complementary approaches** for daily ROI crediting:

1. **Application-Based Scheduler** (Built-in with Node.js server)
   - Runs inside the Express server using `node-schedule`
   - Requires server to be continuously running
   - Works on any platform (Windows, Mac, Linux)

2. **System-Level Cron Jobs** (Optional but recommended for production)
   - Independent task scheduler
   - Runs even if application server restarts
   - Platform-specific setup (Linux/Mac: crontab, Windows: Task Scheduler)

---

## Quick Start

### Minimum Setup (Application-Based Only)

```bash
# 1. Install dependencies
cd server && npm install && cd ..

# 2. Start server (scheduler runs automatically)
npm run server:start

# Server will show:
# ✅ Daily ROI Scheduler initialized
# ⏰ Scheduled to run every day at 12:00 AM (midnight) UTC
```

### Recommended Setup (With System Cron Backup)

#### For Linux/Mac:
```bash
# Make script executable
chmod +x scripts/setup-cron.sh

# Run setup (adds to crontab)
bash scripts/setup-cron.sh

# Verify installation
crontab -l | grep credit-daily-roi

# Monitor logs
tail -f logs/roi-cron.log
```

#### For Windows:
```powershell
# Open PowerShell as Administrator

# Run setup
powershell -ExecutionPolicy Bypass -File scripts/setup-cron.ps1 -Action install

# Check status
powershell -File scripts/setup-cron.ps1 -Action status

# Monitor logs
Get-Content logs/roi-cron.log -Wait
```

---

## How It Works

### Daily Execution Flow

**Time: 12:00 AM UTC every day**

```
┌─────────────────────────────────────────┐
│  1. Scheduler Triggers (12:00 AM UTC)   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  2. Fetch All Active Investments        │
│     - Query: status = "Active"           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  3. For Each Investment:                │
│     ├─ Check if already credited today  │
│     ├─ Calculate daily ROI              │
│     ├─ Check if investment completed    │
│     └─ Update database + user balance   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  4. Send Email Notifications (optional) │
│     - Daily ROI earned emails           │
│     - Investment completion emails      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  5. Log Results & Finish                │
│     - Write to console/logs             │
└─────────────────────────────────────────┘
```

### Duplicate Prevention

- System checks if ROI was already credited **today**
- Uses date comparison (resets at midnight)
- Prevents accidental double-crediting if job runs multiple times

---

## Configuration

### Plan Rates (from `scheduler.js`)
```javascript
{
  '3-Day Plan':    { dailyRate: 0.10, bonus: 0.05 },
  '7-Day Plan':    { dailyRate: 0.10, bonus: 0.075 },
  '12-Day Plan':   { dailyRate: 0.03, bonus: 0.09 },
  '15-Day Plan':   { dailyRate: 0.035, bonus: 0.105 },
  '3-Month Plan':  { dailyRate: 0.04, bonus: 0.12 },
  '6-Month Plan':  { dailyRate: 0.045, bonus: 0.135 }
}
```

### Change Execution Time

#### Application-Based (Node.js)
Edit `server/scheduler.js` line 141:
```javascript
// Current: 12:00 AM UTC
const job = schedule.scheduleJob('0 0 0 * * *', creditDailyROI);

// Change to 2:00 AM UTC:
const job = schedule.scheduleJob('0 0 2 * * *', creditDailyROI);

// Change to 6:00 PM UTC:
const job = schedule.scheduleJob('0 0 18 * * *', creditDailyROI);

// Cron format: second minute hour * * *
```

#### System Cron (Linux/Mac)
Edit with `crontab -e`:
```bash
# Current: 12:00 AM (midnight)
0 0 * * * /usr/bin/node /path/to/credit-daily-roi.js

# Change to 2:00 AM:
0 2 * * * /usr/bin/node /path/to/credit-daily-roi.js

# Change to 6:00 PM:
0 18 * * * /usr/bin/node /path/to/credit-daily-roi.js

# Cron format: minute hour * * *
```

#### Windows Task Scheduler
1. Open Task Scheduler
2. Find "eToro Trust Capital - Daily ROI Crediting"
3. Right-click → Properties → Triggers
4. Edit trigger and change "Start time"

---

## Testing & Monitoring

### Test Manual Execution
```bash
# Option 1: Via API endpoint
curl -X POST http://localhost:3000/api/credit-daily-roi

# Option 2: Run script directly
npm run credit-daily-roi

# Option 3: Windows only (if using Task Scheduler)
powershell -File scripts/setup-cron.ps1 -Action test
```

### Check Scheduler Status
```bash
curl http://localhost:3000/api/scheduler/status

# Response:
# {
#   "status": "enabled",
#   "message": "Daily ROI scheduler is running",
#   "schedule": "Every day at 12:00 AM (midnight) UTC",
#   "note": "Server must remain running for scheduler to work"
# }
```

### Monitor Logs

**Application logs (Node.js):**
```bash
# When server is running, watch console output
npm run server:start

# Look for messages like:
# ⏰ [2025-12-27T00:00:00Z] Starting daily ROI crediting process...
# 💰 Credited $50.00 ROI for investment ID-123 (15-Day Plan)
# 📈 ROI Crediting Summary: Processed: 45, Completed: 2, Errors: 0
```

**Cron logs (Linux/Mac):**
```bash
# Watch log file
tail -f logs/roi-cron.log

# Or check system logs
grep CRON /var/log/syslog | tail -20  # Linux
log stream --predicate 'eventMessage contains[cd] "cron"' --level debug  # Mac
```

**Cron logs (Windows):**
```powershell
# Watch log file
Get-Content logs/roi-cron.log -Wait

# Or check Task Scheduler history
Get-ScheduledTask -TaskName "eToro Trust Capital - Daily ROI Crediting" | Get-ScheduledTaskInfo
```

---

## Troubleshooting

### ROI Not Crediting?

**Check 1: Is server running?**
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok",...}
```

**Check 2: Scheduler initialized?**
```bash
# When starting server, should show:
# ✅ Daily ROI Scheduler initialized
# ⏰ Scheduled to run every day at 12:00 AM (midnight) UTC
```

**Check 3: Are there active investments?**
```bash
# Query database directly to check:
# SELECT * FROM investments WHERE status = 'Active'
```

**Check 4: Already credited today?**
- System prevents duplicate crediting per day
- Check `updated_at` timestamp on investment record

**Check 5: Investment within duration?**
- System only credits if investment hasn't completed
- Calculate: `now - startDate < durationDays`

### Cron Job Not Running?

**Linux/Mac:**
```bash
# Verify cron is installed
which crontab

# Check if job is in crontab
crontab -l | grep credit-daily-roi

# Check system cron logs
sudo tail -f /var/log/syslog | grep CRON  # Linux
log stream --predicate 'process == "cron"'  # Mac

# Ensure script has execute permissions
chmod +x scripts/credit-daily-roi.js
chmod +x scripts/setup-cron.sh
```

**Windows:**
```powershell
# Check if Task Scheduler service is running
Get-Service Schedule | Select Status

# View scheduled tasks
Get-ScheduledTask -TaskName "*ROI*"

# Check Event Viewer for errors
Get-WinEvent -LogName "Microsoft-Windows-TaskScheduler/Operational" -MaxEvents 10
```

### Email Notifications Not Sending?

```bash
# Check .env file has EmailJS configured:
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAILJS_SERVICE_ID=your_id
VITE_EMAILJS_TEMPLATE_ID=your_template
VITE_EMAILJS_PUBLIC_KEY=your_key
EMAILJS_PRIVATE_KEY=your_private_key

# Check server logs for EmailJS errors
# Look for: "Failed to send ROI notification email"
```

---

## Deployment Scenarios

### Option 1: Heroku (Free/Paid)
```bash
# Add Procfile:
echo "roi-scheduler: node scripts/credit-daily-roi.js" >> Procfile
echo "web: npm --prefix server run start" >> Procfile

git add Procfile
git commit -m "Add ROI scheduler dyno"
git push heroku main

# Start the dyno
heroku ps:scale roi-scheduler=1
```

### Option 2: Docker
```dockerfile
# Add to Dockerfile:
RUN npm install --save node-schedule @emailjs/nodejs

# Add service to docker-compose.yml:
roi-scheduler:
  image: node:18
  working_dir: /app
  command: node scripts/credit-daily-roi.js
  volumes:
    - .:/app
  environment:
    - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
    - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

### Option 3: Traditional VPS
```bash
# SSH into server
ssh user@your-vps.com

# Clone repo and setup
git clone <repo> /var/www/ciphervault
cd /var/www/ciphervault
npm install
cd server && npm install && cd ..

# Setup cron job
bash scripts/setup-cron.sh

# Start Node server with PM2
npm install -g pm2
pm2 start "npm --prefix server run start" --name ciphervault
pm2 save
pm2 startup
```

---

## Files Changed/Created

| File | Change | Purpose |
|------|--------|---------|
| `server/scheduler.js` | ✨ NEW | Application-based daily scheduler |
| `server/index.js` | 📝 MODIFIED | Initialize scheduler on startup |
| `server/package.json` | 📝 MODIFIED | Add `node-schedule` + `@emailjs/nodejs` |
| `scripts/credit-daily-roi.js` | 🐛 FIXED | Fixed syntax errors |
| `scripts/setup-cron.sh` | ✨ NEW | Linux/Mac cron setup script |
| `scripts/setup-cron.ps1` | ✨ NEW | Windows Task Scheduler setup |
| `DAILY_ROI_FIX.md` | ✨ NEW | Implementation details |
| `CRON_JOB_SETUP.md` | ✨ NEW | Cron job setup guide |

---

## Support & Monitoring

### Health Check Endpoint
```bash
GET /api/scheduler/status

Response:
{
  "status": "enabled",
  "message": "Daily ROI scheduler is running",
  "schedule": "Every day at 12:00 AM (midnight) UTC"
}
```

### Manual Trigger Endpoint
```bash
POST /api/credit-daily-roi

Response:
{
  "message": "Daily ROI crediting completed",
  "processed": 45,
  "completed": 2,
  "totalInvestments": 47
}
```

### Next Steps
1. ✅ Fix syntax errors in script
2. ✅ Install Node.js dependencies
3. ✅ Start server: `npm run server:start`
4. ✅ (Optional) Setup system cron job:
   - Linux/Mac: `bash scripts/setup-cron.sh`
   - Windows: `powershell -File scripts/setup-cron.ps1 -Action install`
5. ✅ Monitor logs daily

---

For questions, check the logs or ensure all prerequisites are met:
- ✅ Supabase credentials configured
- ✅ Database tables exist (investments, users)
- ✅ Server process is running OR cron job is scheduled
- ✅ Investments have status = "Active"
