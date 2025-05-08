// server.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// Middleware
app.use(express.json());

// Connessione a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connesso a MongoDB Atlas"))
  .catch((err) => console.error("Errore connessione MongoDB:", err));

// Rotta di test
app.get("/", (req, res) => {
  res.send("API attiva e funzionante!");
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
