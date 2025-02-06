const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/Item');
const fs = require('fs'); 

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

// ✅ Add a new item
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description } = req.body;

        if (!name || !stock || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields except description are required" });
        }

        const imgPath = `/uploads/${req.file.filename}`;
        const newItem = new Item({ name, stock, price, description, img: imgPath });

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
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching items", error: error.message });
    }
});



// ✅ Edit item details
router.put('/edit/:id', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

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

// ✅ Remove an item
router.delete('/delete/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (item.img && fs.existsSync(`public${item.img}`)) {
            fs.unlinkSync(`public${item.img}`);
        }

        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Item removed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing item", error: error.message });
    }
});

module.exports = router;


