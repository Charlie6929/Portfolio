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

// POST - Aggiunge un nuovo prodotto (con scraping)
exports.createProduct = async (req, res) => {
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
