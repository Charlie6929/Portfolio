// controllers/productController.js
const Product = require("../models/product");
const { getScrapedData } = require("../scraping");

// Ottiene tutti i prodotti dal database
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero prodotti", error });
  }
};

// Aggiunge un nuovo prodotto, eventualmente con dati da scraping
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
