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

const PROMPT = "Plank Knee Drives: 60fps video of an athlete performing plank knee-to-elbow drives in continuous biomechanical form. Dark minimalist gym studio with vibrant rim lighting. Seamless looping movement, high contrast, centered in frame.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const promptDiv = page.locator('div[aria-label="What do you want to create?"]').first();
  await promptDiv.click();
  await page.waitForTimeout(500);

  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  const submitBtn = page.locator('button').filter({ hasText: /arrow_forward/i }).first();
  await submitBtn.click();
  console.log('Submitted Plank prompt! Waiting for credit confirmation response...');

  await page.waitForTimeout(12000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_veo_lite_check.png' });
  console.log('Saved screenshot to scripts/flow_veo_lite_check.png');
} finally {
  await adapter.close();
}
