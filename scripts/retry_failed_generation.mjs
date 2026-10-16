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

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log('BROWSER LOG:', msg.type(), msg.text().substring(0, 150));
    }
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log('HTTP ERROR:', resp.status(), resp.url().substring(0, 100));
    }
  });

  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Look for any retry button or click the Approve button again
  const approveBtn = page.getByRole('button', { name: /^approve$/i }).last();
  console.log('Approve button visible:', await approveBtn.isVisible().catch(() => false));
  if (await approveBtn.isVisible().catch(() => false)) {
    console.log('Clicking approve...');
    await approveBtn.click();
    await page.waitForTimeout(8000);
  }

  // Look for retry button on the failed tile
  const refreshBtn = page.locator('button').filter({ hasText: /refresh|redo|retry/i }).all();
  console.log('Refresh/retry buttons found:', (await refreshBtn).length);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_after_retry.png' });
  console.log('Saved flow_after_retry.png');

} finally {
  await adapter.close();
}
