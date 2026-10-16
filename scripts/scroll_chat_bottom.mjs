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

  // Click on 'Athletic Fitness Workout Exercises'
  const sessionItem = page.getByText('Athletic Fitness Workout Exercises').first();
  if (await sessionItem.isVisible().catch(() => false)) {
    await sessionItem.click();
    await page.waitForTimeout(2000);
  }

  // Scroll the chat panel to the bottom
  const chatScroller = page.locator('.chat-messages, [role="log"], .session-container, .messages-list').first();
  if (await chatScroller.isVisible().catch(() => false)) {
    await chatScroller.evaluate(el => el.scrollTop = el.scrollHeight);
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_chat_scrolled_bottom.png' });
  console.log('Saved flow_chat_scrolled_bottom.png');

} finally {
  await adapter.close();
}
