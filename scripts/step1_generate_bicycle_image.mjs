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

const IMAGE_PROMPT = "Create an image: Athletic fitness model performing bicycle crunches on a gym mat, right elbow rotating across to touch lifted left knee, opposite leg extended straight out with tempo hold, perfect biomechanical form. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting, side 45-degree angle, high contrast, crisp edge definition, photorealistic 8k.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Focus prompt box
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(IMAGE_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  await submitBtn.click();
  console.log('Submitted Bicycle Crunches image prompt! Waiting 20s for image generation...');

  // Wait for image generation to complete
  for (let i = 1; i <= 3; i++) {
    await page.waitForTimeout(8000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 8}s] Generation active: ${stopVisible}`);
    if (!stopVisible && i >= 2) break;
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_bicycle_image_generated.png' });
  console.log('Saved flow_bicycle_image_generated.png');

} finally {
  await adapter.close();
}
