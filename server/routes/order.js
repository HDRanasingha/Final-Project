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

router.get("/", async (req, res) => {
  try {
    // order contains listerId and send only orders that match the listerId
    const listerId = req.query.listerId;
    
    const orders = await Order.find({ "items.listerId": listerId });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  const { orderId, items, total, customer, status } = req.body;

  const newOrder = new Order({
    orderId,
    items,
    total,
    customer,
    status,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;
