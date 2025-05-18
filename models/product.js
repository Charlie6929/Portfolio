
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: { // Link del prodotto Amazon
    type: String,
    required: true,
    trim: true
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  desiredPrice: { // Prezzo target per l'alert
    type: Number,
    min: 0
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  inStock: {
    type: Boolean,
    default: true
  },
  alertSent: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Product", productSchema);
/*
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: { // Link del prodotto Amazon
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  desiredPrice: { // Prezzo target per l'alert
    type: Number,
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  alertSent: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Product", productSchema);
*/
