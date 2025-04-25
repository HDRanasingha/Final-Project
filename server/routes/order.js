const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Flower = require("../models/Flower");
const Product = require("../models/Product");
const Item = require("../models/Item");
const mongoose = require("mongoose");

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

// Get received orders (orders where the user's ID matches the listerId in the items)
router.get("/received/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    console.log(`Fetching received orders for user ${userId} with role ${role || 'unknown'} at ${new Date().toISOString()}`);

    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Ensure userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Import required models if not already imported
    const Flower = require('../models/Flower');
    const Product = require('../models/Product');
    const Item = require('../models/Item');

    // Find all orders first
    const allOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean() // Convert to plain JavaScript objects for better performance
      .exec();

    console.log(`Found ${allOrders.length} total orders in the system`);

    // Process orders to only include those with items that belong to this user
    const filteredOrders = [];
    const userIdStr = userId.toString();

    for (const order of allOrders) {
      // Array to store items that belong to this user
      const userItems = [];

      // Check each item in the order
      for (const item of order.items) {
        if (!item.listerId) continue;

        const itemId = item.listerId.toString();
        let ownerFound = false;

        // Check if it's a flower and belongs to this user
        try {
          const flower = await Flower.findById(itemId).lean().exec();
          if (flower && flower.growerId) {
            const growerId = flower.growerId.toString();
            console.log(`Flower ${flower.name} (${itemId}) has growerId: ${growerId}, comparing with userId: ${userIdStr}`);

            if (growerId === userIdStr) {
              userItems.push(item);
              ownerFound = true;
              console.log(`Match found: Flower ${flower.name} belongs to user ${userIdStr}`);
            }
          }
        } catch (err) {
          console.log(`Error checking flower: ${err.message}`);
        }

        // If not found in flowers, check products
        if (!ownerFound) {
          try {
            const product = await Product.findById(itemId).lean().exec();
            if (product && product.sellerId) {
              const sellerId = product.sellerId.toString();
              console.log(`Product ${product.name} (${itemId}) has sellerId: ${sellerId}, comparing with userId: ${userIdStr}`);

              if (sellerId === userIdStr) {
                userItems.push(item);
                ownerFound = true;
                console.log(`Match found: Product ${product.name} belongs to user ${userIdStr}`);
              }
            }
          } catch (err) {
            console.log(`Error checking product: ${err.message}`);
          }
        }

        // If not found in products, check items
        if (!ownerFound) {
          try {
            const generalItem = await Item.findById(itemId).lean().exec();
            if (generalItem && generalItem.supplierId) {
              const supplierId = generalItem.supplierId.toString();
              console.log(`Item ${generalItem.name} (${itemId}) has supplierId: ${supplierId}, comparing with userId: ${userIdStr}`);

              if (supplierId === userIdStr) {
                userItems.push(item);
                ownerFound = true;
                console.log(`Match found: Item ${generalItem.name} belongs to user ${userIdStr}`);
              }
            }
          } catch (err) {
            console.log(`Error checking item: ${err.message}`);
          }
        }
      }

      // Only include orders that have at least one item belonging to this user
      if (userItems.length > 0) {
        // Create a copy of the order with only the user's items
        const filteredOrder = {
          ...order,
          items: userItems
        };

        filteredOrders.push(filteredOrder);
      }
    }

    console.log(`Filtered to ${filteredOrders.length} orders for user ${userId} with role ${role || 'unknown'}`);

    // Log the most recent filtered order for debugging
    if (filteredOrders.length > 0) {
      console.log(`Most recent filtered order: ${filteredOrders[0].orderId} (created: ${filteredOrders[0].createdAt})`);
      console.log(`Items in most recent filtered order: ${filteredOrders[0].items.length}`);

      // Log some details about the items in the most recent filtered order
      filteredOrders[0].items.forEach((item, i) => {
        console.log(`Item ${i + 1}: ${item.name}, ListerId: ${item.listerId}, Role: ${item.listerRole || 'unknown'}`);
      });
    } else {
      console.log(`No filtered orders found for user ${userId}`);
    }

    // Return the filtered orders with only items belonging to this user
    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching received orders:", error);
    res.status(500).json({ error: "Failed to fetch received orders" });
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
    const statuses = { processing: 0, shipped: 0, delivered: 0, cancelled: 0, receivedWarehouse: 0 };
    orders.forEach(order => {
      if (order.status === 'Processing') statuses.processing++;
      if (order.status === 'Shipped') statuses.shipped++;
      if (order.status === 'Delivered') statuses.delivered++;
      if (order.status === 'Cancelled') statuses.cancelled++;
      if (order.status === 'Received Warehouse') statuses.receivedWarehouse++;
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // First validate stock availability for all items
    for (const item of items) {
      let stockAvailable = false;

      // Check Flower stock
      const flower = await Flower.findById(item.listerId);
      if (flower && flower.stock >= item.quantity) {
        stockAvailable = true;
      }

      // Check Product stock if not found in Flower
      if (!stockAvailable) {
        const product = await Product.findById(item.listerId);
        if (product && product.stock >= item.quantity) {
          stockAvailable = true;
        }
      }

      // Check Item stock if not found in Product
      if (!stockAvailable) {
        const generalItem = await Item.findById(item.listerId);
        if (generalItem && generalItem.stock >= item.quantity) {
          stockAvailable = true;
        }
      }

      if (!stockAvailable) {
        throw new Error(`Insufficient stock for item: ${item.name}`);
      }
    }

    // Ensure each item has a listerRole field based on the item type
    const itemsWithRoles = items.map(async (item) => {
      let listerRole = null;

      // Check if it's a flower (grower)
      const flower = await Flower.findById(item.listerId);
      if (flower) {
        listerRole = "grower";
      } else {
        // Check if it's a product (seller)
        const product = await Product.findById(item.listerId);
        if (product) {
          listerRole = "seller";
        } else {
          // Check if it's an item (supplier)
          const generalItem = await Item.findById(item.listerId);
          if (generalItem) {
            listerRole = "supplier";
          }
        }
      }

      return {
        ...item,
        listerRole: listerRole || "unknown"
      };
    });

    // Wait for all role determinations to complete
    const processedItems = await Promise.all(itemsWithRoles);

    // Create new order with processed items
    const newOrder = new Order({
      orderId,
      items: processedItems,
      total,
      customer,
      status,
    });

    await newOrder.save({ session });

    // Update stock for each item
    for (const item of items) {
      let updated = false;

      // Try updating flower stock
      const flowerUpdate = await Flower.findOneAndUpdate(
        { _id: item.listerId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );

      if (flowerUpdate) {
        console.log(`Updated Flower stock for ${item.name}. New stock: ${flowerUpdate.stock}`);
        updated = true;
      }

      // If not a flower, try updating product stock
      if (!updated) {
        const productUpdate = await Product.findOneAndUpdate(
          { _id: item.listerId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, new: true }
        );

        if (productUpdate) {
          console.log(`Updated Product stock for ${item.name}. New stock: ${productUpdate.stock}`);
          updated = true;
        }
      }

      // If not a product, try updating item stock
      if (!updated) {
        const itemUpdate = await Item.findOneAndUpdate(
          { _id: item.listerId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, new: true }
        );

        if (itemUpdate) {
          console.log(`Updated Item stock for ${item.name}. New stock: ${itemUpdate.stock}`);
        } else {
          throw new Error(`Failed to update stock for item: ${item.name}`);
        }
      }
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Order placed successfully!" });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error placing order:", error);
    res.status(400).json({
      error: error.message || "Failed to place order",
      details: error.message.includes("Insufficient stock") ? "Some items are out of stock" : "Transaction failed"
    });
  } finally {
    session.endSession();
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
// Get monthly income
router.get("/monthly-income", async (req, res) => {
  try {
    const monthlyIncome = await Order.aggregate([
      // Exclude cancelled orders
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalIncome: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(monthlyIncome);
  } catch (error) {
    console.error("Error calculating monthly income:", error);
    res.status(500).json({ error: "Failed to calculate monthly income" });
  }
});

module.exports = router;