// controllers/productController.js
const Product = require("../models/product");
const { getScrapedData } = require("../scraping");
const Joi = require("joi");

/**
 * Schema di validazione per un prodotto
 */
const productSchema = Joi.object({
  name: Joi.string().required(),
  currentPrice: Joi.number().required(),
  category: Joi.string().required(),
});

/**
 * Funzione di utilità per la gestione uniforme degli errori
 */
const handleError = (res, error, defaultMessage = "Errore interno") => {
  if (error.name === "ValidationError") {
    res.status(400).json({ message: "Dati non validi", error });
  } else if (error.name === "CastError") {
    res.status(404).json({ message: "ID non valido", error });
  } else {
    res.status(500).json({ message: defaultMessage, error });
  }
};

/**
 * GET - Ottiene tutti i prodotti con paginazione
 */
exports.getAllProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments();
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    handleError(res, error, "Errore nel recupero prodotti");
  }
};

/**
 * POST - Aggiunge un nuovo prodotto (con scraping)
 */
exports.addProduct = async (req, res) => {
  const { url, category } = req.body;

  try {
    // Validazione di base su url e categoria
    if (!url || !category) {
      return res.status(400).json({ message: "URL e categoria sono obbligatori" });
    }
    const scraped = await getScrapedData(url);

    // Validazione dei dati ottenuti dallo scraping
    const { error } = productSchema.validate({
      name: scraped.name,
      currentPrice: scraped.currentPrice,
      category,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newProduct = new Product({
      name: scraped.name,
      currentPrice: scraped.currentPrice,
      category,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    handleError(res, error, "Errore durante l'aggiunta del prodotto");
  }
};

/**
 * GET - Recupera un singolo prodotto per ID
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(product);
  } catch (error) {
    handleError(res, error, "Errore nel recupero del prodotto");
  }
};

/**
 * PUT - Aggiorna un prodotto per ID
 */
exports.updateProduct = async (req, res) => {
  try {
    // Consentire solo aggiornamento di name, price e category
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.currentPrice) updateData.currenPrice = req.body.price;
    if (req.body.category) updateData.category = req.body.category;

    // Validazione dei dati aggiornati
    const { error } = productSchema.validate({ ...updateData, name: updateData.name || "a", currentPrice: updateData.currentPrice || 1, category: updateData.category || "a" }, { presence: "optional" });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(updated);
  } catch (error) {
    handleError(res, error, "Errore durante l'aggiornamento");
  }
};

/**
 * DELETE - Elimina un prodotto per ID
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    handleError(res, error, "Errore durante l'eliminazione");
  }
};

// controllers/productController.js
/*
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

// POST - Aggiunge un nuovo prodotto (con scraping)
exports.addProduct = async (req, res) => {
  const { url, category } = req.body;

  try {
    const scraped = await getScrapedData(url);

    const newProduct = new Product({
      name: scraped.name,
      price: scraped.price,
      category,
    });

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
