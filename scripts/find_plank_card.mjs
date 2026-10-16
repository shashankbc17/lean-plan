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

  // Find scrollable chat container and scroll it
  await page.evaluate(() => {
    const el = document.querySelector('[role="region"]') || document.querySelector('.chat-history') || document.querySelector('.mat-drawer-content');
    const all = document.querySelectorAll('*');
    for (const a of all) {
      if (a.scrollHeight > a.clientHeight && a.clientHeight > 300) {
        a.scrollTop = a.scrollHeight;
      }
    }
  });
  await page.waitForTimeout(1000);

  // Take screenshot after scrolling
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_scrolled_to_plank.png' });
  console.log('Saved flow_scrolled_to_plank.png');

  // Find all elements containing '10 credits'
  const tenCredits = page.getByText(/10 credits/i).first();
  console.log('10 credits card visible:', await tenCredits.isVisible().catch(() => false));

} finally {
  await adapter.close();
}
