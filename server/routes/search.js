// //const express = require('express');
// const router = express.Router();
// const Flower = require('../models/Flower');
// const Product = require('../models/Product');
// const Item = require('../models/Item');

// router.get('/', async (req, res) => {
//   const { query } = req.query;

//   try {
//     const flowers = await Flower.find({ name: { $regex: query, $options: 'i' } });
//     const products = await Product.find({ name: { $regex: query, $options: 'i' } });
//     const items = await Item.find({ name: { $regex: query, $options: 'i' } });

//     res.json({ flowers, products, items });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;