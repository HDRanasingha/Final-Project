const express = require("express");
const router = express.Router();
const multer = require("multer");
const Flower = require("../models/Flower");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
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
    req.growerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ✅ Add a new flower
router.post(
  "/add",
  authenticateUser,
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, stock, price, description } = req.body;
      const growerId = req.growerId;

      if (!name || !stock || !price || !req.file || !growerId) {
        return res
          .status(400)
          .json({
            success: false,
            message: "All fields except description are required",
          });
      }

      const imgPath = `/uploads/${req.file.filename}`;
      const newFlower = new Flower({
        name,
        stock,
        price,
        description,
        img: imgPath,
        growerId,
      });

      await newFlower.save();
      res
        .status(201)
        .json({
          success: true,
          message: "Flower added successfully",
          flower: newFlower,
        });
    } catch (error) {
      console.error("Error adding flower:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error adding flower",
          error: error.message,
        });
    }
  }
);

// ✅ Get all flowers for customers
router.get("/all-flowers", async (req, res) => {
  try {
    const flowers = await Flower.find().populate(
      "growerId",
      "firstName lastName"
    );
    res.status(200).json(flowers);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching flowers",
        error: error.message,
      });
  }
});

// ✅ Get all flowers for the logged-in grower
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const flowers = await Flower.find({ growerId: req.growerId }).populate(
      "growerId",
      "firstName lastName"
    );
    res.status(200).json(flowers);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching flowers",
        error: error.message,
      });
  }
});

// ✅ Get a single flower by ID
router.get("/:id", async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id).populate("growerId", "firstName lastName");
    if (!flower) {
      return res.status(404).json({ success: false, message: "Flower not found" });
    }
    res.status(200).json(flower);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching flower details", error: error.message });
  }
});

// ✅ Edit flower details
router.put(
  "/edit/:id",
  authenticateUser,
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, stock, price, description } = req.body;
      const growerId = req.growerId;
      const flower = await Flower.findOne({ _id: req.params.id, growerId });

      if (!flower)
        return res
          .status(404)
          .json({ success: false, message: "Flower not found" });

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
      res
        .status(200)
        .json({
          success: true,
          message: "Flower updated successfully",
          flower,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating flower",
          error: error.message,
        });
    }
  }
);

// ✅ Remove a flower
router.delete("/delete/:id", authenticateUser, async (req, res) => {
  try {
    const flower = await Flower.findOne({
      _id: req.params.id,
      growerId: req.growerId,
    });
    if (!flower)
      return res
        .status(404)
        .json({ success: false, message: "Flower not found" });

    if (flower.img && fs.existsSync(`public${flower.img}`)) {
      fs.unlinkSync(`public${flower.img}`);
    }

    await Flower.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Flower removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error removing flower",
        error: error.message,
      });
  }
});

module.exports = router;