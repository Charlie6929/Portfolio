// scraping.js
// Simulazione scraping per demo — restituisce dati fittizi

async function getScrapedData(url) {
  console.log(`Simulazione scraping da URL: ${url}`);

  // Simulazione dati prodotto
  return {
    name: "Demo Product from URL",
    price: 19.99
  };

  // Per scraping reale:
  // const axios = require('axios');
  // const cheerio = require('cheerio');
  // const res = await axios.get(url);
  // const $ = cheerio.load(res.data);
  // const name = $('selector').text();
  // const price = parseFloat($('priceSelector').text());
  // return { name, price };
}

module.exports = { getScrapedData };
