#!/bin/bash
# Setup script for system cron job on Linux/Mac
# Usage: bash setup-cron.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
NODE_PATH=$(which node)
LOG_DIR="$PROJECT_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

echo "==========================================="
echo "Daily ROI Crediting - Cron Setup"
echo "==========================================="
echo ""
echo "Project Directory: $PROJECT_DIR"
echo "Node Path: $NODE_PATH"
echo "Log Directory: $LOG_DIR"
echo ""

# Check if node is installed
if [ -z "$NODE_PATH" ]; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found at: $NODE_PATH"
echo ""

# Create cron job entry
CRON_JOB="0 0 * * * $NODE_PATH $PROJECT_DIR/scripts/credit-daily-roi.js >> $LOG_DIR/roi-cron.log 2>&1"

echo "Cron job to be added:"
echo "  $CRON_JOB"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "credit-daily-roi.js"; then
    echo "⚠️  Cron job already exists!"
    echo "Current cron jobs:"
    crontab -l | grep "credit-daily-roi.js"
    echo ""
    read -p "Do you want to replace it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping cron setup"
        exit 0
    fi
    # Remove existing entry
    (crontab -l 2>/dev/null | grep -v "credit-daily-roi.js"; echo "$CRON_JOB") | crontab -
else
    # Add new entry
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
fi

echo ""
echo "✅ Cron job installed successfully!"
echo ""
echo "Verify installation:"
crontab -l | grep "credit-daily-roi.js"
echo ""
echo "==========================================="
echo "Monitor logs with:"
echo "  tail -f $LOG_DIR/roi-cron.log"
echo ""
echo "Remove cron job anytime with:"
echo "  crontab -e"
echo "  (delete the line with credit-daily-roi.js)"
echo "==========================================="
