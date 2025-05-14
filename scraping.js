// scraping.js
async function scrapeAmazonMock() {
  return [
    {
      name: "Echo Dot (4ª generazione)",
      price: 49.99,
      category: "Smart Home",
      inStock: true,
    },
    {
      name: "Fire TV Stick 4K",
      price: 39.99,
      category: "Media Streaming",
      inStock: true,
    },
    {
      name: "Cuffie Wireless Sony WH-1000XM4",
      price: 279.99,
      category: "Elettronica",
      inStock: false,
    },
  ];
}

module.exports = { scrapeAmazonMock };
