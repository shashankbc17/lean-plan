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

  // Click 'Open session history'
  const sessionHistoryBtn = page.locator('button[aria-label="Open session history"]').first();
  if (await sessionHistoryBtn.isVisible()) {
    await sessionHistoryBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_sessions.png' });
    console.log('Saved flow_sessions.png');

    const sessions = await page.locator('.cdk-overlay-container button, .cdk-overlay-container [role="menuitem"], .session-item').all();
    for (const s of sessions) {
      const text = (await s.innerText().catch(() => '')).trim();
      if (text) console.log('Session item:', text.replace(/\n/g, ' '));
    }
  }

} finally {
  await adapter.close();
}
