const { chromium } = require('playwright');

/**
 * Estrae i dati di un prodotto da una pagina Temu.
 * @param {string} url - L'URL della pagina del prodotto Temu.
 * @returns {Promise<{ name: string|null, currentPrice: number|null, category: string|null, url: string }|null>}
 */
async function getScrapedData(url) {
  const fs = require('fs');
  console.log('Contenuto node_modules/playwright-core/.local-browsers:', fs.readdirSync('./node_modules/playwright-core/.local-browsers'));
  console.log('Contenuto ms-playwright:', fs.readdirSync('/opt/render/.cache/ms-playwright'));
  console.log('Contenuto chromium_headless_shell-1169:', fs.readdirSync('/opt/render/.cache/ms-playwright/chromium_headless_shell-1169'));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // --- ESTRATTORE NOME PRODOTTO ---
    // Di solito il nome prodotto su Temu è in un <h1>
    const name = await page.$eval('#searchInput', el => el.value.trim()).catch(() => null);
    /* const name = await page.$eval('h1', el => el.textContent.trim()).catch(() => null); */

    // --- ESTRATTORE PREZZO ---
    // Cerca una classe che contiene il prezzo (aggiorna se necessario)
    let currentPrice = null;
    const priceText = await page.$eval('[class*=price]', el => el.textContent).catch(() => null);
    if (priceText) {
      currentPrice = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
    }

    // --- ESTRATTORE CATEGORIA ---
    // Su Temu la categoria spesso è in un breadcrumb
    const category = await page.$eval('nav[aria-label*=Breadcrumb] li:last-child', el => el.textContent.trim()).catch(() => null);

    await browser.close();

    console.log({ name, currentPrice, category, url });
    return { name, currentPrice, category, url };
  } catch (error) {
    await browser.close();
    console.error("Errore nello scraping:", error.message);
    return null;
  }
}

module.exports = { getScrapedData };
