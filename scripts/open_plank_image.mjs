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

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click on the first plank image tile (Img 2)
  const plankTile = page.locator('img[alt="Tile displaying a user\'s image"]').first();
  console.log('Plank tile visible:', await plankTile.isVisible());

  // Try double-clicking to open the image detail editor, or clicking
  await plankTile.dblclick();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plank_opened.png' });
  console.log('Saved flow_plank_opened.png');

  // Let's inspect visible buttons, inputs, text
  const interactive = await page.locator('button, [role="button"], textarea, input, [contenteditable="true"]').all();
  for (const el of interactive) {
    if (await el.isVisible().catch(() => false)) {
      const text = (await el.innerText().catch(() => '')) || (await el.getAttribute('aria-label').catch(() => '')) || (await el.getAttribute('placeholder').catch(() => ''));
      if (text && text.trim().length > 0) {
        console.log('Interactive element:', text.trim().replace(/\n/g, ' '));
      }
    }
  }
} finally {
  await adapter.close();
}
