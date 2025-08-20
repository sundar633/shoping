const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to orders.json
const ordersFile = path.join(__dirname, "orders.json");

// Ensure orders.json exists
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]");
}

// 📌 Get all orders
app.get("/api/orders", (req, res) => {
  fs.readFile(ordersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read orders" });
    res.json(JSON.parse(data));
  });
});

// 📌 Add new order
app.post("/api/orders", (req, res) => {
  const newOrder = req.body;

  fs.readFile(ordersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read orders" });

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (e) {
      orders = [];
    }

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save order" });
      res.json({ message: "✅ Order saved successfully!" });
    });
  });
});

// 📌 Delete an order by index
app.delete("/api/orders/:index", (req, res) => {
  const orderIndex = parseInt(req.params.index);

  fs.readFile(ordersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read orders" });

    let orders = JSON.parse(data);
    if (orderIndex >= 0 && orderIndex < orders.length) {
      orders.splice(orderIndex, 1);

      fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete order" });
        res.json({ message: "✅ Order deleted successfully!" });
      });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
