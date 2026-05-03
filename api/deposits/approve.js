import dotenv from 'dotenv';
import { sendTransactionalEmail } from '../mailProvider.js';

dotenv.config();

const SITE_URL = (process.env.EMAIL_SITE_URL || process.env.VITE_APP_URL || `https://${process.env.APP_DOMAIN || 'etorocapitalinvestment.vercel.app'}`).replace(/\/$/, '');
const EMAIL_LOGO_PATH = '/images/email-logo.png';
const LOGO_IMAGE = process.env.EMAIL_LOGO_URL || `${SITE_URL}${EMAIL_LOGO_PATH}`;
const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/?sl=en&tl=auto&op=translate';

/**
 * POST /api/deposits/approve
 * Send deposit approval email
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { depositId, userId, amount, method, userName, userEmail, transactionHash } = req.body;

    // Validate input
    if (!depositId || !userId || !amount || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields: depositId, userId, amount, userEmail' });
    }

    console.log('\n' + '='.repeat(70));
    console.log('📧 /api/deposits/approve - Deposit Approval Email');
    console.log('='.repeat(70));
    console.log('Details:', { depositId, userId, amount, userEmail, method });

    // Create email HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Deposit Approved</title>
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
      <h2>Deposit Approved!</h2>
      <p>Hello ${userName || 'User'},</p>
      <p>Success! Your deposit has been confirmed and credited to your account.</p>
      <table class="info-table">
        <tr><td>Amount:</td><td class="highlight">$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Method:</td><td>${method || 'Crypto'}</td></tr>
        ${transactionHash ? `<tr><td>Transaction Hash:</td><td style="font-family: monospace; font-size: 12px; word-break: break-all;">${transactionHash}</td></tr>` : ''}
        <tr><td>Status:</td><td style="color: #22c55e;">Approved</td></tr>
      </table>
      <p>Funds are now available in your balance for trading or investment.</p>
      <center><a href="${SITE_URL}/dashboard" class="button">Go to Dashboard</a></center>
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

    console.log('📤 Sending deposit approval notification...');
    const result = await sendTransactionalEmail({
      to: userEmail,
      toName: userName || 'User',
      subject: 'Deposit Approved - eToro Trust Capital',
      html,
    });

    if (!result.sent) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log(`✅ ${result.provider} response:`, {
      messageId: result.messageId,
    });
    console.log('='.repeat(70) + '\n');

    return res.status(200).json({
      success: true,
      provider: result.provider,
      messageId: result.messageId,
      message: 'Deposit approval email sent successfully'
    });

  } catch (error) {
    console.error('❌ Email Send Error:', { message: error.message });
    console.log('='.repeat(70) + '\n');

    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}

