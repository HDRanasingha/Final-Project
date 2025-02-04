const express = require('express');
const router = express.Router();
const multer = require('multer');
const Flower = require('../models/Flower');
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

// ✅ Add a new flower
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description, growerId } = req.body;

        if (!name || !stock || !price || !req.file || !growerId) {
            return res.status(400).json({ success: false, message: "All fields except description are required" });
        }

        const imgPath = `/uploads/${req.file.filename}`;
        const newFlower = new Flower({ name, stock, price, description, img: imgPath, growerId });

        await newFlower.save();
        res.status(201).json({ success: true, message: "Flower added successfully", flower: newFlower });

    } catch (error) {
        console.error("Error adding flower:", error);
        res.status(500).json({ success: false, message: "Error adding flower", error: error.message });
    }
});

// ✅ Get all flowers
router.get('/all', async (req, res) => {
    try {
        const flowers = await Flower.find().populate("growerId", "firstName lastName");
        res.status(200).json(flowers);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching flowers", error: error.message });
    }
});

// ✅ Get a single flower
router.get('/:id', async (req, res) => {
    try {
        const flower = await Flower.findById(req.params.id).populate("growerId", "firstName lastName");
        res.status(200).json(flower);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching flower", error: error.message });
    }
});

// ✅ Edit flower details
router.put('/edit/:id', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, description } = req.body;
        const flower = await Flower.findById(req.params.id);

        if (!flower) return res.status(404).json({ success: false, message: "Flower not found" });

        let imgPath = flower.img;
        if (req.file) {
            if (flower.img && fs.existsSync(`public${flower.img}`)) {
                fs.unlinkSync(`public${flower.img}`);
            }
            imgPath = `/uploads/${req.file.filename}`;
        }

        flower.name = name || flower.name;
        flower.stock = stock || flower.stock;
        flower.price = price || flower.price;
        flower.description = description || flower.description;
        flower.img = imgPath;

        await flower.save();
        res.status(200).json({ success: true, message: "Flower updated successfully", flower });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating flower", error: error.message });
    }
});

// ✅ Remove a flower
router.delete('/delete/:id', async (req, res) => {
    try {
        const flower = await Flower.findById(req.params.id);
        if (!flower) return res.status(404).json({ success: false, message: "Flower not found" });

        if (flower.img && fs.existsSync(`public${flower.img}`)) {
            fs.unlinkSync(`public${flower.img}`);
        }

        await Flower.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Flower removed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing flower", error: error.message });
    }
});

module.exports = router;


