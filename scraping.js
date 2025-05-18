/*
// controllers/productController.js
const Product = require("../models/product");
const { getScrapedData } = require("../scraping");

// GET - Ottiene tutti i prodotti
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero prodotti", error });
  }
};

// POST - Aggiunge un nuovo prodotto (con scraping o manuale)
exports.addProduct = async (req, res) => {
  const { url, category, name, price } = req.body;

  try {
    let productData;

    if (url) {
      const scraped = await getScrapedData(url);
      productData = {
        name: scraped.name,
        price: scraped.price,
        category,
      };
    } else if (name && price) {
      productData = { name, price, category };
    } else {
      return res.status(400).json({
        message: "Fornire una URL valida per lo scraping o almeno name e price manualmente.",
      });
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'aggiunta del prodotto", error });
  }
};

// GET - Recupera un singolo prodotto per ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero del prodotto", error });
  }
};

// PUT - Aggiorna un prodotto per ID
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'aggiornamento", error });
  }
};

// DELETE - Elimina un prodotto per ID
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'eliminazione", error });
  }
};
*/
/**
 * Controller per la gestione dei prodotti.
 * Fornisce endpoint CRUD e supporto allo scraping.
 */

const Product = require("../models/product");
const { getScrapedData } = require("../scraping");

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
 * @param {number} price - (opzionale) Prezzo prodotto (richiesto se non c'è url)
 * @param {string} category - Categoria prodotto
 * @returns {Object} Prodotto creato
 */
exports.addProduct = async (req, res) => {
  const { url, category, name, price } = req.body;

  if (!category) {
    return res.status(400).json({ message: "La categoria è obbligatoria." });
  }

  try {
    let productData;

    if (url) {
      const scraped = await getScrapedData(url);
      if (!scraped || !scraped.name || !scraped.price) {
        return res.status(422).json({ message: "Lo scraping non ha restituito dati validi." });
      }
      productData = {
        name: scraped.name,
        price: scraped.price,
        category,
      };
    } else if (name && price) {
      productData = { name, price, category };
    } else {
      return res.status(400).json({
        message: "Fornire una URL valida per lo scraping o almeno name e price manualmente.",
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
