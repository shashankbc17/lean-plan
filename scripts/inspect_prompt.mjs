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
  await page.waitForTimeout(3000);

  const inputs = await page.locator('textarea, input, [contenteditable="true"]').all();
  for (let i = 0; i < inputs.length; i++) {
    const el = inputs[i];
    const tag = await el.evaluate(e => e.tagName);
    const placeholder = await el.getAttribute('placeholder').catch(() => '');
    const aria = await el.getAttribute('aria-label').catch(() => '');
    const visible = await el.isVisible().catch(() => false);
    console.log(`Input ${i}: ${tag} | visible: ${visible} | placeholder: "${placeholder}" | aria: "${aria}"`);
  }
} finally {
  await adapter.close();
}
