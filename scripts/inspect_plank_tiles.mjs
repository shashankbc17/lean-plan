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

  // Find images
  const images = await page.locator('img').all();
  console.log('Total img elements:', images.length);
  for (let i = 0; i < images.length; i++) {
    const src = await images[i].getAttribute('src');
    const alt = await images[i].getAttribute('alt');
    const box = await images[i].boundingBox();
    console.log(`Img ${i}: alt="${alt}" box=${JSON.stringify(box)} src=${src?.substring(0, 60)}`);
  }

  // Also check elements on canvas
  const canvasElements = await page.locator('[data-entity-id], [role="button"], button').all();
  console.log('Canvas clickable items:', canvasElements.length);
} finally {
  await adapter.close();
}
