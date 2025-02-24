const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Get all orders

// {
//   "_id": {
//     "$oid": "67bb6d6bbef5a0702c0fe2fe"
//   },
//   "orderId": "ORD-455434",
//   "items": [
//     {
//       "name": "test",
//       "price": 1000,
//       "quantity": 1,
//       "listerId": "67b5ee4a7c496cf762a56695",
//       "_id": {
//         "$oid": "67bb6d6bbef5a0702c0fe2ff"
//       }
//     },
//     {
//       "name": "test2",
//       "price": 1000,
//       "quantity": 1,
//       "listerId": "67b5e66257af28743e9784a1",
//       "_id": {
//         "$oid": "67bb6d6bbef5a0702c0fe300"
//       }
//     }
//   ],
//   "total": 2200,
//   "customer": {
//     "name": "test3",
//     "address": "no.111,jesimine park,bandarawella.\nsuite",
//     "phone": "0776342440",
//     "paymentMethod": "cash",
//     "area": "Colombo"
//   },
//   "status": "Processing",
//   "createdAt": {
//     "$date": "2025-02-23T18:48:11.583Z"
//   },
//   "__v": 0
// }

// Get all orders
router.get("/", async (req, res) => {
  try {
    const listerId = req.query.listerId;
    const query = listerId ? { "items.listerId": listerId } : {};
    const orders = await Order.find(query);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/success", async (req, res) => {
  const { orderId, items, total, customer, status } = req.body;

  try {
    const newOrder = new Order({
      orderId,
      items,
      total,
      customer,
      status,
    });

    await newOrder.save();

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Update order status
router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully!", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
