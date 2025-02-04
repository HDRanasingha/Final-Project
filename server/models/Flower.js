const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
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
    growerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Flower = mongoose.model("Flower", flowerSchema);
module.exports = Flower;

