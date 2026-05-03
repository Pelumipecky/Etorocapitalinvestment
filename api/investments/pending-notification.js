/**
 * POST /api/investments/pending-notification
 * 
 * Server-side ONLY endpoint to send investment pending notification email
 * This endpoint ONLY sends the email - it does NOT modify any database records
 * Investment creation/status management happens elsewhere
 * 
 * Required body fields:
 *   - investmentId: string
 *   - userId: string
 *   - userEmail: string (REQUIRED if database fetch fails)
 *   - plan: string (REQUIRED if database fetch fails)
 *   - amount: number (REQUIRED if database fetch fails)
 *   - userName: string (optional)
 *   - dailyRoiRate: number (optional)
 *   - duration: number (optional)
 * 
 * Returns: { success: boolean, messageId?: string, message: string }
 */

import dotenv from 'dotenv';
import { getEmailProviderStatus, sendTransactionalEmail } from '../mailProvider.js';

dotenv.config();

const SITE_URL = (process.env.EMAIL_SITE_URL || process.env.VITE_APP_URL || `https://${process.env.APP_DOMAIN || 'etorocapitalinvestment.vercel.app'}`).replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'noreply@etorocapital.online';

export default async function handler(req, res) {
  console.log('\n🔵 [ENDPOINT CALLED] /api/investments/pending-notification');
  console.log('Method:', req.method);
  console.log('Body received:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    console.error('❌ Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { investmentId, userId, userEmail, plan, amount, userName, dailyRoiRate, duration } = req.body;

    console.log('\n📋 Validating input data:');
    console.log('  ✓ investmentId:', investmentId ? '✅' : '❌');
    console.log('  ✓ userId:', userId ? '✅' : '❌');
    console.log('  ✓ userEmail:', userEmail ? '✅' : '❌');
    console.log('  ✓ plan:', plan ? '✅' : '❌');
    console.log('  ✓ amount:', amount ? '✅' : '❌');

    const providerStatus = getEmailProviderStatus();
    console.log('\n🔐 Checking email provider configuration:', providerStatus);

    if (!providerStatus.activeProvider) {
      console.error('❌ Email provider not configured - CANNOT SEND EMAIL');
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: 'Configure TurboSMTP SMTP credentials in the environment'
      });
    }

    // Validate minimum required fields
    if (!investmentId || !userId) {
      console.error('❌ Missing critical fields: investmentId or userId');
      return res.status(400).json({
        error: 'Missing required fields: investmentId, userId'
      });
    }

    if (!userEmail) {
      console.error('❌ Missing userEmail - cannot send email');
      return res.status(400).json({
        error: 'Missing userEmail'
      });
    }

    if (!plan || !amount) {
      console.error('❌ Missing investment details: plan or amount');
      return res.status(400).json({
        error: 'Missing investment details'
      });
    }

    // Prepare email data
    const finalUserName = userName || 'Valued Member';
    const finalAmount = parseFloat(amount) || 0;
    const finalPlan = plan || 'Investment Plan';
    const finalRoi = parseFloat(dailyRoiRate) || 0;
    const finalDuration = parseInt(duration) || 0;

    const dailyRoiAmount = (finalAmount * finalRoi).toFixed(2);
    const totalReturn = (finalAmount * finalRoi * finalDuration).toFixed(2);

    console.log('\n✉️  Email data prepared:');
    console.log('  To:', userEmail);
    console.log('  User:', finalUserName);
    console.log('  Plan:', finalPlan);
    console.log('  Amount: $' + finalAmount);
    console.log('  Daily ROI: $' + dailyRoiAmount);

    // Create email HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment Pending</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: #ffffff; color: #0f172a; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table tr td { padding: 12px; border-bottom: 1px solid #eee; }
    .info-table tr td:first-child { font-weight: bold; width: 40%; background: #f9f9f9; }
    .highlight { color: #0f172a; font-weight: bold; font-size: 16px; }
    .button { display: inline-block; padding: 12px 30px; background: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
    .badge { display: inline-block; background: #fbbf24; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0; color: #f0b90b;">⏳ Investment Received</h2>
    </div>
    <div class="content">
      <p>Hello <strong>${finalUserName}</strong>,</p>
      <p>Thank you for your investment submission! Your <strong>${finalPlan}</strong> investment has been received and is now <span class="badge">PENDING REVIEW</span>.</p>
      
      <h3 style="color: #0f172a; border-bottom: 2px solid #f0b90b; padding-bottom: 10px;">Investment Details</h3>
      <table class="info-table">
        <tr>
          <td>Plan</td>
          <td><strong>${finalPlan}</strong></td>
        </tr>
        <tr>
          <td>Amount</td>
          <td class="highlight">$${finalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
        <tr>
          <td>Daily ROI</td>
          <td><strong>${(finalRoi * 100).toFixed(2)}%</strong></td>
        </tr>
        <tr>
          <td>Daily Return</td>
          <td class="highlight">$${dailyRoiAmount}</td>
        </tr>
        <tr>
          <td>Duration</td>
          <td><strong>${finalDuration} days</strong></td>
        </tr>
        <tr>
          <td>Total Expected Return</td>
          <td class="highlight">$${totalReturn}</td>
        </tr>
      </table>

      <p><strong>What's Next?</strong></p>
      <ul>
        <li>Our team will review your investment request</li>
        <li>You'll receive an approval email shortly</li>
        <li>Returns begin accruing immediately upon approval</li>
      </ul>

      <div style="text-align: center;">
        <a href="${SITE_URL}/dashboard" class="button">View Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 eToro Trust Capital. All rights reserved.</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

    console.log('\n📤 Sending investment pending notification...');
    const result = await sendTransactionalEmail({
      to: userEmail,
      toName: finalUserName,
      subject: '⏳ Investment Received - Pending Review',
      html,
    });

    if (!result.sent) {
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        message: 'Configure TurboSMTP SMTP credentials before sending email'
      });
    }

    console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
    console.log('  Provider:', result.provider);
    console.log('  Message ID:', result.messageId);
    console.log('  To:', userEmail);

    let adminMessageId = null;
    try {
      const adminResult = await sendTransactionalEmail({
        to: ADMIN_EMAIL,
        toName: 'Admin',
        subject: `New Investment Submission: $${finalAmount.toLocaleString()} from ${finalUserName || userEmail}`,
        html,
      });
      adminMessageId = adminResult.messageId || null;
      console.log('  Admin Message ID:', adminMessageId);
    } catch (adminErr) {
      console.warn('Admin investment notification failed:', adminErr.message || adminErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Investment notification email sent successfully',
      provider: result.provider,
      messageId: result.messageId,
      adminMessageId,
      emailSent: true
    });

  } catch (error) {
    console.error('\n❌ ERROR IN ENDPOINT:', error.message);
    console.error('Full error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message
    });
  }
}

