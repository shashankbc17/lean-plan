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

const MOTION_PROMPT = "Animate this image into a seamless looping video: the athletic model smoothly drives her right knee forward to touch her right elbow with locked core, then extends it back to push-up plank. Maintain exact lighting and cinematic gym studio setting, steady camera, fluid 60fps motion.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Look for the '+' button in the main chat prompt area (bottom right)
  const plusBtn = page.locator('button').filter({ hasText: /^add$/i }).last();
  console.log('Main plus button visible:', await plusBtn.isVisible());
  if (await plusBtn.isVisible()) {
    await plusBtn.click();
    await page.waitForTimeout(1500);

    // Click on 'Model doing push-up plank' in the asset picker
    const plankAsset = page.getByText(/Model doing push-up plank/i).first();
    console.log('Plank asset visible in picker:', await plankAsset.isVisible().catch(() => false));
    if (await plankAsset.isVisible().catch(() => false)) {
      await plankAsset.click();
      await page.waitForTimeout(800);

      // Click 'Add to prompt'
      const addBtn = page.getByRole('button', { name: /Add to prompt/i }).first();
      console.log('Add to prompt button visible:', await addBtn.isVisible().catch(() => false));
      if (await addBtn.isVisible().catch(() => false)) {
        await addBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // 2. Type the motion prompt
  const promptInput = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptInput.click();
  await page.waitForTimeout(500);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // Take screenshot before submitting
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_i2v_ready.png' });
  console.log('Saved flow_i2v_ready.png');

} finally {
  await adapter.close();
}
