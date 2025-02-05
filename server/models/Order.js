const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    flowerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flower",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
