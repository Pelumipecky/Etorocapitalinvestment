
const fetch = require('node-fetch');

const LIVE_URL = 'https://cyphervault.vercel.app/api/notify/welcome';
const TEST_EMAIL = 'cyphervault6@gmail.com';

async function testLiveDeployment() {
    console.log(`🚀 Testing Live Vercel Deployment...`);
    console.log(`Target: ${LIVE_URL}`);
    
    try {
        const response = await fetch(LIVE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                name: "Live Deployment Test"
            })
        });

        const text = await response.text();
        
        console.log(`\nStatus Code: ${response.status}`);
        console.log(`Response Body: ${text}`);

        if (response.ok) {
            console.log('\n✅ SUCCESS: The live API received the request and sent the email.');
        } else {
            console.log('\n❌ FAILED: The live API returned an error.');
            console.log('Troubleshooting: Check Vercel Logs for server-side errors.');
        }
    } catch (error) {
        console.error('\n❌ NETWORK ERROR:', error.message);
    }
}

testLiveDeployment();
