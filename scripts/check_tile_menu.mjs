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

  const tile = page.locator('img[alt="Tile displaying a user\'s image"]').first();
  await tile.hover();
  await page.waitForTimeout(1000);

  // Find all buttons over the tile
  const tileContainer = page.locator('div').filter({ has: tile }).first();
  const buttons = await tileContainer.locator('button, [role="button"]').all();
  for (const b of buttons) {
    if (await b.isVisible().catch(() => false)) {
      console.log('Button:', {
        text: (await b.innerText().catch(() => '')).trim(),
        ariaLabel: await b.getAttribute('aria-label').catch(() => null),
        title: await b.getAttribute('title').catch(() => null)
      });
    }
  }

  // Click the more_vert (3 dots) button
  const moreVert = tileContainer.locator('button').filter({ hasText: /more_vert/i }).first();
  if (await moreVert.isVisible()) {
    await moreVert.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_tile_more_menu.png' });
    console.log('Saved flow_tile_more_menu.png');

    const menuItems = await page.locator('.mat-mdc-menu-panel *').all();
    for (const item of menuItems) {
      if (await item.isVisible().catch(() => false)) {
        const text = (await item.innerText().catch(() => '')).trim();
        if (text) console.log('Tile menu item:', text);
      }
    }
  }

} finally {
  await adapter.close();
}
