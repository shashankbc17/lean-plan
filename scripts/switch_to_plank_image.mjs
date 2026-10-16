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

  // Click on 'Model doing push-up plank'
  const plankTab = page.getByText(/Model doing push-up plank|Model performing push-up/i).first();
  console.log('Plank tab visible:', await plankTab.isVisible().catch(() => false));
  if (await plankTab.isVisible().catch(() => false)) {
    await plankTab.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plank_image_view.png' });
    console.log('Saved flow_plank_image_view.png');

    const buttons = await page.locator('button, [role="button"]').all();
    const labels = [];
    for (const b of buttons) {
      if (await b.isVisible().catch(() => false)) {
        const text = (await b.innerText().catch(() => '')) || (await b.getAttribute('aria-label').catch(() => ''));
        if (text) labels.push(text.trim());
      }
    }
    console.log('Available buttons on image view:', labels);
  }
} finally {
  await adapter.close();
}
