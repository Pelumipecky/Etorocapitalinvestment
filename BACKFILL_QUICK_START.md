# Quick ROI Backfill Reference

## One-Line Commands

```bash
# Run backfill immediately
npm run backfill-roi

# Run with output saved to file
npm run backfill-roi > backfill-report-$(date +%Y%m%d-%H%M%S).txt

# Run in background (Unix/Mac only)
npm run backfill-roi &

# Check if it's still running
jobs
```

## What It Does

✅ **Fetches all active investments**
✅ **Calculates missed ROI** from start date until today
✅ **Credits missing days** to user balances
✅ **Completes investments** that reached duration
✅ **Adds bonuses** for completed investments
✅ **Sends email notifications** (if configured)
✅ **Generates detailed report**

## Expected Results

```
Example: 50 active investments
├─ 45 with missed daily ROI (partial credit)
├─ 3 completed investments (ROI + bonus credit)
├─ 2 errors (user/plan not found)
└─ Total credit: ~$15,000 to 35 users
```

## Before Running

☐ Backup database (recommended)
☐ Check `.env` file configured
☐ Verify Supabase credentials valid
☐ Ensure database tables exist
☐ Run in development first if possible

## After Running

☐ Check summary report in console
☐ Verify user balances updated: `SELECT idnum, balance FROM users`
☐ Check completed investments: `SELECT * FROM investments WHERE status='completed'`
☐ Review for errors (⚠️ symbols in output)
☐ Send announcement to users if needed

## Example Output

```
Found 47 active investments

✅ Investment inv_001 COMPLETED: Credited $630
💰 Investment inv_002: Credited $175 (5 days)
💰 Investment inv_003: Credited $245 (7 days)
...
📋 Total Credit: $18,450.75
📊 Users Affected: 38
```

## Files

| File | Purpose |
|------|---------|
| `scripts/backfill-missed-roi.js` | Main backfill script |
| `BACKFILL_ROI_GUIDE.md` | Full documentation |
| `COMPLETE_ROI_SETUP.md` | ROI system overview |

## Common Issues

| Issue | Solution |
|-------|----------|
| No investments processed | Check database for `status = 'Active'` |
| Supabase error | Verify `.env` credentials |
| Emails not sent | Add EmailJS config to `.env` |
| Script won't run | Run `npm install` first |

## Support

- Full guide: `BACKFILL_ROI_GUIDE.md`
- Setup guide: `COMPLETE_ROI_SETUP.md`
- Daily scheduler: `server/scheduler.js`

---

**Ready to run?**
```bash
npm run backfill-roi
```
