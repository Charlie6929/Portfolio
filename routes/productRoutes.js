// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET tutti i prodotti
router.get("/", productController.getAllProducts);

// POST un nuovo prodotto
router.post("/", productController.createProduct);

// GET un prodotto specifico per ID
router.get("/:id", productController.getProductById);

// PUT aggiornare un prodotto per ID
router.put("/:id", productController.updateProduct);

// DELETE rimuovere un prodotto per ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
