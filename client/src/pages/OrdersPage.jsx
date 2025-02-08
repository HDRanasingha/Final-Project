import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders for the supplier
    axios
      .get("http://localhost:3001/api/orders/supplier/65b9ff3cdab5f4b02174a68f") // Replace with actual supplier ID
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleOrderStatusChange = (orderId, newStatus) => {
    // Update order status (e.g., mark as 'Shipped')
    axios
      .put(`http://localhost:3001/api/orders/status/${orderId}`, { status: newStatus })
      .then(() => {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      })
      .catch((err) => console.error("Error updating order status:", err));
  };

  return (
    <div className="orders-page">
      <Navbar />
      <h2>Manage Orders</h2>
      <div className="order-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Customer: {order.customerName}</p>
            <p>Total: Rs. {order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => handleOrderStatusChange(order._id, "Shipped")}>
              Mark as Shipped
            </button>
            <button onClick={() => handleOrderStatusChange(order._id, "Delivered")}>
              Mark as Delivered
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;


