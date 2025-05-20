// routes/productRoutes.js
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Esempio middleware autenticazione/ruolo (decommenta e personalizza se necessario)
// const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

/**
 * Middleware per la gestione degli errori di validazione
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @route GET /
 * @desc Ritorna tutti i prodotti
 * @access Pubblico
 */
router.get("/", getAllProducts);

/**
 * @route POST /
 * @desc Aggiunge un nuovo prodotto
 * @access Privato (decommenta autenticazione se necessario)
 */
router.post(
  "/",
  [
    // authenticateUser, // decommenta se vuoi autenticazione
    body("name").isString().withMessage("Il nome deve essere una stringa"),
    body("category").isString().withMessage("La categoria deve essere una stringa"),
    body("url").isString().withMessage("Url deve essere una stringa"),
    body("currentPrice").isNumeric().withMessage("Il prezzo deve essere un numero"),
    validateRequest
  ],
  addProduct
);

/**
 * @route GET /:id
 * @desc Ritorna un prodotto per ID
 * @access Pubblico
 */
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID non valido"),
    validateRequest
  ],
  getProductById
);

/**
 * @route PUT /:id
 * @desc Aggiorna un prodotto per ID
 * @access Privato (decommenta autenticazione se necessario)
 */
router.put(
  "/:id",
  [
    // authenticateUser, // decommenta se vuoi autenticazione
    param("id").isMongoId().withMessage("ID non valido"),
    body("name").optional().isString().withMessage("Il nome deve essere una stringa"),
    body("currentPrice").optional().isNumeric().withMessage("Il prezzo deve essere un numero"),
    validateRequest
  ],
  updateProduct
);

/**
 * @route DELETE /:id
 * @desc Elimina un prodotto per ID
 * @access Privato (decommenta autenticazione se necessario)
 */
router.delete(
  "/:id",
  [
    // authenticateUser, // decommenta se vuoi autenticazione
    param("id").isMongoId().withMessage("ID non valido"),
    validateRequest
  ],
  deleteProduct
);

module.exports = router;
