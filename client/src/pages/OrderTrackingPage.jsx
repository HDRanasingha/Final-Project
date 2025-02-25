import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.error("Error fetching order details:", err);
        setErrorMessage("Failed to fetch order details. Please try again.");
      });
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="order-tracking-page">
      <Navbar />
      <div className="order-container">
        <h1>Order Tracking</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="order-details">
          <h3>Order ID: {order.orderId || order._id}</h3>
          <p>Customer: {order.customer?.name || "Unknown"}</p>
          <p>Status: {order.status || "Pending"}</p>
          <p>Ordered At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
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
      </div>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;