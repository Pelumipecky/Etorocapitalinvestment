/**
 * POST /api/investments/send-pending-notification
 * Sends investment submission pending notification email
 * Uses same logic as /api/investments/pending.js which is working
 * 
 * Body: { investmentId, userId, amount, plan, dailyRoiRate, duration, userEmail, userName }
 * Returns: { success: boolean, messageId?: string, error?: string }
 */

import dotenv from 'dotenv';
import { getEmailProviderStatus, sendTransactionalEmail } from '../mailProvider.js';

dotenv.config();

const SITE_URL = (process.env.EMAIL_SITE_URL || process.env.VITE_APP_URL || `https://${process.env.APP_DOMAIN || 'etorocapitalinvestment.vercel.app'}`).replace(/\/$/, '');
const EMAIL_LOGO_PATH = '/images/email-logo.png';
const LOGO_IMAGE = process.env.EMAIL_LOGO_URL || `${SITE_URL}${EMAIL_LOGO_PATH}`;
const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/?sl=en&tl=auto&op=translate';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'noreply@etorocapital.online';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { investmentId, userId, amount, plan, dailyRoiRate, duration, userEmail, userName } = req.body;

    console.log('\n📧 Investment Send Pending Notification');
    console.log('Inputs:', { investmentId, userId, amount, plan, userEmail });

    // Validate input
    if (!investmentId || !userId || !amount || !plan || !userEmail) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields: investmentId, userId, amount, plan, userEmail' 
      });
    }

    const providerStatus = getEmailProviderStatus();
    if (!providerStatus.activeProvider) {
      console.error('❌ Email service not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log(`✅ Email provider configured: ${providerStatus.activeProvider}`);

    // Calculate expected ROI
    const dailyRoiAmount = dailyRoiRate ? (amount * dailyRoiRate).toFixed(2) : null;
    const totalReturn = dailyRoiRate && duration ? (amount * dailyRoiRate * duration).toFixed(2) : null;

    console.log('💰 Investment calculations:', { dailyRoiAmount, totalReturn });

    // Create email HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment Pending</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #ffffff; color: #0f172a; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .footer { background-color: #ffffff; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
    .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .translate-box { margin: 24px 0 0; padding: 16px; text-align: center; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; }
    .translate-box p { margin: 0 0 10px; color: #475569; font-size: 13px; }
    .translate-link { display: inline-block; padding: 9px 16px; background: #ffffff; color: #0f172a; text-decoration: none; border: 1px solid #d1d5db; border-radius: 6px; font-weight: 600; font-size: 13px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #555; width: 40%; }
    .highlight { color: #0f172a; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="text-align: center; padding: 25px 0;">
      <a href="${SITE_URL}" target="_blank" style="text-decoration: none;">
        <img src="${LOGO_IMAGE}" alt="eToro Trust Capital" width="200" style="display: inline-block; max-width: 100%; height: auto; border: 0; font-family: sans-serif; font-size: 24px; color: #0f172a; font-weight: bold;" />
      </a>
    </div>
    <div class="content">
      <h2>⏳ Investment Request Received</h2>
      <p>Hello ${userName || 'User'},</p>
      <p>Thank you for submitting your investment request! We have received your application for the <strong>${plan}</strong> plan.</p>
      
      <p style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background-color: #fbbf24; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">PENDING REVIEW</span>
      </p>

      <p><strong>Your Investment Details:</strong></p>
      <table class="info-table">
        <tr><td>Plan</td><td>${plan}</td></tr>
        <tr><td>Amount</td><td class="highlight">$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        ${dailyRoiRate ? `<tr><td>Daily ROI Rate</td><td>${(dailyRoiRate * 100).toFixed(2)}%</td></tr>` : ''}
        ${dailyRoiAmount ? `<tr><td>Expected Daily Return</td><td class="highlight">$${parseFloat(dailyRoiAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>` : ''}
        ${duration ? `<tr><td>Duration</td><td><strong>${duration} Days</strong></td></tr>` : ''}
        ${totalReturn ? `<tr><td>Total Expected Return</td><td class="highlight">$${parseFloat(totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>` : ''}
        <tr><td>Status</td><td>Pending Review</td></tr>
      </table>
      
      <p>You will receive another email once your investment is approved and activated.</p>
      <center><a href="${SITE_URL}/dashboard" class="button">Track Investment</a></center>
      <div class="translate-box">
        <p>Need this notification in another language?</p>
        <a href="${GOOGLE_TRANSLATE_URL}" class="translate-link" target="_blank">Open Google Translate</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} eToro Trust Capital. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('📤 Sending investment pending notification...');
    const result = await sendTransactionalEmail({
      to: userEmail,
      toName: userName || 'User',
      subject: '⏳ Investment Request Received - eToro Trust Capital',
      html,
    });

    if (!result.sent) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log(`✅ ${result.provider} response:`, {
      messageId: result.messageId,
    });

    let adminMessageId = null;
    try {
      const adminResult = await sendTransactionalEmail({
        to: ADMIN_EMAIL,
        toName: 'Admin',
        subject: `New Investment Submission: $${parseFloat(amount).toLocaleString()} from ${userName || userEmail}`,
        html,
      });
      adminMessageId = adminResult.messageId || null;
      console.log('Admin investment notification result:', adminResult.sent, adminMessageId);
    } catch (adminErr) {
      console.warn('Admin investment notification failed:', adminErr.message || adminErr);
    }

    return res.status(200).json({
      success: true,
      provider: result.provider,
      messageId: result.messageId,
      adminMessageId,
      message: 'Investment pending notification sent successfully'
    });

  } catch (error) {
    console.error('❌ Email Send Error:', {
      message: error.message,
    });

    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}

