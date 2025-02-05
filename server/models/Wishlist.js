const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

// ✅ Get flowers available for customers (Only those added by growers)
router.get('/flowers', async (req, res) => {
    try {
        const flowers = await Flower.find().populate("growerId", "firstName lastName");
        res.status(200).json(flowers);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching flowers", error });
    }
});

// ✅ Add to Wishlist
router.post('/wishlist/add', async (req, res) => {
    try {
        const { customerId, flowerId } = req.body;
        const wishlistItem = new Wishlist({ customerId, flowerId });
        await wishlistItem.save();
        res.status(201).json({ success: true, message: "Flower added to wishlist" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding to wishlist", error });
    }
});

// ✅ Buy Flower
router.post('/buy', async (req, res) => {
    try {
        const { customerId, flowerId, quantity } = req.body;
        const flower = await Flower.findById(flowerId);

        if (!flower || flower.stock < quantity) {
            return res.status(400).json({ success: false, message: "Not enough stock available" });
        }

        // Reduce stock
        flower.stock -= quantity;
        await flower.save();

        // Create order record
        const order = new Order({ customerId, flowerId, quantity });
        await order.save();

        res.status(201).json({ success: true, message: "Purchase successful", order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error purchasing flower", error });
    }
});

module.exports = router;
