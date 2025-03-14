import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/TrackOrderPage.scss";
import { FaBox, FaShippingFast, FaTruck, FaCheckCircle, FaWarehouse } from "react-icons/fa";

// Updated status steps to include "Received at Warehouse"
const statusSteps = ["Processing", "Received at Warehouse", "Shipped", "Out for Delivery", "Delivered"];
const statusIcons = [<FaBox />, <FaWarehouse />, <FaShippingFast />, <FaTruck />, <FaCheckCircle />];

const TrackOrderPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      axios
        .get(`http://localhost:3001/api/orders/${orderId}`)
        .then((res) => {
          setOrder(res.data);
          const stepIndex = statusSteps.indexOf(res.data.status);
          setProgress(((stepIndex + 1) / statusSteps.length) * 100);
          setError(null);
        })
        .catch((err) => {
          setError("We couldn't find your order. Please check your Order ID and try again.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId]);

  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      setLoading(true);
      axios
        .delete(`http://localhost:3001/api/orders/${orderId}`)
        .then(() => {
          setOrder({ ...order, status: "Cancelled" });
          setProgress(0);
          alert("Your order has been successfully cancelled.");
        })
        .catch((err) => {
          setError("We couldn't cancel your order at this time. Please try again later or contact customer support.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="track-order-container">
        <h1>
          <FaShippingFast /> Track Your Order
        </h1>
        
        {loading && <div className="loading">Loading order details...</div>}
        
        {error && <p className="error">{error}</p>}
        
        {order && (
          <>
            <h2>Order #{order.orderId || order._id}</h2>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-line"></div>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              {statusSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step ${index <= statusSteps.indexOf(order.status) ? "active" : ""}`}
                  data-label={step}
                >
                  {statusIcons[index] || (index + 1)}
                </div>
              ))}
            </div>

            <div className="order-details">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Order Date:</strong> {order.createdAt ? formatDate(order.createdAt) : "N/A"}</p>
              
              {order.customer && (
                <>
                  <p><strong>Shipping To:</strong> {order.customer.name}</p>
                  <p><strong>Address:</strong> {order.customer.address}, {order.customer.area}</p>
                  <p><strong>Contact:</strong> {order.customer.phone}</p>
                </>
              )}
              
              <h3>Order Items</h3>
              <ul>
                {order.items && order.items.map((item, index) => (
                  <li key={index}>
                    <p><strong>{item.name}</strong></p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs. {item.price.toFixed(2)}</p>
                    <p>Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              
              <p><strong>Total Amount:</strong> Rs. {order.total.toFixed(2)}</p>
              
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <button onClick={handleCancelOrder}>
                  Cancel Order
                </button>
              )}
            </div>
          </>
        )}
        
        {!orderId && !loading && (
          <div className="no-order-id">
            <p>Please provide an Order ID to track your order.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;