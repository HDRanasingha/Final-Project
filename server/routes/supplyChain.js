const express = require("express");
const router = express.Router();
const Flower = require("../models/Flower");
const Product = require("../models/Product");
const Item = require("../models/Item");
const Order = require("../models/Order");
const User = require("../models/User");

// Get supply chain overview data
router.get("/overview", async (req, res) => {
  try {
    // Get counts of each entity type
    const [flowerCount, productCount, itemCount, orderCount] = await Promise.all([
      Flower.countDocuments(),
      Product.countDocuments(),
      Item.countDocuments(),
      Order.countDocuments()
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      counts: {
        flowers: flowerCount,
        products: productCount,
        items: itemCount,
        orders: orderCount
      },
      recentOrders,
      topProducts
    });
  } catch (error) {
    console.error("Error fetching supply chain overview:", error);
    res.status(500).json({ error: "Failed to fetch supply chain overview" });
  }
});

// Get product traceability data
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product details
    const product = await Product.findById(id).populate("sellerId", "firstName lastName email");
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Get related flowers (simplified - in a real app, you'd have proper relationships)
    const relatedFlowers = await Flower.find()
      .populate("growerId", "firstName lastName email")
      .limit(3);
      
    // Get related items (simplified - in a real app, you'd have proper relationships)
    const relatedItems = await Item.find()
      .populate("supplierId", "firstName lastName email")
      .limit(2);
      
    // Get orders containing this product
    const relatedOrders = await Order.find({
      "items.name": product.name
    }).limit(5);
    
    res.status(200).json({
      product,
      relatedFlowers,
      relatedItems,
      relatedOrders
    });
  } catch (error) {
    console.error("Error fetching product traceability:", error);
    res.status(500).json({ error: "Failed to fetch product traceability" });
  }
});

// Get order tracking data
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order tracking data:", error);
    res.status(500).json({ error: "Failed to fetch order tracking data" });
  }
});

// Get supply chain analytics
router.get("/analytics", async (req, res) => {
  try {
    // Get monthly order counts
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // Get inventory levels
    const [flowerInventory, productInventory, itemInventory] = await Promise.all([
      Flower.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$stock" },
            avgPrice: { $avg: "$price" }
          }
        }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$stock" },
            avgPrice: { $avg: "$price" }
          }
        }
      ]),
      Item.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: "$stock" },
            avgPrice: { $avg: "$price" }
          }
        }
      ])
    ]);
    
    res.status(200).json({
      monthlyOrders,
      inventory: {
        flowers: flowerInventory[0] || { totalStock: 0, avgPrice: 0 },
        products: productInventory[0] || { totalStock: 0, avgPrice: 0 },
        items: itemInventory[0] || { totalStock: 0, avgPrice: 0 }
      }
    });
  } catch (error) {
    console.error("Error fetching supply chain analytics:", error);
    res.status(500).json({ error: "Failed to fetch supply chain analytics" });
  }
});

module.exports = router;