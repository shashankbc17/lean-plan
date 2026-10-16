import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkSidebar() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const info = await page.evaluate(() => {
    const nav = document.querySelector('flow-project-navigation, [role="navigation"]');
    const videosBtn = [...document.querySelectorAll('button, a')].find(b => (b.innerText || '').includes('Videos'));
    return {
      hasNav: !!nav,
      videosBtnExists: !!videosBtn,
      rect: videosBtn ? videosBtn.getBoundingClientRect() : null
    };
  });

  console.log('Sidebar navigation status:', info);
  await page.screenshot({ path: 'scripts/flow_sidebar_state.png' });
  await browser.close();
}

checkSidebar();
