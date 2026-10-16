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

  // Scroll chat to the absolute bottom
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('*');
    for (const s of scrollers) {
      if (s.scrollHeight > s.clientHeight && s.clientHeight > 200) {
        s.scrollTop = s.scrollHeight;
      }
    }
  });
  await page.waitForTimeout(1000);

  const approveRadios = page.locator('div[role="radio"][aria-label="Approve"]');
  const count = await approveRadios.count();
  console.log(`Found ${count} Approve radio options`);

  if (count > 0) {
    const lastApprove = approveRadios.last();
    console.log('Clicking the last Approve radio option...');
    await lastApprove.click({ force: true });
    await page.waitForTimeout(2000);

    // Also look for any 'Approve' submit button that confirms the radio selection
    const confirmBtn = page.getByRole('button', { name: /^approve$/i }).last();
    if (await confirmBtn.isVisible().catch(() => false)) {
      console.log('Clicking confirmation button...');
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plank_approved_rendering.png' });
    console.log('Saved flow_plank_approved_rendering.png');
  }

} finally {
  await adapter.close();
}
