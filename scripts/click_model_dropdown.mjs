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

  // Click on the first plank image tile
  const plankTile = page.locator('img[alt="Tile displaying a user\'s image"]').first();
  await plankTile.dblclick();
  await page.waitForTimeout(2000);

  // Click on the Nano Banana 2.1 pill button at the bottom
  const modelBtn = page.getByText(/Nano Banana 2\.1/i).first();
  await modelBtn.click();
  await page.waitForTimeout(1000);

  // Now click the dropdown inside the popup that shows Nano Banana 2.1 with arrow
  const dropdownTrigger = page.locator('div, button').filter({ hasText: /^🍌 Nano Banana 2\.1/ }).last();
  console.log('Dropdown trigger visible:', await dropdownTrigger.isVisible());
  await dropdownTrigger.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_dropdown_opened.png' });
  console.log('Saved flow_dropdown_opened.png');

  // Print all elements that appeared
  const allTexts = await page.locator('body *').all();
  const options = [];
  for (const el of allTexts) {
    if (await el.isVisible().catch(() => false)) {
      const text = (await el.innerText().catch(() => '')).trim();
      if (text && (text.includes('Veo') || text.includes('Banana') || text.includes('Motion') || text.includes('Imagen') || text.includes('Flash'))) {
        options.push(text.replace(/\n/g, ' '));
      }
    }
  }
  console.log('Detected model options:', Array.from(new Set(options)));
} finally {
  await adapter.close();
}
