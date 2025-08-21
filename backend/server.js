import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let orders = []; // in-memory (resets when server restarts)

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Backend is running ✅. Use /orders to fetch data.");
});

// ✅ Get all orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// ✅ Place new order
app.post("/orders", (req, res) => {
  const order = { ...req.body, _id: Date.now().toString() };
  orders.push(order);
  res.json(order);
});

// ✅ Mark product as delivered
app.patch("/orders/:id/deliver", (req, res) => {
  const { id } = req.params;
  const { itemName } = req.body;

  const order = orders.find(o => o._id === id);
  if (!order) return res.status(404).send("Order not found");

  // remove only the delivered product
  order.items = order.items.filter(i => i.name !== itemName);

  res.json(order);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
