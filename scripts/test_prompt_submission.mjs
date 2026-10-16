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

const PROMPT = "High Knees Sprint: Cinematic high-definition 1080p 60fps video of an athletic fitness model performing high knees in continuous perfect biomechanical form. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting. Seamless looping movement, high contrast, crisp edge definition, centered in frame, front angle.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const promptDiv = page.locator('div[aria-label="What do you want to create?"]').first();
  console.log('Focusing prompt div...');
  await promptDiv.click();
  await page.waitForTimeout(500);

  console.log('Typing prompt...');
  await page.keyboard.type(PROMPT, { delay: 15 });
  await page.waitForTimeout(1000);

  // Check submit button state
  const submitBtn = page.locator('button').filter({ hasText: /arrow_forward/i }).first();
  const isEnabled = await submitBtn.isEnabled().catch(() => false);
  const isVisible = await submitBtn.isVisible().catch(() => false);
  console.log('Submit button (arrow_forward) visible:', isVisible, 'enabled:', isEnabled);

  // Take screenshot of prompt area for verification
  const screenshotPath = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_prompt_ready.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);
} finally {
  await adapter.close();
}
