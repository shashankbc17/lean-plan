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

const MOTION_PROMPT = "Animate this image into a seamless looping video: athletic model smoothly driving right knee forward to touch right elbow with locked core, then extending back to push-up plank. Maintain exact lighting and cinematic gym studio setting, steady camera, fluid 60fps motion.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Click 'Add ingredients to the prompt box'
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1000);

  // 2. Select 'Model doing push-up plank' and add to prompt
  const addBtn = page.getByText('Add to prompt').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // 3. Type prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Click Submit
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  await submitBtn.click();
  console.log('Submitted prompt! Waiting for response to stream completely...');

  // 5. Poll until Stop button is gone or max 60s
  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(10000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 10}s] Stop button visible: ${stopVisible}`);
    await page.screenshot({ path: `C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_stream_${i * 10}s.png` });
    if (!stopVisible && i >= 2) {
      console.log('Generation completed streaming!');
      break;
    }
  }

  // Dump all text in chat
  const chatText = await page.locator('[role="region"]').last().innerText().catch(() => '');
  console.log('FINAL CHAT TEXT:\n', chatText);

} finally {
  await adapter.close();
}
