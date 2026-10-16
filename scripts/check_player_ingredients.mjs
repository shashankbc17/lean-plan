import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkPlayerIngredients() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const items = await page.locator('flow-media-tile, flow-grid-tile-container').all();
  await items[0].dblclick({ force: true });
  await page.waitForTimeout(2000);

  const ingredients = await page.evaluate(() => {
    const list = [...document.querySelectorAll('img')].map(img => ({
      alt: img.getAttribute('alt') || '',
      src: (img.getAttribute('src') || '').slice(0, 60)
    })).filter(x => x.alt);
    return list;
  });

  console.log('Images/Chips in player:', ingredients);
  await page.keyboard.press('Escape');
  await browser.close();
}

checkPlayerIngredients();
