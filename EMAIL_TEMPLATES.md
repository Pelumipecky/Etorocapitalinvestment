# Email Notification Preview - Cypher Vault

## 📧 Overview

The system sends three types of email notifications to users:

1. **Daily ROI Email** - Sent when ROI is credited daily
2. **Investment Completion Email** - Sent when investment reaches its duration
3. **Backfill ROI Email** - Sent when missed ROI is credited

---

## 📬 Email 1: Daily ROI Notification

### Subject: `💰 Daily ROI Credited - Cypher Vault`

```
Hello John Doe,

✨ Great news! Your daily ROI has been credited to your account.

┌────────────────────────────────┐
│     Daily ROI Credited         │
│     ────────────────          │
│     $35.00                     │
│     From 15-Day Plan           │
└────────────────────────────────┘

📊 Investment Details:
   • Investment Plan: 15-Day Plan
   • Today's Earnings: $35.00
   • Total Earnings (So Far): $175.00
   • Current Balance: $2,500.00

Your investment continues to earn passive income every day. 
Keep your investment active and watch your balance grow! 📈

[View Your Dashboard Button]

---
© 2025 Cypher Vault. All rights reserved.
You're receiving this because you have an active investment with us.
```

### Sent By
- **Service:** EmailJS
- **Trigger:** Daily when ROI is credited (12:00 AM UTC)
- **Variables:**
  - `to_email` - User's email address
  - `to_name` - User's full name
  - `roiAmount` - Daily ROI credited
  - `investmentPlan` - Plan name
  - `currentBalance` - Updated balance
  - `totalEarnings` - Total ROI earned so far

---

## 🎉 Email 2: Investment Completion Notification

### Subject: `🎉 Investment Plan Completed - Cypher Vault`

```
Hello Sarah Johnson,

🎊 Congratulations! Your 15-Day investment plan has been 
completed successfully!

📊 Investment Summary:
   • Investment Plan: 15-Day Plan
   • Initial Capital: $1,000.00
   • ROI Earned: $525.00 ✓
   • Completion Bonus: $105.00 ✓
   • Total Earnings: $630.00

┌────────────────────────────────┐
│    Your New Balance            │
│    ─────────────────          │
│    $3,130.00 ✓                │
└────────────────────────────────┘

Your investment has generated excellent returns! Your capital plus 
all earnings have been added to your account balance. You can now 
withdraw, reinvest, or explore other investment opportunities. 💼

[Manage Your Account Button]

---
© 2025 Cypher Vault. All rights reserved.
Thank you for investing with us!
```

### Sent By
- **Service:** EmailJS
- **Trigger:** When investment completes its duration
- **Variables:**
  - `to_email` - User's email address
  - `to_name` - User's full name
  - `investmentPlan` - Plan name
  - `totalROI` - Total ROI earned
  - `bonusAmount` - Completion bonus
  - `currentBalance` - New balance

---

## 💳 Email 3: Backfill ROI Credit Notification

### Subject: `💳 Backfill ROI Credit - Cypher Vault`

```
Hello Michael Chen,

We've processed a backfill credit to ensure you receive all earned 
ROI from your investments. Here's a summary of what was credited:

📊 Backfill Details:
   • Investment ID: INV-2025-001
   • Investment Plan: 3-Month Plan
   • Missed Days Credited: 12 days
   • Missed ROI Credited: $480.00 ✓

┌────────────────────────────────┐
│    Total Credit Amount         │
│    ──────────────────         │
│    $480.00 ✓                  │
└────────────────────────────────┘

We apologize for any inconvenience. Your account has been updated 
with the missed ROI. Your new balance reflects all accumulated 
earnings. Thank you for your patience and continued trust in Cypher 
Vault! ✨

[Check Your Balance Button]

---
© 2025 Cypher Vault. All rights reserved.
Your trust means everything to us.
```

### Sent By
- **Service:** EmailJS
- **Trigger:** When backfill script runs
- **Variables:**
  - `to_email` - User's email address
  - `to_name` - User's full name
  - `investmentId` - Investment ID
  - `missedDays` - Number of days credited
  - `totalMissedROI` - Amount credited
  - `investmentPlan` - Plan name

---

## ⚙️ Email Configuration

### Enable/Disable Emails

Add to `.env` file:
```env
# Email Notifications
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
```

### EmailJS Credentials

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_ciphervault
VITE_EMAILJS_TEMPLATE_ID=template_notification
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_PRIVATE_KEY=your_private_key_here
```

### Get Credentials from EmailJS

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create a new service (Gmail, Outlook, etc.)
3. Create email templates
4. Get your keys from:
   - Account → API Keys → Public Key
   - Account → API Keys → Private Key
5. Add to `.env` file

---

## 📋 Email Template Variables Reference

### All Emails Include
- `notification_type` - Type of notification (success, warning, error)
- `app_name` - "Cypher Vault"
- `subject` - Email subject line
- `message` - Main email content
- `year` - Current year for footer

### Daily ROI Email Variables
```javascript
{
  to_email: "user@example.com",
  to_name: "John Doe",
  subject: "💰 Daily ROI Credited - Cypher Vault",
  message: "Great news! Your daily ROI of $35.00 from the 15-Day Plan has been credited...",
  notification_type: "success",
  app_name: "Cypher Vault",
  year: 2025
}
```

### Completion Email Variables
```javascript
{
  to_email: "user@example.com",
  to_name: "Sarah Johnson",
  subject: "🎉 Investment Plan Completed - Cypher Vault",
  message: "Congratulations! Your 15-Day investment has completed successfully...",
  notification_type: "success",
  app_name: "Cypher Vault",
  year: 2025
}
```

### Backfill Email Variables
```javascript
{
  to_email: "user@example.com",
  to_name: "Michael Chen",
  subject: "💳 Backfill ROI Credit - Cypher Vault",
  message: "We've credited 12 days of missed ROI to your account...",
  notification_type: "success",
  app_name: "Cypher Vault",
  year: 2025
}
```

---

## 📤 How Emails Are Sent

### Daily ROI Emails
**Location:** `server/scheduler.js` (lines 64-80)
```javascript
await sendROINotificationEmail(
  userEmail,
  userName,
  dailyRoiAmount,
  investmentPlan,
  currentBalance,
  totalEarnings
);
```

**Trigger:** Every day at 12:00 AM UTC (via scheduler)
**Frequency:** Once per investment per day

### Completion Emails
**Location:** `server/scheduler.js` (lines 200-220)
```javascript
await sendInvestmentCompletionEmail(
  userEmail,
  userName,
  investmentPlan,
  totalROI,
  bonusAmount,
  newBalance
);
```

**Trigger:** When investment duration is reached
**Frequency:** Once per investment at completion

### Backfill Emails
**Location:** `scripts/backfill-missed-roi.js` (lines 420-435)
```javascript
await sendBackfillEmail(
  userEmail,
  userName,
  investmentId,
  missedDays,
  totalMissedROI,
  investmentPlan,
  newBalance
);
```

**Trigger:** When backfill script runs
**Frequency:** Once per investment with missed ROI

---

## 🎨 Email Template Customization

### Customize in EmailJS Dashboard

1. Login to [emailjs.com](https://www.emailjs.com)
2. Go to **Email Templates**
3. Select `template_notification`
4. Edit the HTML template
5. Use these variables:
   - `{{to_name}}` - Recipient name
   - `{{to_email}}` - Recipient email
   - `{{subject}}` - Email subject
   - `{{message}}` - Main content
   - `{{notification_type}}` - success/warning/error
   - `{{app_name}}` - Application name
   - `{{year}}` - Current year

### Example EmailJS Template
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>{{subject}}</h2>
    </div>
    <div class="content">
      <p>Hello {{to_name}},</p>
      <p>{{message}}</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{app_name}}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## ✅ Testing Emails

### Test Daily ROI Email
```bash
curl -X POST http://localhost:3000/api/credit-daily-roi
# Check user inboxes for email
```

### Test Backfill Email
```bash
npm run backfill-roi
# Check user inboxes for backfill emails
```

### Manual Test via EmailJS
1. Go to [emailjs.com](https://www.emailjs.com)
2. Select your service
3. Click "Test It" under your template
4. Fill in variables
5. Send test email

---

## 📊 Email Delivery Statistics

### Expected Email Frequency
| Event | Frequency | Recipients |
|-------|-----------|------------|
| Daily ROI | 1x daily | Active investment users |
| Completion | 1x per investment | Users with completed investments |
| Backfill | 1x per backfill run | Users with missed credits |

### Email Performance
- **Delivery Rate:** ~99% (EmailJS standard)
- **Send Time:** <1 second per email
- **Batch Size:** Emails sent sequentially
- **Retry Policy:** EmailJS handles retries

---

## 🔧 Troubleshooting Email Issues

### Emails Not Sending

**Issue:** No emails received
```bash
# Check .env file
grep EMAIL .env

# Verify EmailJS credentials
# Should show:
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAILJS_SERVICE_ID=service_xxx
EMAILJS_PRIVATE_KEY=xxx
```

**Issue:** Wrong email address
```bash
# Check user record in database
SELECT email, name FROM users WHERE idnum = 'user_id'
```

**Issue:** Template not found
```bash
# Verify template exists in EmailJS
# Default template: template_notification
# Check EmailJS dashboard
```

### Email Content Issues

**Issue:** Variables not filling in
```javascript
// Check template uses correct variable syntax
// Correct: {{to_name}}, {{message}}
// Wrong: {to_name}, ${to_name}
```

**Issue:** Formatting broken
```html
<!-- Check if EmailJS template has proper HTML -->
<!-- Should be valid HTML with style tags -->
```

### Email Logging

Enable email logging in `server/scheduler.js`:
```javascript
// Line 60-64
if (EMAILJS_PRIVATE_KEY) {
  console.log('Sending email to:', userEmail);  // Add this
  emailjs.init({...})
  // ... send email ...
  console.log('Email sent successfully to:', userEmail);  // Add this
}
```

---

## 📞 Support

For email issues:

1. **Check EmailJS dashboard** for delivery logs
2. **Review server logs** for error messages
3. **Verify .env configuration** with correct credentials
4. **Test template** directly in EmailJS
5. **Check spam folder** (sometimes emails go there)

See [COMPLETE_ROI_SETUP.md](COMPLETE_ROI_SETUP.md) for full ROI system documentation.
