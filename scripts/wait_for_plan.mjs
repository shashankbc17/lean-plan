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
  console.log('Waiting 15s for Flow plan to complete...');
  await page.waitForTimeout(15000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_motion_plan_done.png' });
  console.log('Saved flow_motion_plan_done.png');

  // Let's print all text in the chat sidebar
  const lastMessages = await page.locator('div[class*="chat"], div[class*="message"], div[class*="response"], [role="log"]').all();
  for (const m of lastMessages) {
    const text = (await m.innerText().catch(() => '')).trim();
    if (text) console.log('Chat message:', text.replace(/\n/g, ' '));
  }

} finally {
  await adapter.close();
}
