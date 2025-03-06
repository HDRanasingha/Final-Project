const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Product = require('../models/Product');
const Item = require('../models/Item');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.json({ flowers: [], products: [], items: [], users: [] });
  }

  try {
    // Search across all collections with case-insensitive regex
    const flowers = await Flower.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    const products = await Product.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    const items = await Item.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    // Add user search functionality
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({ flowers, products, items, users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;