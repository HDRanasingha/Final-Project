const express = require('express');
const router = express.Router();
const multer = require('multer');
const Flower = require('../models/Flower');

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Save images in 'public/uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ Add a new flower (Save to Database)
router.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price, growerId } = req.body;
        const imgPath = req.file ? `/uploads/${req.file.filename}` : "";

        const newFlower = new Flower({ name, stock, price, img: imgPath, growerId });
        await newFlower.save();

        res.status(201).json({ success: true, message: "Flower added successfully", flower: newFlower });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding flower", error });
    }
});

// ✅ Get all flowers from DB
router.get('/all', async (req, res) => {
    try {
        const flowers = await Flower.find().populate("growerId", "firstName lastName");
        res.status(200).json(flowers);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching flowers", error });
    }
});

// ✅ Edit flower details
router.put('/edit/:id', upload.single('img'), async (req, res) => {
    try {
        const { name, stock, price } = req.body;
        const imgPath = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedFlower = await Flower.findByIdAndUpdate(
            req.params.id,
            { name, stock, price, ...(imgPath && { img: imgPath }) },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Flower updated successfully", flower: updatedFlower });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating flower", error });
    }
});

// ✅ Remove a flower
router.delete('/delete/:id', async (req, res) => {
    try {
        await Flower.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Flower removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing flower", error });
    }
});

module.exports = router;

