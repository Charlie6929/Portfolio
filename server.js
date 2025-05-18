// server.js migliorato

require("dotenv").config(); // Carica le variabili d'ambiente il prima possibile
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet"); // Sicurezza HTTP
const morgan = require("morgan"); // Log richieste HTTP
const cors = require("cors"); // Abilita CORS in modo controllato

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware di sicurezza e utilità
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  optionsSuccessStatus: 200,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" })); // Limita la dimensione del payload JSON

// Importa le rotte dei prodotti
const productRoutes = require("./routes/productRoutes");

// Connessione robusta a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Migliore gestione timeout
  })
  .then(() => console.log("Connesso a MongoDB Atlas"))
  .catch((err) => {
    console.error("Errore connessione MongoDB:", err);
    process.exit(1); // Esce in caso di errore critico
  });

// Rotta base
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API attiva e funzionante!" });
});

// Usa le rotte dei prodotti
app.use("/api/products", productRoutes);

// Gestione errori generici
app.use((err, req, res, next) => {
  console.error("Errore non gestito:", err);
  res.status(500).json({ error: "Errore interno del server" });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
/*
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
*/
