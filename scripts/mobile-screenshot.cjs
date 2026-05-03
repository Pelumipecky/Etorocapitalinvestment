const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = process.env.URL || 'http://localhost:5177/';
const OUT_DIR = 'screenshots';
const OUT_FILE = `${OUT_DIR}/mobile-iphone12.png`;

async function waitForServer(url, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res && res.status < 500) return true;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

;(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Opening ${URL} in headless browser...`);
  try {
    await waitForServer(URL, 30000);
  } catch (err) {
    console.warn('Server did not respond in time, continuing to try opening the page...');
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const iPhone = puppeteer.devices['iPhone 12'];
  await page.emulate(iPhone);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => {
    console.warn('Page load timed out or failed:', e.message);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT_FILE, fullPage: true });
  console.log(`Saved screenshot to ${OUT_FILE}`);
  await browser.close();
})();
