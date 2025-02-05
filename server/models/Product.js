const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Seller" },
});

module.exports = mongoose.model("Product", ProductSchema);
