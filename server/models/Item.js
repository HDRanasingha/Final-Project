const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true }, // Image path or URL
  supplierId: { type: String, required: true }, // Assuming the supplier's ID is stored
});

module.exports = mongoose.model("Item", itemSchema);


