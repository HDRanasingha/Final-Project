const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');

const router = express.Router();

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Save images in public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Add a new flower product
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price } = req.body;
        const img = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !stock || !price || !img) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({ name, stock, price, img });
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get all flower products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Delete a flower product
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;


