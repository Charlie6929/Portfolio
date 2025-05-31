const { chromium } = require('playwright');

async function getProductData(baseUrl, searchQuery) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Rifiuta i cookie
        try {
            await page.waitForSelector('button:has-text("Rifiuta tutti")', { timeout: 8000 });
            await page.click('button:has-text("Rifiuta tutti")');
        } catch (e) {}

        // Scrivi nella searchbar e invia la ricerca
        await page.waitForSelector('#searchInput', { timeout: 8000 });
        await page.fill('#searchInput', searchQuery);
        await page.keyboard.press('Enter');

        // Attendi che i prodotti siano caricati
        await page.waitForSelector('a._2Tl9qLr1._1ak1dai3', { timeout: 10000 });

        // Clicca sul primo prodotto
        const firstProduct = (await page.$$('a._2Tl9qLr1._1ak1dai3'))[0];
        if (!firstProduct) throw new Error("Nessun prodotto trovato!");
        await firstProduct.click();

        // Attendi pagina dettaglio
        await page.waitForSelector('._25g_jM0z', { timeout: 10000 });

        // Estrai dati
        let name = null, currentPrice = null;
        try {
            name = await page.$eval('._25g_jM0z', el => el.textContent.trim());
        } catch (e) {}

        try {
            const priceText = await page.$eval('._1vkz0rqG > span:nth-child(2)', el => el.textContent.replace(/[^\d,\.]/g, '').replace(',', '.'));
            currentPrice = parseFloat(priceText);
        } catch (e) {}

        const category = searchQuery;
        const url = page.url();

        await browser.close();
        // console.log richiesto
        console.log({ name, currentPrice, category, url });
        return { name, currentPrice, url, category };
    } catch (err) {
        await browser.close();
        throw err;
    }
}

module.exports = { getProductData };
