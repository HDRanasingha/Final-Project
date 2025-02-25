import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/TrackOrderPage.scss";

const statusSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const TrackOrderPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`http://localhost:3001/api/orders/${orderId}`)
        .then((res) => {
          setOrder(res.data);
          const stepIndex = statusSteps.indexOf(res.data.status);
          setProgress(((stepIndex + 1) / statusSteps.length) * 100);
        })
        .catch((err) => {
          setError("Error fetching order details.");
          console.error(err);
        });
    }
  }, [orderId]);

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="track-order-container">
        <h1>📦 Track Your Order</h1>
        {error && <p className="error">{error}</p>}
        {order ? (
          <>
            <h2>Order ID: {order.orderId || order._id}</h2>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-line"></div>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              {statusSteps.map((step, index) => (
                <div key={index} className={`step ${index <= statusSteps.indexOf(order.status) ? "active" : ""}`}>
                  {index + 1}
                </div>
              ))}
            </div>

            <div className="order-details">
              <p>Status: <strong>{order.status}</strong></p>
              <p>Ordered At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
              <h3>Items</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    <p>Item Name: {item.name}</p>
                    <p>Price: Rs. {item.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;

