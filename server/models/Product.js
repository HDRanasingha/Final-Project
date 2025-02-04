const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    img: {
        type: String, // Store the image path
        required: true
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;


