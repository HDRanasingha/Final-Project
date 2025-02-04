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
    img: {
        type: String, // Store image path (consider using cloud storage for real-world apps)
        required: true,
    },
    growerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencing the User model
        required: true,
    }
}, { timestamps: true });

const Flower = mongoose.model("Flower", flowerSchema);
module.exports = Flower;
