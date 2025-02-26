import React, { useState } from "react";
import axios from "axios";

import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const Tracking = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrderDetails(null);

    axios
      .get(`http://localhost:3001/api/orders/${orderId}`)
      .then((res) => {
        setOrderDetails(res.data);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Order not found");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
        <Navbar />
    <div className="tracking-container">
      <h1>Track Your Order</h1>
      <div className="tracking-input">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button onClick={handleTrackOrder} disabled={loading}>
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {orderDetails && (
        <div className="order-details">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> {orderDetails._id}</p>
          <p><strong>Status:</strong> {orderDetails.status}</p>
          <p><strong>Customer:</strong> {orderDetails.customer?.name || "Unknown"}</p>
          <p><strong>Total Price:</strong> Rs. {orderDetails.total.toFixed(2)}</p>
          <p><strong>Ordered At:</strong> {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : "N/A"}</p>
          <h3>Items:</h3>
          <ul>
            {orderDetails.items.map((item) => (
              <li key={item._id}>
                <p><strong>Item Name:</strong> {item.name}</p>
                <p><strong>Price:</strong> Rs. {item.price.toFixed(2)}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </li>
            ))}
          </ul>
        </div>

        
      )}
    </div>
    <Footer />
    </div>
  );
};

export default Tracking;
