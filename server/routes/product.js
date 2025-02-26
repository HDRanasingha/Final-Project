const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

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
    req.sellerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ✅ Add a new product
router.post(
  "/add",
  authenticateUser,
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, stock, price, description } = req.body;
      const sellerId = req.sellerId;

      if (!name || !stock || !price || !req.file || !sellerId) {
        return res
          .status(400)
          .json({
            success: false,
            message: "All fields except description are required",
          });
      }

      const imgPath = `/uploads/${req.file.filename}`;
      const newProduct = new Product({
        name,
        stock,
        price,
        description,
        img: imgPath,
        sellerId,
      });

      await newProduct.save();
      res
        .status(201)
        .json({
          success: true,
          message: "Product added successfully",
          product: newProduct,
        });
    } catch (error) {
      console.error("Error adding product:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error adding product",
          error: error.message,
        });
    }
  }
);

// ✅ Get all products for customers
router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find().populate(
      "sellerId",
      "firstName lastName"
    );
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
  }
});

// ✅ Get all products for the logged-in seller
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.sellerId }).populate(
      "sellerId",
      "firstName lastName"
    );
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
  }
});

// ✅ Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerId", "firstName lastName");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product details", error: error.message });
  }
});

// ✅ Edit product details
router.put(
  "/edit/:id",
  authenticateUser,
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, stock, price, description } = req.body;
      const sellerId = req.sellerId;
      const product = await Product.findOne({ _id: req.params.id, sellerId });

      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });

      let imgPath = product.img;
      if (req.file) {
        if (product.img && fs.existsSync(`public${product.img}`)) {
          fs.unlinkSync(`public${product.img}`);
        }
        imgPath = `/uploads/${req.file.filename}`;
      }

      product.name = name || product.name;
      product.stock = stock || product.stock;
      product.price = price || product.price;
      product.description = description || product.description;
      product.img = imgPath;

      await product.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Product updated successfully",
          product,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating product",
          error: error.message,
        });
    }
  }
);

// ✅ Remove a product
router.delete("/delete/:id", authenticateUser, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.sellerId,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (product.img && fs.existsSync(`public${product.img}`)) {
      fs.unlinkSync(`public${product.img}`);
    }

    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error removing product",
        error: error.message,
      });
  }
});

module.exports = router;




