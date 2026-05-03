/**
 * Test script for investment pending notification endpoint
 * Tests sending email to pelumipecky@gmail.com
 */

const investmentId = 'test-' + Date.now();
const userId = 'pelumipecky'; // or whatever test user ID exists

const testPayload = {
  investmentId,
  userId
};

console.log('🧪 Testing Investment Pending Notification Endpoint');
console.log('================================================');
console.log('Endpoint: POST /api/investments/send-pending-notification');
console.log('Payload:', JSON.stringify(testPayload, null, 2));
console.log('');

// Try to reach the API
const apiUrl = 'http://localhost:3000/api/investments/send-pending-notification';

fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
})
  .then(res => {
    console.log('Status:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    console.log('Response:', JSON.stringify(data, null, 2));
    if (data.success) {
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', data.messageId);
    } else {
      console.log('❌ Error:', data.error);
    }
  })
  .catch(err => {
    console.error('❌ Request failed:', err.message);
    console.log('   Make sure the API server is running on port 3000');
  });
