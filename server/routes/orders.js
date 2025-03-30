// In your order creation route, add stock update logic
router.post("/create", async (req, res) => {
  try {
    // ... existing order creation code ...
    
    // After creating the order, update stock for each item
    for (const item of req.body.items) {
      if (item.growerId) {
        // This is a flower
        await Flower.findByIdAndUpdate(
          item._id,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      } else if (item.sellerId) {
        // This is a product
        await Product.findByIdAndUpdate(
          item._id,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      } else if (item.supplierId) {
        // This is a supplier item
        await Item.findByIdAndUpdate(
          item._id,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }
    }
    
    // ... rest of your code ...
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});