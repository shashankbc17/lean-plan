import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testConnection() {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
    const context = browser.contexts()[0];
    const page = context.pages().find(p => p.url().includes('flow.google.com')) || context.pages()[0];
    console.log('Successfully connected to Flow Chrome!');
    console.log('Current URL:', page.url());
    console.log('Page Title:', await page.title());
    await browser.close();
  } catch (err) {
    console.error('CDP connection error:', err.message);
  }
}

testConnection();
