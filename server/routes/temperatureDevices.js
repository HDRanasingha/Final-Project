const express = require("express");
const router = express.Router();
const TemperatureDevice = require("../models/TemperatureDevice");
const verifyToken = require("../middleware/auth");

// Get all temperature devices for the logged-in user
router.get("/all", verifyToken, async (req, res) => {
    try {
        const devices = await TemperatureDevice.find({ ownerId: req.user.id });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching temperature devices", error: error.message });
    }
});

// Get a specific temperature device
router.get("/:id", async (req, res) => {
    try {
        const device = await TemperatureDevice.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Temperature device not found" });
        }
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: "Error fetching temperature device", error: error.message });
    }
});

// Add a new temperature device
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { name, location, minTemperature, maxTemperature } = req.body;
        
        const newDevice = new TemperatureDevice({
            name,
            location,
            minTemperature,
            maxTemperature,
            ownerId: req.user.id
        });
        
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        res.status(500).json({ message: "Error adding temperature device", error: error.message });
    }
});

// Update temperature device
router.put("/edit/:id", verifyToken, async (req, res) => {
    try {
        const { name, location, minTemperature, maxTemperature, status } = req.body;
        
        const device = await TemperatureDevice.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Temperature device not found" });
        }
        
        // Check if user owns this device
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this device" });
        }
        
        const updatedDevice = await TemperatureDevice.findByIdAndUpdate(
            req.params.id,
            { name, location, minTemperature, maxTemperature, status },
            { new: true }
        );
        
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: "Error updating temperature device", error: error.message });
    }
});

// Update temperature reading
router.put("/update-temperature/:id", verifyToken, async (req, res) => {
    try {
        const { currentTemperature } = req.body;
        
        const device = await TemperatureDevice.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Temperature device not found" });
        }
        
        // Check if user owns this device
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this device" });
        }
        
        const updatedDevice = await TemperatureDevice.findByIdAndUpdate(
            req.params.id,
            { 
                currentTemperature, 
                lastUpdated: Date.now() 
            },
            { new: true }
        );
        
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: "Error updating temperature", error: error.message });
    }
});

// Delete temperature device
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const device = await TemperatureDevice.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Temperature device not found" });
        }
        
        // Check if user owns this device
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this device" });
        }
        
        await TemperatureDevice.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Temperature device deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting temperature device", error: error.message });
    }
});

module.exports = router;