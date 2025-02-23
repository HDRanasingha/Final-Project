import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/GrowersOrders.scss";

const GrowersOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user?._id);
  const listerId = user._id;
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/orders", {
        params: {
          listerId,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("Invalid data format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/orders")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("Invalid data format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="growers-orders-page">
      <Navbar />
      <div className="orders-container">
        <h1>📦 Growers Orders</h1>
        {orders.length > 0 ? (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order._id} className="order-card">
                <h3>Order ID: {order.orderId || order._id}</h3>
                <p>Customer: {order.customer?.name || "Unknown"}</p>
                <p>Total: Rs. {order.total ?? "N/A"}</p>
                <p>Status: {order.status || "Pending"}</p>
                <p>Ordered At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GrowersOrderPage;

