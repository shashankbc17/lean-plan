import { pathToFileURL } from 'url';

const configPath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/config.js').href;
const statePath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/state.js').href;
const adapterPath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/flow-adapter.js').href;

const [{ loadConfig }, { StateStore }, { FlowBrowserAdapter }] = await Promise.all([
  import(configPath),
  import(statePath),
  import(adapterPath)
]);

const config = loadConfig();
const store = new StateStore(config.databaseFile);
const adapter = new FlowBrowserAdapter(config, store);

const MOTION_PROMPT = "Animate this image into a seamless looping video with Omni 1.1 Flash: athletic model smoothly alternating bicycle crunches with tempo hold, rotating opposite elbow to knee in controlled fluid motion, steady camera, 60fps.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Wait until Stop button is gone (image finished rendering)
  console.log('Waiting for image generation to settle...');
  for (let i = 1; i <= 6; i++) {
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible) break;
    await page.waitForTimeout(5000);
  }

  // 2. Open ingredients picker
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1500);

  // 3. Find the newest bicycle crunch image (first in list)
  const imageItem = page.locator('.cdk-overlay-container').getByText(/bicycle crunch|Model performing|Image/i).first();
  console.log('Image item in picker visible:', await imageItem.isVisible().catch(() => false));
  await imageItem.click();
  await page.waitForTimeout(500);

  // Click 'Add to prompt'
  const addToPromptBtn = page.getByText('Add to prompt').first();
  await addToPromptBtn.click();
  await page.waitForTimeout(1500);

  // 4. Type motion prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 5. Submit motion prompt
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Waiting for approval card...');

  // 6. Wait for approval card to render
  for (let i = 1; i <= 5; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (!stopVisible && i >= 2) break;
  }

  // 7. Scroll down to find and click Approve
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const a of all) {
      if (a.scrollHeight > a.clientHeight && a.clientHeight > 300) a.scrollTop = a.scrollHeight;
    }
  });
  await page.waitForTimeout(1000);

  const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
  if (await approveRadio.isVisible().catch(() => false)) {
    console.log('Clicking Approve radio...');
    await approveRadio.click({ force: true });
    await page.waitForTimeout(1500);

    const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
    for (const b of confirmButtons) {
      const box = await b.boundingBox();
      if (box && box.y > 600) {
        console.log('Clicking confirmation Approve button at:', box);
        await b.click({ force: true });
        break;
      }
    }
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_bicycle_approved.png' });
  console.log('Saved flow_bicycle_approved.png');

} finally {
  await adapter.close();
}
