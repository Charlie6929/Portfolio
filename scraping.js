const { chromium } = require('playwright');

/**
 * Esegue una ricerca prodotto su Temu e restituisce i dati del primo risultato.
 * @param {string} baseUrl - L'URL della homepage Temu (es: "https://www.temu.com/").
 * @param {string} searchQuery - La parola da cercare (es: "router").
 * @returns {Promise<{ name: string|null, currentPrice: number|null, productUrl: string|null, imageUrl: string|null }>}
 */
async function getProductData(baseUrl, searchQuery) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Vai sulla home page Temu
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // 1. Rifiuta i cookie
        try {
            await page.waitForSelector('button:has-text("Rifiuta tutti")', { timeout: 8000 });
            await page.click('button:has-text("Rifiuta tutti")');
        } catch (e) {
            // Se non trova il tasto, prosegui comunque
        }

        // 2. Scrivi nella searchbar e invia la ricerca
        await page.waitForSelector('#searchInput', { timeout: 8000 });
        await page.fill('#searchInput', searchQuery);
        await page.keyboard.press('Enter');

        // 3. Attendi che i risultati si carichino (adatta il selettore se necessario)
        await page.waitForSelector('h2._2BvQbnbN', { timeout: 10000 });

        // 4. Estrai i dati del primo prodotto
        const product = await page.$('a._2Tl9qLr1._1ak1dai3');
        let name = null, productUrl = null, imageUrl = null, currentPrice = null;

        if (product) {
            // Nome prodotto
            name = await product.$eval('h2._2BvQbnbN', el => el.textContent.trim());

            // Url prodotto (relativo -> assoluto)
            const href = await product.getAttribute('href');
            productUrl = href ? (href.startsWith('http') ? href : new URL(href, baseUrl).href) : null;

            // Immagine prodotto
            try {
                imageUrl = await product.$eval('img.goods-img-external', el => el.src);
            } catch (e) {
                imageUrl = null;
            }

            // Prezzo (unità e decimali)
            try {
                // Il prezzo è suddiviso in due span
                const priceContainer = await product.evaluateHandle(el => {
                    // va al genitore con data-type="price"
                    return el.parentElement.parentElement.querySelector('div[data-type="price"]');
                });
                if (priceContainer) {
                    const euro = await priceContainer.$eval('span._2de9ERAH', el => el.textContent.trim());
                    const cent = await priceContainer.$eval('span._3SrxhhHh', el => el.textContent.trim());
                    currentPrice = parseFloat(`${euro}.${cent}`);
                }
            } catch (e) {
                currentPrice = null;
            }
        }

        await browser.close();
        return { name, currentPrice, productUrl, imageUrl };
    } catch (err) {
        await browser.close();
        throw err;
    }
}

module.exports = { getProductData };
