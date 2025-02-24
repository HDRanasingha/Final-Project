const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Flower = require("../models/Flower");


// Get all orders
router.get("/", async (req, res) => {
  try {
    const listerId = req.query.listerId;
    const query = listerId ? { "items.listerId": listerId } : {};
    const orders = await Order.find(query);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/success", async (req, res) => {
  const { orderId, items, total, customer, status } = req.body;

  try {
    const newOrder = new Order({
      orderId,
      items,
      total,
      customer,
      status,
    });

    await newOrder.save();
// reduce stock
    items.forEach(async (item) => {
      await Flower.findOneAndUpdate(
        { growerId: item.listerId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    });
    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Update order status
router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully!", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
