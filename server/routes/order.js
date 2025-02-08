const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Your Order model

// Route to create a new order
router.post('/', async (req, res) => {
  const { orderId, items, total, customer, status } = req.body;

  const newOrder = new Order({
    orderId,
    items,
    total,
    customer,
    status,
    createdAt: new Date(),
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;