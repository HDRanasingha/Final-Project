const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/Item');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Middleware to authenticate user and attach user ID to request
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.supplierId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

// ✅ Add a new item
router.post('/add', authenticateUser, upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description } = req.body;
        const supplierId = req.supplierId;

        if (!name || !stock || !price || !req.file || !supplierId) {
            return res.status(400).json({ success: false, message: "All fields except description are required" });
        }

        const imgPath = `/uploads/${req.file.filename}`;
        const newItem = new Item({ name, stock, price, description, img: imgPath, supplierId });

        await newItem.save();
        res.status(201).json({ success: true, message: "Item added successfully", item: newItem });

    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ success: false, message: "Error adding item", error: error.message });
    }
});

// ✅ Get all items
router.get('/all', async (req, res) => {
    try {
        const items = await Item.find().populate("supplierId", "companyName contact");
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching items", error: error.message });
    }
});

// ✅ Get a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate("supplierId", "companyName contact");
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching item", error: error.message });
    }
});

// ✅ Edit an item
router.put('/edit/:id', authenticateUser, upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description } = req.body;
        const supplierId = req.supplierId;
        const item = await Item.findOne({ _id: req.params.id, supplierId });

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        let imgPath = item.img;
        if (req.file) {
            if (item.img && fs.existsSync(`public${item.img}`)) {
                fs.unlinkSync(`public${item.img}`);
            }
            imgPath = `/uploads/${req.file.filename}`;
        }

        item.name = name || item.name;
        item.stock = stock || item.stock;
        item.price = price || item.price;
        item.description = description || item.description;
        item.img = imgPath;

        await item.save();
        res.status(200).json({ success: true, message: "Item updated successfully", item });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating item", error: error.message });
    }
});

// ✅ Delete an item
router.delete('/delete/:id', authenticateUser, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, supplierId: req.supplierId });
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Delete image file
        if (item.img) {
            const imagePath = `public${item.img}`;
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting item", error: error.message });
    }
});

module.exports = router;
