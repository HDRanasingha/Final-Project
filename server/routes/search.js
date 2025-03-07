const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Product = require('../models/Product');
const Item = require('../models/Item');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user (optional)
const getAuthenticatedUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    } catch (error) {
      // Token invalid, but we'll continue without authentication
    }
  }
  next();
};

router.get('/', getAuthenticatedUser, async (req, res) => {
  const { query } = req.query;
  const userId = req.userId;
  const userRole = req.userRole;

  if (!query || query.trim() === '') {
    return res.json({ flowers: [], products: [], items: [], users: [] });
  }

  try {
    // Base search queries
    let flowerQuery = { 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };
    
    let productQuery = { 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };
    
    let itemQuery = { 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    // If user is authenticated, modify queries based on role
    if (userId && userRole) {
      if (userRole === 'grower') {
        flowerQuery.growerId = userId;
      } else if (userRole === 'seller') {
        productQuery.sellerId = userId;
      } else if (userRole === 'supplier') {
        itemQuery.supplierId = userId;
      }
    }

    // Execute searches
    const flowers = await Flower.find(flowerQuery).populate("growerId", "firstName lastName");
    const products = await Product.find(productQuery).populate("sellerId", "firstName lastName");
    const items = await Item.find(itemQuery).populate("supplierId", "companyName contact");

    // Only admin can search users
    let users = [];
    if (userRole === 'admin') {
      users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      });
    }

    res.json({ flowers, products, items, users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;