# 📧 Email Notification Templates - Text Preview

## Email Type 1: Daily ROI Notification

```
╔════════════════════════════════════════════════════════════════╗
║                   CYPHER VAULT                                  ║
║            💰 Daily ROI Credited                               ║
║            Your investment is earning for you!                 ║
╚════════════════════════════════════════════════════════════════╝

Hello John Doe,

✨ Great news! Your daily ROI of $35.00 from the 15-Day Plan has 
been credited to your account.

Total earnings so far: $175.00
Current balance: $2,500.00

Your investment continues to earn passive income every day. 
Keep your investment active and watch your balance grow! 📈

Would you like to check your dashboard?
[View Dashboard] ← Click here

╔════════════════════════════════════════════════════════════════╗
║                © 2025 Cypher Vault                             ║
║           All rights reserved                                  ║
║  You're receiving this because you have an active investment   ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Email Type 2: Investment Completion Notification

```
╔════════════════════════════════════════════════════════════════╗
║                   CYPHER VAULT                                  ║
║            🎉 Investment Plan Completed!                       ║
║            Congratulations on your successful investment!      ║
╚════════════════════════════════════════════════════════════════╝

Hello Sarah Johnson,

🎊 Congratulations! Your 15-Day investment plan has completed 
successfully!

═══════════════════════════════════════════════════════════════

INVESTMENT SUMMARY
─────────────────
Plan Name:              15-Day Plan
Initial Capital:        $1,000.00
ROI Earned:            $525.00 ✓
Completion Bonus:       $105.00 ✓
─────────────────────────────────
TOTAL EARNINGS:         $630.00

═══════════════════════════════════════════════════════════════

YOUR NEW BALANCE: $3,130.00 ✓

═══════════════════════════════════════════════════════════════

Your investment has generated excellent returns! Your capital plus 
all earnings have been added to your account balance. 

You can now:
  • Withdraw your earnings
  • Reinvest in a new plan
  • Explore other opportunities

[Manage Your Account] ← Click here

═══════════════════════════════════════════════════════════════

📊 What's Next?
• Check your updated balance
• Consider your next investment
• Share your success story

╔════════════════════════════════════════════════════════════════╗
║                © 2025 Cypher Vault                             ║
║           Thank you for investing with us!                     ║
║                All rights reserved                             ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Email Type 3: Backfill ROI Credit Notification

```
╔════════════════════════════════════════════════════════════════╗
║                   CYPHER VAULT                                  ║
║            💳 Backfill ROI Credit                              ║
║            We've credited your missed earnings!                ║
╚════════════════════════════════════════════════════════════════╝

Hello Michael Chen,

We've processed a backfill credit to ensure you receive all earned 
ROI from your investments. Here's a summary of what was credited:

═══════════════════════════════════════════════════════════════

BACKFILL DETAILS
────────────────
Investment ID:          INV-2025-001
Investment Plan:        3-Month Plan
Missed Days Credited:   12 days
Missed ROI Credited:    $480.00 ✓

═══════════════════════════════════════════════════════════════

TOTAL CREDIT AMOUNT:    $480.00 ✓

═══════════════════════════════════════════════════════════════

We apologize for any inconvenience. Your account has been updated 
with the missed ROI. Your new balance reflects all accumulated 
earnings. 

Thank you for your patience and continued trust in Cypher Vault! ✨

[Check Your Balance] ← Click here

═══════════════════════════════════════════════════════════════

❓ Questions?
If you have any questions about this credit or your account, 
please contact our support team.

╔════════════════════════════════════════════════════════════════╗
║                © 2025 Cypher Vault                             ║
║           Your trust means everything to us                    ║
║                All rights reserved                             ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Email Styling Features

### Colors Used
- **Primary:** Purple (#667eea) - Accent elements
- **Success:** Green (#10b981) - Amount highlights
- **Background:** White (#ffffff)
- **Text:** Dark gray (#333333)
- **Muted:** Light gray (#666666)

### Font Styles
- **Header:** Bold, Large (24px)
- **Amount:** Bold, Very Large (28px+)
- **Labels:** Bold, Small (12px)
- **Body:** Regular, Medium (14px)

### Visual Elements
- ✨ Emoji icons for visual interest
- ✓ Checkmarks for confirmations
- ═══ Divider lines for sections
- 📊 Chart references
- 💰 Money indicators
- 🎉 Celebration emojis

---

## 📋 Variable Substitution Example

### Original Template
```
Hello {{to_name}},

Great news! Your daily ROI of {{roiAmount}} from the {{investmentPlan}} 
has been credited to your account.

Total earnings so far: {{totalEarnings}}
Current balance: {{currentBalance}}
```

### After Substitution
```
Hello John Doe,

Great news! Your daily ROI of $35.00 from the 15-Day Plan 
has been credited to your account.

Total earnings so far: $175.00
Current balance: $2,500.00
```

---

## 🔄 Email Frequency Timeline

### Example User Investment Timeline

```
Dec 1, 2025 - Investment Created (15-Day Plan: $1,000)
│
├─ Dec 2, 2025 - 12:00 AM UTC
│  └─ 📧 Email: Daily ROI $35.00 credited
│
├─ Dec 3, 2025 - 12:00 AM UTC
│  └─ 📧 Email: Daily ROI $35.00 credited
│
├─ Dec 4, 2025 - 12:00 AM UTC
│  └─ 📧 Email: Daily ROI $35.00 credited
│
... (continues daily for 15 days)
│
├─ Dec 16, 2025 - 12:00 AM UTC
│  └─ 📧 Email: Daily ROI $35.00 credited
│     AND
│  └─ 📧 Email: 🎉 Investment Completed! Total: $630.00
│
└─ Status: COMPLETED
   New Balance: $3,130.00
```

---

## 📊 Email Content Structure

### All Email Types Follow This Pattern

```
┌─ HEADER
│  ├─ Emoji + Title
│  ├─ Gradient background
│  └─ Subtitle
│
├─ GREETING
│  └─ Hello {name},
│
├─ OPENING MESSAGE
│  ├─ Key information
│  ├─ Why they're receiving this
│  └─ What action was taken
│
├─ AMOUNT BOX (highlighted)
│  ├─ Main amount in large font
│  ├─ Supporting info
│  └─ Source/reason
│
├─ DETAILS SECTION (table)
│  ├─ Label: Value pairs
│  ├─ Related information
│  └─ Additional context
│
├─ MESSAGE BODY
│  ├─ Explanation
│  ├─ Next steps
│  └─ Encouragement
│
├─ CALL-TO-ACTION
│  └─ Button to dashboard/account
│
└─ FOOTER
   ├─ Copyright
   ├─ Company info
   └─ Additional notes
```

---

## ✅ What Each Email Confirms

### Daily ROI Email Confirms:
- ✓ ROI was calculated correctly
- ✓ Amount was credited to account
- ✓ Investment is still active
- ✓ Running total of earnings
- ✓ Current account balance

### Completion Email Confirms:
- ✓ Investment duration completed
- ✓ All ROI was credited
- ✓ Bonus was added
- ✓ Final balance updated
- ✓ Investment status: Completed

### Backfill Email Confirms:
- ✓ Missed days were identified
- ✓ Missed ROI was calculated
- ✓ Credit was applied
- ✓ Balance updated
- ✓ System was corrected

---

## 🔐 Security & Privacy

### Email Security
- Emails sent via EmailJS (secure SMTP relay)
- No sensitive data in email subject
- Investment details in body only
- User emails encrypted in database
- Opt-out available in footer

### Data Protection
- Only user's own data in email
- No other users' information leaked
- Support contact available
- Timestamps for audit trail
- No sensitive credentials ever sent

---

## 📱 Mobile Responsive Design

Emails are designed to work well on:
- ✓ Desktop clients (Outlook, Gmail, etc.)
- ✓ Mobile devices (iOS Mail, Android Gmail)
- ✓ Tablets (iPad, Android tablets)
- ✓ Web browsers (webmail)

### Mobile Optimizations
- Single column layout
- Responsive typography
- Touch-friendly links/buttons
- Full-width on small screens
- Optimized for viewing on phones

---

## 📞 Support Contact Information

All emails include information about:
- Contacting support
- Accessing account
- Reviewing transactions
- Managing preferences
- Security concerns

### Support Channel
Users should go to: Dashboard → Support → Contact Us

---

## 🎯 User Experience Goals

Each email is designed to:
1. **Confirm action** - User knows what happened
2. **Show value** - Display earnings clearly
3. **Encourage engagement** - Motivate continued investment
4. **Build trust** - Professional, accurate communication
5. **Enable action** - Clear next steps (buttons)
6. **Provide transparency** - All details visible
7. **Celebrate wins** - Special emails for milestones

---

**Note:** All email templates are customizable in EmailJS dashboard. 
See EMAIL_TEMPLATES.md for configuration details.
