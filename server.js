const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Dummy product storage (in memory)
let products = [
  { id: 1, name: "T-shirt", price: 299 },
  { id: 2, name: "Shoes", price: 999 }
];

// Home page (product listing)
app.get("/", (req, res) => {
  res.render("index", { products });
});

// Admin dashboard
app.get("/admin", (req, res) => {
  res.render("admin", { products });
});

// Add product
app.post("/add", (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: Date.now(), name, price: parseFloat(price) };
  products.push(newProduct);
  res.redirect("/admin");
});

// Delete product
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.redirect("/admin");
});

// Buy → redirect to WhatsApp
app.get("/buy/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.send("Product not found");
  const phone = "YOUR_NUMBER_HERE"; // apna WhatsApp number dalna
  const url = `https://wa.me/${phone}?text=I%20want%20to%20buy%20${product.name}%20for%20${product.price}`;
  res.redirect(url);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
