const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Flower = require("../models/Flower");
const Product = require("../models/Product");
const Item = require("../models/Item");

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

// Get orders by role
router.get("/role/:role", async (req, res) => {
  const { role } = req.params;
  try {
    let orders;
    if (role === "grower") {
      orders = await Order.find({ "items.listerRole": "grower" });
    } else if (role === "supplier") {
      orders = await Order.find({ "items.listerRole": "supplier" });
    } else if (role === "seller") {
      orders = await Order.find({ "items.listerRole": "seller" });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error(`Error fetching ${role} orders:`, error);
    res.status(500).json({ error: `Failed to fetch ${role} orders` });
  }
});

// Get top-selling items
router.get("/top-sellers", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching top-selling items:", error);
    res.status(500).json({ error: "Failed to fetch top-selling items" });
  }
});

// Get order statuses
router.get("/statuses", async (req, res) => {
  try {
    const orders = await Order.find({});
    const statuses = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach(order => {
      if (order.status === 'Processing') statuses.processing++;
      if (order.status === 'Shipped') statuses.shipped++;
      if (order.status === 'Delivered') statuses.delivered++;
      if (order.status === 'Cancelled') statuses.cancelled++;
    });
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    res.status(500).json({ error: "Failed to fetch order statuses" });
  }
});

// Get total income month-to-month
router.get("/total-income", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalIncome: { $sum: "$total" },
        },
      },
      { $sort: { "_id": 1 } }
    ]);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching total income:", error);
    res.status(500).json({ error: "Failed to fetch total income" });
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

    // reduce stock for flowers
    items.forEach(async (item) => {
      await Flower.findOneAndUpdate(
        { growerId: item.listerId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    });

    // reduce stock for products
    items.forEach(async (item) => {
      await Product.findOneAndUpdate(
        { sellerId: item.listerId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    });

    // reduce stock for items
    items.forEach(async (item) => {
      await Item.findOneAndUpdate(
        { supplierId: item.listerId, stock: { $gte: item.quantity } },
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

// Get order by ID
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Cancel order by ID
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Optionally, you can add logic to restock the items if needed
    order.items.forEach(async (item) => {
      await Flower.findOneAndUpdate(
        { growerId: item.listerId },
        { $inc: { stock: item.quantity } }
      );
    });

    // restock products
    order.items.forEach(async (item) => {
      await Product.findOneAndUpdate(
        { sellerId: item.listerId },
        { $inc: { stock: item.quantity } }
      );
    });

    // restock items
    order.items.forEach(async (item) => {
      await Item.findOneAndUpdate(
        { supplierId: item.listerId },
        { $inc: { stock: item.quantity } }
      );
    });

    res.status(200).json({ message: "Order canceled successfully!" });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});


module.exports = router;