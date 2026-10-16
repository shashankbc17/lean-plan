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
  console.log('Tune button visible:', await tuneBtn.isVisible().catch(() => false));
  if (await tuneBtn.isVisible().catch(() => false)) {
    await tuneBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_model_settings.png' });
    console.log('Saved model settings screenshot to scripts/flow_model_settings.png');

    const bodyText = await page.evaluate(() => {
      const menus = document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], div');
      const texts = [];
      menus.forEach(m => {
        if (m.innerText && (m.innerText.includes('Veo') || m.innerText.includes('Imagen') || m.innerText.includes('Model') || m.innerText.includes('credits'))) {
          texts.push(m.innerText);
        }
      });
      return texts.slice(0, 5);
    });
    console.log('Model text options:', bodyText);
  }
} finally {
  await adapter.close();
}
