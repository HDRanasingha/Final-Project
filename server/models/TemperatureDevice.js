const mongoose = require("mongoose");

const TemperatureDeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    currentTemperature: {
        type: Number,
        default: null,
    },
    minTemperature: {
        type: Number,
        required: true,
    },
    maxTemperature: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("TemperatureDevice", TemperatureDeviceSchema);