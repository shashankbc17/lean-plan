import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkIngredientChip() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const items = await page.locator('flow-media-tile, flow-grid-tile-container').all();
  await items[0].dblclick({ force: true });
  await page.waitForTimeout(2000);

  const chipInfo = await page.evaluate(() => {
    // Look at the prompt area inside the player history
    const chips = [...document.querySelectorAll('img')].map(img => ({
      src: img.src,
      alt: img.alt,
      parentClass: img.parentElement ? img.parentElement.className : ''
    }));
    return chips;
  });

  console.log('Player images details:', chipInfo.slice(-5));
  await page.screenshot({ path: 'scripts/female_climbers_player_view.png' });
  await page.keyboard.press('Escape');
  await browser.close();
}

checkIngredientChip();
