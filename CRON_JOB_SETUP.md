#!/bin/bash
# Cron Job Setup for Daily ROI Crediting
# This script ensures ROI crediting runs even if the Node server restarts

# =============================================================================
# LINUX/MAC SETUP (crontab)
# =============================================================================

# 1. Open your crontab editor:
#    crontab -e

# 2. Add this line to run at 12:00 AM UTC daily:
#    0 0 * * * /usr/bin/node /path/to/scripts/credit-daily-roi.js >> /path/to/logs/roi-cron.log 2>&1

# 3. Replace /path/to with your actual project path
#    Example:
#    0 0 * * * /usr/bin/node /home/user/ciphervault/scripts/credit-daily-roi.js >> /home/user/ciphervault/logs/roi-cron.log 2>&1

# 4. Save and exit (Ctrl+X then Y for nano, :wq for vim)

# 5. Verify it was added:
#    crontab -l

# Cron Schedule Format: minute hour day month weekday
# 0 0 * * * = Every day at 00:00 (midnight UTC)
# 0 2 * * * = Every day at 02:00 (UTC)
# 0 12 * * * = Every day at 12:00 (noon UTC)

# =============================================================================
# WINDOWS SETUP (Task Scheduler)
# =============================================================================

# 1. Open Task Scheduler (search in Windows):
#    - Press Win+R, type "taskschd.msc"

# 2. Right-click "Task Scheduler Library" → "Create Basic Task"

# 3. Set up the task:
#    Name: "Daily ROI Crediting"
#    Description: "Automatically credit daily ROI to active investments"

# 4. Trigger Settings:
#    - Choose: "Daily"
#    - Recur every: 1 day
#    - Start time: 12:00 AM
#    - Make sure "Enabled" is checked

# 5. Action Settings:
#    - Program/script: C:\Program Files\nodejs\node.exe
#    - Arguments: C:\path\to\scripts\credit-daily-roi.js
#    - Start in: C:\path\to\project

# 6. Advanced Settings:
#    - Check "Run with highest privileges"
#    - Check "Run whether user is logged in or not"

# 7. Click Finish and test

# =============================================================================
# DOCKER SETUP (for containerized deployments)
# =============================================================================

# Add to Dockerfile:
# RUN apt-get update && apt-get install -y curl

# Add to docker-compose.yml:
# services:
#   roi-scheduler:
#     image: node:18-alpine
#     working_dir: /app
#     command: node scripts/credit-daily-roi.js
#     volumes:
#       - .:/app
#     environment:
#       - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
#       - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
#       - VITE_EMAILJS_SERVICE_ID=${VITE_EMAILJS_SERVICE_ID}

# =============================================================================
# HEROKU SETUP (for cloud deployments)
# =============================================================================

# 1. Add to Procfile:
#    roi-scheduler: node scripts/credit-daily-roi.js
#    web: npm --prefix server run start

# 2. Deploy:
#    git add Procfile
#    git commit -m "Add ROI scheduler dyno"
#    git push heroku main

# 3. Start the dyno:
#    heroku ps:scale roi-scheduler=1

# =============================================================================
# ALTERNATIVE: Webhook/External Cron Service
# =============================================================================

# Services like cron-job.org or easycron.com can trigger the endpoint:
# URL: https://your-domain.com/api/credit-daily-roi
# Method: POST
# Frequency: Daily at 12:00 AM UTC

# =============================================================================
# MONITORING
# =============================================================================

# Create logs directory:
mkdir -p logs

# Check recent cron runs:
# Linux: grep CRON /var/log/syslog | tail -20
# Mac: log stream --predicate 'eventMessage contains[cd] "cron"' --level debug

# View application logs:
tail -f logs/roi-cron.log
