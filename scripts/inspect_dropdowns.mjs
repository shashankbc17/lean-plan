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

  const tuneBtn = page.locator('button').filter({ hasText: /tune/i }).first();
  await tuneBtn.click();
  await page.waitForTimeout(1000);

  // Click on the Video model dropdown
  const videoDropdown = page.getByText('Omni 1.1 Flash').first();
  if (await videoDropdown.isVisible().catch(() => false)) {
    await videoDropdown.click();
    await page.waitForTimeout(1000);
    const options = await page.locator('[role="option"], [role="menuitem"], li').allInnerTexts().catch(() => []);
    console.log('Available video models:', options);
  }

  // Also check image model dropdown
  const imgDropdown = page.getByText('Nano Banana 2.1').first();
  if (await imgDropdown.isVisible().catch(() => false)) {
    await imgDropdown.click();
    await page.waitForTimeout(1000);
    const imgOptions = await page.locator('[role="option"], [role="menuitem"], li').allInnerTexts().catch(() => []);
    console.log('Available image models:', imgOptions);
  }
} finally {
  await adapter.close();
}
