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

const MOTION_PROMPT = "Animate this into a seamless looping video: the athletic model smoothly drives her right knee forward to touch her right elbow with locked core, then extends it back to push-up plank. Maintain exact lighting and cinematic gym studio setting, steady camera, fluid 60fps motion.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Click 'Add ingredients to the prompt box'
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1000);

  // 2. Click 'Add to prompt' directly
  const addBtn = page.getByText('Add to prompt').first();
  console.log('Add to prompt visible:', await addBtn.isVisible());
  await addBtn.click();
  await page.waitForTimeout(1500);

  // 3. Type the prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Click Submit
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  console.log('Submit button visible:', await submitBtn.isVisible());
  await submitBtn.click();
  console.log('Clicked submit! Waiting 15s for Flow plan...');

  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_motion_plan_response.png' });
  console.log('Saved flow_motion_plan_response.png');

  // Let's print any text in chat
  const chatMessages = await page.locator('[role="region"], .message, .response, [class*="chat"], [class*="session"]').all();
  for (const msg of chatMessages) {
    const text = (await msg.innerText().catch(() => '')).trim();
    if (text) console.log('Chat output snippet:', text.substring(0, 150).replace(/\n/g, ' '));
  }

} finally {
  await adapter.close();
}
