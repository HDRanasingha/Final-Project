const express = require("express");
const router = express.Router();
const Flower = require("../models/Flower");
const Product = require("../models/Product");
const Item = require("../models/Item");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Get low inventory items
router.get("/low-stock", async (req, res) => {
  try {
    const lowStockThreshold = 10; // Configurable threshold
    
    // Find all items with stock below threshold
    const [lowStockFlowers, lowStockProducts, lowStockItems] = await Promise.all([
      Flower.find({ stock: { $lte: lowStockThreshold } })
        .populate("growerId", "firstName lastName email"),
        
      Product.find({ stock: { $lte: lowStockThreshold } })
        .populate("sellerId", "firstName lastName email"),
        
      Item.find({ stock: { $lte: lowStockThreshold } })
        .populate("supplierId", "firstName lastName email")
    ]);
    
    // Format the response
    const allLowStock = [
      ...lowStockFlowers.map(f => ({...f.toObject(), type: 'flower'})),
      ...lowStockProducts.map(p => ({...p.toObject(), type: 'product'})),
      ...lowStockItems.map(i => ({...i.toObject(), type: 'item'}))
    ];
    
    res.status(200).json(allLowStock);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ error: "Failed to fetch low stock items" });
  }
});

// Send low stock alerts via email
router.post("/send-alerts", async (req, res) => {
  try {
    const lowStockThreshold = 10;
    
    // Find all low stock items
    const [lowStockFlowers, lowStockProducts, lowStockItems] = await Promise.all([
      Flower.find({ stock: { $lte: lowStockThreshold } }).populate("growerId", "firstName lastName email"),
      Product.find({ stock: { $lte: lowStockThreshold } }).populate("sellerId", "firstName lastName email"),
      Item.find({ stock: { $lte: lowStockThreshold } }).populate("supplierId", "firstName lastName email")
    ]);
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Send emails to respective users
    const emailPromises = [];
    
    // Process flowers
    lowStockFlowers.forEach(flower => {
      if (flower.growerId && flower.growerId.email) {
        const mailOptions = {
          from: 'flowergarden@example.com',
          to: flower.growerId.email,
          subject: 'Low Stock Alert - FlowerSCM',
          html: `
            <h2>Low Stock Alert</h2>
            <p>Dear ${flower.growerId.firstName},</p>
            <p>Your flower product <strong>${flower.name}</strong> is running low on stock (${flower.stock} remaining).</p>
            <p>Please consider restocking soon.</p>
            <p>Thank you,<br>FlowerSCM Team</p>
          `
        };
        emailPromises.push(transporter.sendMail(mailOptions));
      }
    });
    
    // Process products
    lowStockProducts.forEach(product => {
      if (product.sellerId && product.sellerId.email) {
        const mailOptions = {
          from: 'flowergarden@example.com',
          to: product.sellerId.email,
          subject: 'Low Stock Alert - FlowerSCM',
          html: `
            <h2>Low Stock Alert</h2>
            <p>Dear ${product.sellerId.firstName},</p>
            <p>Your product <strong>${product.name}</strong> is running low on stock (${product.stock} remaining).</p>
            <p>Please consider restocking soon.</p>
            <p>Thank you,<br>FlowerSCM Team</p>
          `
        };
        emailPromises.push(transporter.sendMail(mailOptions));
      }
    });
    
    // Process items
    lowStockItems.forEach(item => {
      if (item.supplierId && item.supplierId.email) {
        const mailOptions = {
          from: 'flowergarden@example.com',
          to: item.supplierId.email,
          subject: 'Low Stock Alert - FlowerSCM',
          html: `
            <h2>Low Stock Alert</h2>
            <p>Dear ${item.supplierId.firstName},</p>
            <p>Your supply item <strong>${item.name}</strong> is running low on stock (${item.stock} remaining).</p>
            <p>Please consider restocking soon.</p>
            <p>Thank you,<br>FlowerSCM Team</p>
          `
        };
        emailPromises.push(transporter.sendMail(mailOptions));
      }
    });
    
    await Promise.all(emailPromises);
    
    res.status(200).json({ message: "Low stock alerts sent successfully" });
  } catch (error) {
    console.error("Error sending low stock alerts:", error);
    res.status(500).json({ error: "Failed to send low stock alerts" });
  }
});

module.exports = router;