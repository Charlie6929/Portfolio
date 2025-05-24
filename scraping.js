const { firefox } = require('playwright');

/**
 * Estrae i dati di un prodotto da una pagina Temu.
 * @param {string} url - L'URL della pagina del prodotto Temu.
 * @returns {Promise<{ name: string|null, currentPrice: number|null, category: string|null, url: string }|null>}
 */
async function getScrapedData(url) {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // --- ESTRATTORE NOME PRODOTTO ---
    // Di solito il nome prodotto su Temu è in un <h1>
    const name = await page.$eval('h1', el => el.textContent.trim()).catch(() => null);

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

    return { name, currentPrice, category, url };
  } catch (error) {
    await browser.close();
    console.error("Errore nello scraping:", error.message);
    return null;
  }
}

module.exports = { getScrapedData };
/*
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Estrae i dati di un prodotto da una pagina Temu (o simile).
 * @param {string} url - L'URL della pagina del prodotto da cui estrarre i dati.
 * @returns {Promise<{ name: string, currentPrice: number, category: string }|null>}
 */
/*
async function getScrapedData(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const $ = cheerio.load(data);

    // NOTA: Temu e siti simili spesso caricano i dati via JavaScript.
    // Se serve scraping reale, valuta l'uso di strumenti come Puppeteer.
    // Qui un esempio statico:
    const name = "T-shirt";
    const category = "casual da uomo";

    // Tentativo di estrarre il prezzo da una classe generica (modifica secondo le tue esigenze)
    let currentPrice = null;
    const priceText = $('[class*=product-price], [class*=price]').first().text();
    if (priceText) {
      currentPrice = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
    } else {
      currentPrice = 6.86; // fallback di esempio
    }

    return { name, currentPrice, category, url };
  } catch (error) {
    console.error("Errore nello scraping:", error.message);
    return null;
  }
}

module.exports = { getScrapedData };
/*
const Product = require("./models/product");
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Effettua lo scraping di una pagina Temu e restituisce i dati del prodotto.
 * @param {string} url - L'URL della pagina Temu del prodotto.
 * @returns {Object} { name, currentPrice, category }
 */
/*
async function getScrapedData(url) {
  try {
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(data);

    // Esempio statico, dato che Temu carica i dati via JavaScript e non sono facilmente accessibili dall'HTML statico.
    // Modifica qui se vuoi fare scraping reale di altri siti con HTML semplice!
    const name = "Dlink";
    const category = "router wifi";

    // Tentativo di estrarre il prezzo (molto probabile che serva Puppeteer per Temu, qui fallback statico)
    let currentPrice = null;
    const priceText = $('[class*=product-price], [class*=price]').first().text();
    if (priceText) {
      currentPrice = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
    } else {
      currentPrice = 37.35; // valore di esempio
    }

    return { name, currentPrice, category };
  } catch (error) {
    console.error('Errore nello scraping:', error.message);
    return null;
  }
}

/**
 * Ottiene tutti i prodotti.
 * @route GET /products
 * @returns {Array} Lista di prodotti
 */
/*
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Errore nel recupero prodotti:", error);
    res.status(500).json({ message: "Errore nel recupero prodotti", error: error.message });
  }
};

/**
 * Aggiunge un nuovo prodotto, tramite scraping o manualmente.
 * @route POST /products
 * @param {string} url - (opzionale) URL da cui effettuare scraping
 * @param {string} name - (opzionale) Nome prodotto (richiesto se non c'è url)
 * @param {number} currentPrice - (opzionale) Prezzo prodotto (richiesto se non c'è url)
 * @param {string} category - Categoria prodotto
 * @returns {Object} Prodotto creato
 */
/*
exports.addProduct = async (req, res) => {
  const { url, category, name, currentPrice } = req.body;

  if (!category) {
    return res.status(400).json({ message: "La categoria è obbligatoria." });
  }

  try {
    let productData;

    if (url) {
      const scraped = await getScrapedData(url);
      if (!scraped || !scraped.name || !scraped.currentPrice) {
        return res.status(422).json({ message: "Lo scraping non ha restituito dati validi." });
      }
      productData = {
        name: scraped.name,
        currentPrice: scraped.currentPrice,
        category,
      };
    } else if (name && currentPrice) {
      productData = { name, currentPrice, category };
    } else {
      return res.status(400).json({
        message: "Fornire una URL valida per lo scraping o almeno name e currentPrice manualmente.",
      });
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Errore durante l'aggiunta del prodotto:", error);
    res.status(500).json({ message: "Errore durante l'aggiunta del prodotto", error: error.message });
  }
};

/**
 * Recupera un prodotto tramite ID.
 * @route GET /products/:id
 * @returns {Object} Prodotto trovato
 */
/*
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(product);
  } catch (error) {
    console.error("Errore nel recupero del prodotto:", error);
    res.status(500).json({ message: "Errore nel recupero del prodotto", error: error.message });
  }
};

/**
 * Aggiorna un prodotto tramite ID.
 * @route PUT /products/:id
 * @returns {Object} Prodotto aggiornato
 */
/*
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(updated);
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    res.status(500).json({ message: "Errore durante l'aggiornamento", error: error.message });
  }
};

/**
 * Elimina un prodotto tramite ID.
 * @route DELETE /products/:id
 * @returns {Object} Messaggio di successo
 */
/*
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    console.error("Errore durante l'eliminazione:", error);
    res.status(500).json({ message: "Errore durante l'eliminazione", error: error.message });
  }
};

// Esporta anche la funzione di scraping
module.exports.getScrapedData = getScrapedData;
/*
const Product = require("./models/product");
/*const { getScrapedData } = require("./scraping");

/**
 * Ottiene tutti i prodotti.
 * @route GET /products
 * @returns {Array} Lista di prodotti
 */
/*
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Errore nel recupero prodotti:", error);
    res.status(500).json({ message: "Errore nel recupero prodotti", error: error.message });
  }
};

/**
 * Aggiunge un nuovo prodotto, tramite scraping o manualmente.
 * @route POST /products
 * @param {string} url - (opzionale) URL da cui effettuare scraping
 * @param {string} name - (opzionale) Nome prodotto (richiesto se non c'è url)
 * @param {number} currentPrice - (opzionale) Prezzo prodotto (richiesto se non c'è url)
 * @param {string} category - Categoria prodotto
 * @returns {Object} Prodotto creato
 */
/*
exports.addProduct = async (req, res) => {
  const { url, category, name, currentPrice } = req.body;

  if (!category) {
    return res.status(400).json({ message: "La categoria è obbligatoria." });
  }

  try {
    let productData;

    if (url) {
      const scraped = await getScrapedData(url);
      if (!scraped || !scraped.name || !scraped.currentPrice) {
        return res.status(422).json({ message: "Lo scraping non ha restituito dati validi." });
      }
      productData = {
        name: scraped.name,
        currentPrice: scraped.currentPrice,
        category,
      };
    } else if (name && currentPrice) {
      productData = { name, currentPrice, category };
    } else {
      return res.status(400).json({
        message: "Fornire una URL valida per lo scraping o almeno name e currentPrice manualmente.",
      });
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Errore durante l'aggiunta del prodotto:", error);
    res.status(500).json({ message: "Errore durante l'aggiunta del prodotto", error: error.message });
  }
};

/**
 * Recupera un prodotto tramite ID.
 * @route GET /products/:id
 * @returns {Object} Prodotto trovato
 */
/*
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(product);
  } catch (error) {
    console.error("Errore nel recupero del prodotto:", error);
    res.status(500).json({ message: "Errore nel recupero del prodotto", error: error.message });
  }
};

/**
 * Aggiorna un prodotto tramite ID.
 * @route PUT /products/:id
 * @returns {Object} Prodotto aggiornato
 */
/*
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(updated);
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    res.status(500).json({ message: "Errore durante l'aggiornamento", error: error.message });
  }
};

/**
 * Elimina un prodotto tramite ID.
 * @route DELETE /products/:id
 * @returns {Object} Messaggio di successo
 */
/*
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    console.error("Errore durante l'eliminazione:", error);
    res.status(500).json({ message: "Errore durante l'eliminazione", error: error.message });
  }
}
module.exports = { getScrapedData };
*/
