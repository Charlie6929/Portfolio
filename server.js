// server.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// Importa le rotte dei prodotti
const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(express.json());

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connesso a MongoDB Atlas"))
  .catch((err) => console.error("Errore connessione MongoDB:", err));

// Rotta base
app.get("/", (req, res) => {
  res.send("API attiva e funzionante!");
});

// Usa le rotte dei prodotti
app.use("/api/products", productRoutes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
