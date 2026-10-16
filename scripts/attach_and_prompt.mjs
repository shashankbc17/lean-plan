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

  // 2. Select 'Model doing push-up plank'
  const plankItem = page.locator('.cdk-overlay-container').getByText(/Model doing push-up plank/i).first();
  await plankItem.click();
  await page.waitForTimeout(500);

  // 3. Click 'Add to prompt'
  const addToPromptBtn = page.locator('.cdk-overlay-container').getByRole('button', { name: /Add to prompt/i }).first();
  await addToPromptBtn.click();
  await page.waitForTimeout(1000);

  // 4. Type the prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_prompt_with_ingredient.png' });
  console.log('Saved flow_prompt_with_ingredient.png');

  // Check any credit text
  const creditTexts = await page.getByText(/credit/i).all();
  for (const c of creditTexts) {
    if (await c.isVisible().catch(() => false)) {
      console.log('Credit info visible:', (await c.innerText().catch(() => '')).trim());
    }
  }

} finally {
  await adapter.close();
}
