# Email Notification Setup Guide

## Overview
Cipher Vault now supports automated email notifications for all user actions and admin decisions. Users receive emails when:
- Investments are created, approved, or rejected
- Withdrawals are created, approved, or rejected
- KYC verification is submitted, approved, or rejected
- Loan requests are created, approved, or rejected
- Account balance is updated by admin

## Email Service Options

### Option 1: EmailJS (Recommended for Quick Setup)
EmailJS is a free client-side email service that works great for small to medium applications.

**Pros:**
- ✅ Free tier includes 200 emails/month
- ✅ No backend required
- ✅ Quick setup (5 minutes)
- ✅ Email templates with branding
- ✅ Works directly from browser

**Setup Steps:**

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account
   - Verify your email

2. **Add Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Note your `Service ID`

3. **Create Email Template**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template:

   ```
   Subject: {{subject}}
   
   Hello {{to_name}},
   
   {{notification_type}} - {{message}}
   
   {{#if notification_type == 'success'}}
   ✅ This is great news!
   {{/if}}
   
   {{#if notification_type == 'error'}}
   ❌ We apologize for any inconvenience.
   {{/if}}
   
   If you have any questions, please contact our support team.
   
   Best regards,
   {{app_name}} Team
   
   © {{year}} {{app_name}}. All rights reserved.
   ```
   
   - Note your `Template ID`

4. **Get Public Key**
   - Go to "Account" → "API Keys"
   - Copy your `Public Key`

5. **Update Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your EmailJS credentials:

   ```env
   VITE_EMAIL_NOTIFICATIONS_ENABLED=true
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx
   VITE_APP_URL=https://your-domain.com
   ```

6. **Test**
   - Restart your development server: `npm run dev`
   - Perform an action (create investment, etc.)
   - Check that email was sent

### Option 2: Custom Backend API
For production apps with high email volume, use a backend email service.

**Recommended Services:**
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **AWS SES** - Very cheap, pay-as-you-go
- **Resend** - Modern API, great DX

**Setup Steps:**

1. **Create Backend Email Endpoint**
   ```javascript
   // server/routes/email.js
   app.post('/api/send-email', async (req, res) => {
     const { to, subject, html } = req.body;
     
     // Use your email service SDK
     await emailService.send({
       to,
       from: 'noreply@ciphervault.com',
       subject,
       html
     });
     
     res.json({ success: true });
   });
   ```

2. **Update Environment Variables**
   ```env
   VITE_EMAIL_NOTIFICATIONS_ENABLED=true
   VITE_EMAIL_API_ENDPOINT=https://your-api.com/api/send-email
   ```

3. **Update emailService.ts**
   - The service will automatically use your API endpoint
   - No additional code changes needed

## Email Templates

All emails use a professional template with:
- CipherVault branding
- Gradient header with gold accent
- Status-specific colors (green/red/yellow/blue)
- Responsive design
- Dark theme matching the dashboard

### Email Types

1. **Investment Notifications**
   - ✅ Investment Approved
   - ❌ Investment Rejected
   - ℹ️ Investment Received

2. **Withdrawal Notifications**
   - ✅ Withdrawal Approved
   - ❌ Withdrawal Rejected
   - ℹ️ Withdrawal Requested

3. **KYC Notifications**
   - ✅ KYC Verified
   - ❌ KYC Rejected
   - ℹ️ KYC Submitted

4. **Loan Notifications**
   - ✅ Loan Approved
   - ❌ Loan Rejected
   - ℹ️ Loan Requested

5. **Balance Updates**
   - 💰 Balance Increased
   - 💰 Balance Decreased

## Disable Email Notifications

For development/testing without emails:

```env
VITE_EMAIL_NOTIFICATIONS_ENABLED=false
```

Emails will be logged to console instead of being sent.

## Troubleshooting

### Emails not sending
1. Check `.env` file has correct credentials
2. Verify `VITE_EMAIL_NOTIFICATIONS_ENABLED=true`
3. Check browser console for errors
4. Verify EmailJS service is active
5. Check EmailJS dashboard for delivery logs

### Emails going to spam
1. Configure SPF/DKIM records for your domain
2. Use a verified sender email
3. Avoid spam trigger words
4. Keep email content professional

### Rate limiting
- EmailJS free tier: 200 emails/month
- Upgrade to paid plan for more volume
- Or switch to backend email service

## Best Practices

1. **Test in Development**
   - Use a test email address
   - Verify all notification types work
   - Check email formatting on mobile

2. **Monitor Deliverability**
   - Check EmailJS dashboard regularly
   - Monitor bounce/complaint rates
   - Keep email list clean

3. **Respect User Preferences**
   - Allow users to opt-out
   - Send only relevant notifications
   - Don't spam users

4. **Security**
   - Never commit `.env` to git
   - Use environment variables
   - Validate email addresses
   - Rate limit email sending

## Advanced Features

### Add Email Preferences
Allow users to control which emails they receive:

```typescript
interface EmailPreferences {
  investmentUpdates: boolean;
  withdrawalUpdates: boolean;
  kycUpdates: boolean;
  loanUpdates: boolean;
  balanceUpdates: boolean;
}
```

### Email Queue
For high volume, implement email queue:
- Use BullMQ or similar
- Process emails in background
- Retry failed sends
- Track delivery status

### Email Analytics
Track email performance:
- Open rates
- Click rates
- Bounce rates
- Unsubscribe rates

## Support

For issues or questions:
- Check EmailJS documentation: https://www.emailjs.com/docs/
- Review email logs in EmailJS dashboard
- Test with different email providers
- Contact support if needed

## License

Email service integration is part of the CipherVault project and follows the same license.
