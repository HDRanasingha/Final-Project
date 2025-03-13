import React, { useState } from "react";
import axios from "axios";
import "../styles/Tracking.scss";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const statusSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const Tracking = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        const stepIndex = statusSteps.indexOf(res.data.status);
        setProgress(((stepIndex + 1) / statusSteps.length) * 100);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Order not found");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelOrder = () => {
    if (!orderDetails) return;
    
    if (window.confirm("Are you sure you want to cancel this order?")) {
      axios
        .delete(`http://localhost:3001/api/orders/${orderId}`)
        .then(() => {
          setOrderDetails(null);
          setProgress(0);
          alert("Order has been canceled successfully.");
        })
        .catch((err) => {
          setError("Error canceling the order.");
          console.error(err);
        });
    }
  };

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="track-order-container">
        <h1>Track Your Order</h1>
        <div className="track-input">
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
          <>
            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-line"></div>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              {statusSteps.map((step, index) => (
                <div key={index} className={`step ${index <= statusSteps.indexOf(orderDetails.status) ? "active" : ""}`}>
                  {index + 1}
                </div>
              ))}
            </div>
            
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
              
              {orderDetails.status !== "Delivered" && (
                <button onClick={handleCancelOrder} className="cancel-order-button">
                  Cancel Order
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Tracking;
