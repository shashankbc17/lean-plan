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

const IMAGE_PROMPT = "Create an image: Athletic fitness model in push-up plank, driving right knee forward to touch right elbow in perfect biomechanical form. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting, side 45-degree angle, high contrast, crisp edge definition, photorealistic 8k.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // 1. Open settings and select Veo 3.1 - Lite
  console.log('Opening settings to configure Veo 3.1 - Lite...');
  const tuneBtn = page.locator('button').filter({ hasText: /tune/i }).first();
  if (await tuneBtn.isVisible().catch(() => false)) {
    await tuneBtn.click();
    await page.waitForTimeout(1000);

    // Click on Video model dropdown
    const videoDropdown = page.getByText(/Omni 1\.1 Flash|Veo 3\.1/i).first();
    if (await videoDropdown.isVisible().catch(() => false)) {
      await videoDropdown.click();
      await page.waitForTimeout(800);
      const liteOption = page.getByText('Veo 3.1 - Lite', { exact: true }).first();
      if (await liteOption.isVisible().catch(() => false)) {
        await liteOption.click();
        console.log('Selected Veo 3.1 - Lite!');
      }
    }

    // Click Save in settings
    const saveBtn = page.getByRole('button', { name: /save/i }).first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
      console.log('Saved settings!');
      await page.waitForTimeout(1000);
    }
  }

  // 2. Type Image Prompt into Prompt box
  console.log('Typing image prompt for Plank Knee-to-Elbow...');
  const promptDiv = page.locator('div[aria-label="What do you want to create?"]').first();
  await promptDiv.click();
  await page.waitForTimeout(500);

  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(IMAGE_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 3. Click Submit arrow
  const submitBtn = page.locator('button').filter({ hasText: /arrow_forward/i }).first();
  await submitBtn.click();
  console.log('Prompt submitted! Waiting 15s for response...');

  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_image_prep.png' });
  console.log('Saved screenshot to scripts/flow_image_prep.png');

} finally {
  await adapter.close();
}
