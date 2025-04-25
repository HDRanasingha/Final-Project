import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/GrowersOrders.scss";
import {
  FaBox,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaCity
} from "react-icons/fa";

const ReceivedOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));

  const listerId = user._id;

  useEffect(() => {
    setLoading(true);
    // Fetch all orders
    axios
      .get("http://localhost:3001/api/orders")
      .then((res) => {
        if (Array.isArray(res.data)) {
          // Filter orders to only include those where at least one item has the current user as listerId
          const receivedOrders = res.data.filter(order => {
            // Check if any item in this order has the current user as the listerId
            return order.items.some(item => {
              // Convert both to string for comparison since listerId might be stored as ObjectId
              return String(item.listerId) === String(listerId);
            });
          });
          setOrders(receivedOrders);
        } else {
          console.error("Invalid data format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, [listerId]);

  // Filter orders based on status
  const filteredOrders = filter === "all"
    ? orders
    : orders.filter(order => order.status === filter);

  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    const orderTotal = order.items
      .filter(item => item.listerId === listerId)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total + orderTotal;
  }, 0);

  return (
    <div className="growers-orders-page">
      <Navbar />
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Customer Orders Dashboard</h1>
          <p>Manage and track orders placed by customers who purchased your products</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>
            <div className="stat-info">
              <h3>Rs. {totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-header">
          <h2>Customer Order Management</h2>
          <div className="filter-controls">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Orders
            </button>
            <button
              className={filter === "Processing" ? "active" : ""}
              onClick={() => setFilter("Processing")}
            >
              Processing
            </button>
            <button
              className={filter === "Shipped" ? "active" : ""}
              onClick={() => setFilter("Shipped")}
            >
              Shipped
            </button>
            <button
              className={filter === "Delivered" ? "active" : ""}
              onClick={() => setFilter("Delivered")}
            >
              Delivered
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <ul className="order-list">
            {filteredOrders.map((order) => (
              <li key={order._id} className="order-card">
                <div className="order-header">
                  <h3>
                    <FaBox className="icon" />
                    Order ID: {order.orderId || order._id}
                  </h3>
                  <span className={`status-badge ${order.status?.toLowerCase()}`}>
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="order-info">
                  <div className="order-date">
                    <p>
                      <FaCalendarAlt className="icon" />
                      Ordered At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>

                  <div className="customer-details">
                    <h4>Customer Information:</h4>
                    <div className="customer-info-grid">
                      <p>
                        <FaUser className="icon" />
                        Name: {order.customer?.name || "Unknown"}
                      </p>
                      <p>
                        <FaPhone className="icon" />
                        Phone: {order.customer?.phone || "N/A"}
                      </p>
                      <p>
                        <FaMapMarkerAlt className="icon" />
                        Address: {order.customer?.address || "N/A"}
                      </p>
                      <p>
                        <FaCity className="icon" />
                        Area: {order.customer?.area || "N/A"}
                      </p>
                      <p>
                        <FaCreditCard className="icon" />
                        Payment: {order.customer?.paymentMethod || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items in this order:</h4>
                  <ul className="items-list">
                    {order.items
                      .filter((item) => item.listerId === listerId)
                      .map((item) => (
                        <li key={item._id} className="item-card">
                          <div className="item-info">
                            <p className="item-name">
                              <FaTag className="icon" /> {item.name}
                            </p>
                            <div className="item-details">
                              <p>Price: Rs. {item.price.toFixed(2)}</p>
                              <p>Quantity: {item.quantity}</p>
                              <p className="item-total">Total: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-orders">
            <FaBox className="empty-icon" />
            <p>No {filter !== "all" ? filter.toLowerCase() : ""} customer orders found.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReceivedOrdersPage;