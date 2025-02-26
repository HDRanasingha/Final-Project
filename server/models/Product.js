const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
      name: {
          type: String,
          required: true,
      },
      stock: {
          type: Number,
          required: true,
          default: 1,
      },
      price: {
          type: Number,
          required: true,
          default: 1000,
      },
      description: {
          type: String, // New description field
          required: false,
          default: "",
      },
      img: {
          type: String,
          required: true,
      },
      sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
      }
  }, { timestamps: true });


module.exports = mongoose.model("Product", ProductSchema);
