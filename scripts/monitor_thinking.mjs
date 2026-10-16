import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function monitorThinking() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  for (let i = 1; i <= 20; i++) {
    await page.waitForTimeout(3000);
    const state = await page.evaluate(() => {
      const stopBtn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').toLowerCase().includes('stop'));
      const approveBtn = [...document.querySelectorAll('*')].find(el => {
        const t = (el.innerText || '').trim();
        return (t === 'Approve' || t === 'Always approve' || t === 'check Approve') && el.children.length <= 2;
      });
      return {
        stopVisible: !!stopBtn,
        hasApprove: !!approveBtn,
        approveText: approveBtn ? approveBtn.innerText.trim() : null
      };
    });
    console.log(`[${i * 3}s] State:`, state);
    if (state.hasApprove) {
      console.log('APPROVE BUTTON DETECTED!');
      await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/approve_detected.png' });
      break;
    }
    if (!state.stopVisible && i >= 5) {
      console.log('Stop button disappeared!');
      await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/thinking_ended.png' });
      break;
    }
  }

  await browser.close();
}

monitorThinking().catch(console.error);
