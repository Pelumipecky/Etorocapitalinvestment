import 'dotenv/config';
import fetch from 'node-fetch';

const API_URL = process.env.VITE_APP_URL || 'https://ciphervault.online';

async function testLoanNotification() {
  console.log('🧪 Testing loan notification system...\n');
  
  const testEmail = 'cyphervault6@gmail.com';
  const testData = {
    to: testEmail,
    subject: '🏦 Test Loan Request - Cypher Vault',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <h1 style="color: #667eea; margin-bottom: 20px;">🏦 Test Loan Notification</h1>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear Admin,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            This is a test loan notification to verify the /api/send-email endpoint is working correctly.
          </p>
          <div style="background: #f7f9fc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>User:</strong> Test User</p>
            <p style="margin: 10px 0;"><strong>Amount:</strong> $5,000</p>
            <p style="margin: 10px 0;"><strong>Duration:</strong> 12 months</p>
            <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: #f39c12;">Pending</span></p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If you received this email, loan notifications are working correctly! ✅
          </p>
        </div>
      </div>
    `
  };
  
  try {
    console.log('📤 Sending test loan notification to:', testEmail);
    console.log('🔗 API URL:', `${API_URL}/api/send-email`);
    
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Loan notification sent successfully!');
      console.log('📬 Response:', result);
      console.log('\n✨ Check your email at:', testEmail);
    } else {
      console.error('❌ Failed to send loan notification');
      console.error('Status:', response.status);
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testLoanNotification();
