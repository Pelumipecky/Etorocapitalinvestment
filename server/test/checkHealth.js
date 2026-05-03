// simple test script to check the /api/health endpoint
// Usage: node test/checkHealth.js

const fetch = globalThis.fetch || (await import('node-fetch')).default;
const url = process.env.API_URL || 'http://localhost:3000/api/health';

(async () => {
  try {
    const res = await fetch(url);
    const body = await res.json();
    if (res.ok) {
      console.log('OK', body);
      process.exit(0);
    } else {
      console.error('Failed', res.status, body);
      process.exit(2);
    }
  } catch (err) {
    console.error('Error checking endpoint:', err.message || err);
    process.exit(1);
  }
})();
