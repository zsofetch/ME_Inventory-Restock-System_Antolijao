//NOTE: DID NOT USE JSON DECLARED ALL THE DATA VARIABLES HERE
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let products = [
  { "id": 1, "product_name": "Katsudon", "category": "Fried", "price": "55.00", "stock": 100 },
  { "id": 2, "product_name": "Fish Fillet", "category": "Fried", "price": "65.00", "stock": 150 },
  { "id": 3, "product_name": "Sisig", "category": "Pan-fry", "price": "75.00", "stock": 230 },
  { "id": 4, "product_name": "Lumpia", "category": "Fried", "price": "10.00", "stock": 250 },
  { "id": 5, "product_name": "Burger Steak", "category": "Pan-fry", "price": "25.00", "stock": 200 }
];

function getStockStatus(stock) {
  const s = Number(stock);
  if (s === 0) return "Out of stock";
  if (s >= 1 && s <= 5) return "Low stock";
  if (s > 5) return "Available";
  return "unknown";
}

app.get('/api/products', (req, res) => {
  const mapped = products.map(
   p => ({ ...p, status: getStockStatus(p.stock) }));
  res.json(mapped);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id)); //for transparency, looked up the syntax for finding the product id and Google AI overview showed a code block 
  if (!product) 
    return res.status(404).json({ error: "product not found" });
  res.json({ ...product, status: getStockStatus(product.stock) });
});

app.post('/api/products', (req, res) => {
  const { product_name, category, price, stock } = req.body;
  const stockNum = parseInt(stock); 

    if (stockNum < 0 || isNaN(stockNum)) { //looked up what the property of a non negative number is 
    return res.status(400).json({ error: "Stock cannot be negative." });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    product_name, category,
    price: parseFloat(price).toFixed(2), //looked up the syntax for retaining 2 decimal places of a float value and Google AI overview showed a line of code
    stock: stockNum
  };

  products.push(newProduct);
  res.status(201).json({ ...newProduct, status: getStockStatus(newProduct.stock) });
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
 if (index === -1) 
    return res.status(404).json({ error: "Product not found" });

  products.splice(index, 1);
    res.json({ message: "product deleted successfully" });
});


app.listen(PORT, () => console.log(`Burp Inventory System running at http://localhost:${PORT}`));
