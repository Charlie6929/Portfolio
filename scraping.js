const Product = require("./models/product");
/*const { getScrapedData } = require("./scraping");

/**
 * Ottiene tutti i prodotti.
 * @route GET /products
 * @returns {Array} Lista di prodotti
 */
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
