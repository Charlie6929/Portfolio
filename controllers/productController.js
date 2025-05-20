const Product = require("../models/product");
const { getScrapedData } = require("../scraping");
const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  url: Joi.string().required(),
  currentPrice: Joi.number().required(),
});

const handleError = (res, error, msg = "Errore interno") => {
  res.status(500).json({ message: msg, error: error.message });
};

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
 * POST - Aggiunge prodotti da scraping Temu per qualsiasi keyword
 */
exports.addProduct = async (req, res) => {
  const { url: keyword, category } = req.body;
  if (!keyword || !category) {
    return res.status(400).json({ message: "url (parola chiave) e category sono obbligatori" });
  }

  try {
    // Ottieni array di prodotti dalla ricerca
    const products = await getScrapedData(keyword);

    if (!products.length) {
      return res.status(404).json({ message: "Nessun prodotto trovato per la ricerca" });
    }

    // Validazione dati e salvataggio
    const saved = [];
    for (const prod of products) {
      const productData = { ...prod, category }; // category = quella inserita dall'utente
      const { error } = productSchema.validate(productData);
      if (!error) {
        const newProduct = new Product(productData);
        await newProduct.save();
        saved.push(newProduct);
      }
    }

    res.status(201).json(saved);
  } catch (error) {
    handleError(res, error, "Errore durante l'aggiunta dei prodotti");
  }
};

// ... (le altre funzioni restano invariate)
/*
// controllers/productController.js
const Product = require("../models/product");
const { getScrapedData } = require("../scraping");
const Joi = require("joi");

/**
 * Schema di validazione per un prodotto
 */
/*
const productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  url: Joi.string().required(),
  currentPrice: Joi.number().required(),
});

/**
 * Funzione di utilità per la gestione uniforme degli errori
 */
/*
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
/*
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
/*
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
      category: scraped.category,
      url: scraped.url,
      currentPrice: scraped.currentPrice,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newProduct = new Product({
      name: scraped.name,
      category: scraped.category,
      url: scraped.url,
      currentPrice: scraped.currentPrice,
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
/*
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
/*
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
/*
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    handleError(res, error, "Errore durante l'eliminazione");
  }
};
*/
