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
  // Click the submit arrow button (it was already typed and ready in the previous step)
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  console.log('Submit button visible:', await submitBtn.isVisible());
  if (await submitBtn.isVisible()) {
    await submitBtn.click();
    console.log('Submit button clicked! Waiting 10s for Flow response...');
    await page.waitForTimeout(10000);

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_after_submit_plan.png' });
    console.log('Saved flow_after_submit_plan.png');
  } else {
    console.log('Submit button not visible on current screen');
  }

} finally {
  await adapter.close();
}
