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

  // 1. Open settings
  const tuneBtn = page.locator('button').filter({ hasText: /tune/i }).first();
  if (await tuneBtn.isVisible().catch(() => false)) {
    await tuneBtn.click();
    await page.waitForTimeout(1000);

    // Switch video model to Omni 1.1 Flash
    const videoDropdown = page.getByText(/Veo 3\.1 - Lite|Omni 1\.1/i).first();
    if (await videoDropdown.isVisible().catch(() => false)) {
      await videoDropdown.click();
      await page.waitForTimeout(800);
      const omniOption = page.getByText('Omni 1.1 Flash', { exact: true }).first();
      if (await omniOption.isVisible().catch(() => false)) {
        await omniOption.click();
        console.log('Selected Omni 1.1 Flash!');
      }
    }

    const saveBtn = page.getByRole('button', { name: /save/i }).first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
      console.log('Saved settings!');
    }
  }

  // 2. Add ingredient 'Model doing push-up plank'
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1000);

  const addBtn = page.getByText('Add to prompt').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // 3. Type prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type("Animate this image into a seamless looping video with Omni 1.1 Flash: athletic model smoothly driving right knee to right elbow and returning to push-up plank, 60fps.", { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  await submitBtn.click();
  console.log('Submitted prompt to Omni 1.1 Flash! Waiting for plan...');

  // Poll until Stop button is gone
  for (let i = 1; i <= 5; i++) {
    await page.waitForTimeout(10000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 10}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 2) break;
  }

  // Scroll to bottom and take screenshot
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const a of all) {
      if (a.scrollHeight > a.clientHeight && a.clientHeight > 300) a.scrollTop = a.scrollHeight;
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_omni_plan.png' });
  console.log('Saved flow_omni_plan.png');

} finally {
  await adapter.close();
}
