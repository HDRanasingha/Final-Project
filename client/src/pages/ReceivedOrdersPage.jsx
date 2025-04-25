import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ReceivedOrders.scss";
import {
  FaBox,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaCity,
  FaShoppingBag,
  FaExclamationTriangle
} from "react-icons/fa";

const ReceivedOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));

  // Initial fetch on component mount
  useEffect(() => {
    // Update the fetchOrders function in your ReceivedOrdersPage.jsx
    const fetchOrders = () => {
      setLoading(true);
      setError(null);
      console.log("Fetching orders for user:", user._id);

      if (!user || !user._id) {
        setError("User information not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Use the dedicated endpoint for received orders with cache-busting
      axios
        .get(`http://localhost:3001/api/orders/received/${user._id}`, {
          params: {
            _t: new Date().getTime(), // Add timestamp to prevent caching
            role: user.role // Send user role to help with filtering
          }
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            console.log(`Received ${res.data.length} orders`);

            // Check if we have any orders
            if (res.data.length === 0) {
              console.log("No orders found for this user");
            } else {
              // Log the first order for debugging
              const firstOrder = res.data[0];
              console.log("First order:", {
                id: firstOrder._id,
                orderId: firstOrder.orderId,
                createdAt: firstOrder.createdAt,
                items: firstOrder.items.length
              });
            }

            setOrders(res.data);
          } else {
            console.error("Invalid data format:", res.data);
            setError("Received invalid data format from server");
            setOrders([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching received orders:", err);
          setError(err.response?.data?.error || "Failed to fetch orders");
          setOrders([]);
        })
        .finally(() => setLoading(false));
    };

    if (user && user._id) {
      fetchOrders();
    } else {
      setError("User information not found. Please log in again.");
      setLoading(false);
    }
  }, [user?._id]);

  // The backend now returns only orders relevant to this user
  console.log(`Displaying ${orders.length} orders for user ${user?.firstName} ${user?.lastName} (${user?.role})`);

  // Debug: Log all orders and their items
  if (orders.length > 0) {
    console.log("All orders:", orders);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1} (${order.orderId || order._id}):`);
      console.log(`Total items: ${order.items ? order.items.length : 0}`);

      if (order.items && order.items.length > 0) {
        order.items.forEach((item, itemIndex) => {
          console.log(`  Item ${itemIndex + 1}:`, {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            listerId: item.listerId,
            listerRole: item.listerRole
          });
        });
      } else {
        console.log("  No items in this order");
      }
    });
  }

  // Only filter by status if needed
  const filteredOrders = filter === "all"
    ? orders
    : orders.filter(order => order.status === filter);

  // Calculate total revenue from all items in all orders
  const totalRevenue = orders.reduce((total, order) => {
    // Calculate subtotal for all items in each order
    const orderTotal = order.items.reduce((sum, item) => {
      // Ensure we have valid price and quantity values
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    return total + orderTotal;
  }, 0);

  // Log the total revenue for debugging
  console.log("Total revenue calculated:", totalRevenue);

  // Debug: Log each order's contribution to the total revenue
  if (orders.length > 0) {
    console.log("Revenue breakdown by order:");
    orders.forEach((order, index) => {
      const orderTotal = order.items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
      }, 0);

      console.log(`Order ${index + 1} (${order.orderId || order._id}): Rs. ${orderTotal.toFixed(2)}`);
    });
  }

  return (
    <div className="received-orders-page">
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
              <h3 className="revenue-amount">Rs. {totalRevenue ? totalRevenue.toFixed(2) : "0.00"}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-header">
          <div className="header-top">
            <h2>Customer Order Management</h2>
          </div>

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
        ) : error ? (
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p className="error-message">{error}</p>
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
                  <h4>Your Items in this order:</h4>
                  <ul className="items-list">
                    {/* Show only items that belong to the current user (already filtered by the server) */}
                    {order.items
                      .map((item) => (
                        <li key={item._id || `${item.name}-${item.price}`} className="item-card">
                          <div className="item-info">
                            <p className="item-name">
                              <FaTag className="icon" /> <strong>Item Name:</strong> {item.name || "Unknown Item"}
                            </p>
                            <div className="item-details">
                              <p><strong>Price:</strong> Rs. {(parseFloat(item.price) || 0).toFixed(2)}</p>
                              <p><strong>Quantity:</strong> {parseInt(item.quantity) || 0}</p>
                              <p className="item-total"><strong>Subtotal:</strong> Rs. {((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>

                  <div className="order-subtotal">
                    <p>
                      <FaShoppingBag className="icon" />
                      Your Items Total: Rs. {
                        order.items
                          .reduce((sum, item) => {
                            // Ensure we have valid price and quantity values
                            const price = parseFloat(item.price) || 0;
                            const quantity = parseInt(item.quantity) || 0;
                            return sum + (price * quantity);
                          }, 0)
                          .toFixed(2)
                      }
                    </p>
                  </div>
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
