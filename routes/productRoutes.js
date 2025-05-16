// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// GET tutti i prodotti
router.get("/", getAllProducts);

// POST un nuovo prodotto
router.post("/", addProduct);

// GET un prodotto specifico per ID
router.get("/:id", getProductById);

// PUT aggiornare un prodotto per ID
router.put("/:id", updateProduct);

// DELETE rimuovere un prodotto per ID
router.delete("/:id", deleteProduct);

module.exports = router;
