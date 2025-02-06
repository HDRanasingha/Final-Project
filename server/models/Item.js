const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming suppliers are users
        required: true,
    }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
