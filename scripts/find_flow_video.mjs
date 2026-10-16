import { pathToFileURL } from 'url';
import fs from 'fs';

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
  await page.waitForTimeout(5000);

  // Take full screenshot to see what's loaded
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_media_page.png' });
  console.log('Saved flow_media_page.png');

  // Find all links and media elements
  const links = await page.locator('a').all();
  console.log(`Found ${links.length} links`);
  for (const l of links) {
    const href = await l.getAttribute('href');
    if (href && (href.includes('media') || href.includes('video') || href.includes('edit'))) {
      console.log('Media link:', href);
    }
  }

  // Look inside session chat panel (right panel) for the video card
  const chatVideos = await page.locator('[role="main"], div').all();
  console.log('Inspecting images and videos...');
  const imgs = await page.locator('img').all();
  for (const img of imgs) {
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    if (src && !src.includes('avatar') && !src.includes('googleusercontent.com/a/')) {
      console.log('Image:', alt, src.slice(0, 80));
    }
  }

} finally {
  await adapter.close();
}
