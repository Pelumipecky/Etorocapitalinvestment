import 'dotenv/config';
import fetch from 'node-fetch';

const API_URL = process.env.VITE_APP_URL?.replace(/\/$/, '') || 'https://ciphervault.online';

async function testStyledNotifications() {
  console.log('🧪 Testing styled email notifications...\n');
  
  const testEmail = 'cyphervault6@gmail.com';
  
  // Test 1: Loan Notification (Pending)
  console.log('1️⃣ Testing Loan Notification (Pending)...');
  const loanHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Loan Application Received</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #0f172a; color: #f0b90b; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #555; width: 40%; }
    .highlight { color: #f0b90b; font-weight: bold; }
    .footer { background-color: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cyphervault.vercel.app/images/ciphervaultlogobig.png" alt="Cypher Vault" width="200" />
    </div>
    <div class="content">
      <h2>🏦 Loan Application Received</h2>
      <p>Hello Test User,</p>
      <p>We've received your loan application and our team is currently reviewing it.</p>
      <table class="info-table">
        <tr><td>Amount Requested:</td><td class="highlight">$10,000</td></tr>
        <tr><td>Duration:</td><td>12 months</td></tr>
        <tr><td>Status:</td><td style="color: #f59e0b;">Under Review</td></tr>
      </table>
      <p>We'll notify you via email as soon as a decision has been made.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  await sendTestEmail(testEmail, '⏳ Loan Application Received - Cypher Vault', loanHTML);
  
  // Test 2: Investment Notification with Daily ROI
  console.log('\n2️⃣ Testing Investment Notification (with Daily ROI)...');
  const capital = 5000;
  const dailyRate = 0.03; // 3%
  const durationDays = 12;
  const dailyRoi = (capital * dailyRate).toFixed(2);
  const totalReturn = (capital * dailyRate * durationDays).toFixed(2);
  
  const investmentHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment Confirmed</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #0f172a; color: #f0b90b; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #555; width: 40%; }
    .highlight { color: #f0b90b; font-weight: bold; }
    .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .footer { background-color: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cyphervault.vercel.app/images/ciphervaultlogobig.png" alt="Cypher Vault" width="200" />
    </div>
    <div class="content">
      <h2>✅ Investment Confirmed!</h2>
      <p>Hello Test User,</p>
      <p>Success! Your investment in the <strong>12-Day Plan</strong> has been approved and is now active.</p>
      <table class="info-table">
        <tr><td>Plan:</td><td>12-Day Plan</td></tr>
        <tr><td>Capital Invested:</td><td class="highlight">$${capital.toLocaleString()}</td></tr>
        <tr><td>Daily ROI Rate:</td><td>${(dailyRate * 100).toFixed(2)}%</td></tr>
        <tr><td>Daily ROI Expected:</td><td class="highlight">$${parseFloat(dailyRoi).toLocaleString()}</td></tr>
        <tr><td>Duration:</td><td>${durationDays} Days</td></tr>
        <tr><td>Total Return Expected:</td><td class="highlight">$${parseFloat(totalReturn).toLocaleString()}</td></tr>
      </table>
      <p>Your investment is now active and will start generating returns every 24 hours.</p>
      <center><a href="https://cyphervault.vercel.app/dashboard" class="button">Track Investment</a></center>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  await sendTestEmail(testEmail, '✅ Investment Confirmed - Cypher Vault', investmentHTML);
  
  console.log('\n✨ Check your email at:', testEmail);
  console.log('📬 Both notifications should match the professional styling of other emails!');
}

async function sendTestEmail(to, subject, html) {
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Sent successfully');
    } else {
      console.error('   ❌ Failed:', result);
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }
}

testStyledNotifications();
