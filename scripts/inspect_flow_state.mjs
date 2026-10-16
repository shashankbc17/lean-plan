import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function inspect() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];
  console.log('Current URL:', page.url());

  const navItems = await page.evaluate(() => {
    return [...document.querySelectorAll('button, a, [role="tab"]')].map(el => ({
      text: (el.innerText || '').trim(),
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label')
    })).filter(x => x.text.length > 0 && x.text.length < 50);
  });
  console.log('Navigation / Buttons found:', navItems.filter(x => /video|media|asset|history|all/i.test(x.text || x.ariaLabel)));

  // Count videos
  const videosInDom = await page.evaluate(() => {
    const vids = [...document.querySelectorAll('video')];
    return vids.map(v => ({ src: v.src, currentSrc: v.currentSrc }));
  });
  console.log('Video elements in DOM:', videosInDom);

  // Take screenshot of current page state
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_current_state.png' });
  console.log('Saved screenshot to scripts/flow_current_state.png');

  await browser.close();
}

inspect().catch(console.error);
