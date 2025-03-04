import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/AdminPage.scss";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [topSellers, setTopSellers] = useState([]);
  const [userRoles, setUserRoles] = useState({ growers: 0, suppliers: 0, sellers: 0 });
  const [orderStatuses, setOrderStatuses] = useState({ processing: 0, shipped: 0, delivered: 0, cancelled: 0, receivedWarehouse: 0 });
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
        categorizeUserRoles(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTopSellers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders/top-sellers");
        setTopSellers(res.data);
      } catch (err) {
        console.error("Error fetching top-selling items:", err);
      }
    };

    const fetchOrderStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders/statuses");
        setOrderStatuses(res.data);
      } catch (err) {
        console.error("Error fetching order statuses:", err);
      }
    };

    const fetchMonthlyIncome = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders/total-income");
        setMonthlyIncome(res.data);
      } catch (err) {
        console.error("Error fetching total income:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchUsers();
    fetchTopSellers();
    fetchOrderStatuses();
    fetchMonthlyIncome();
    fetchOrders();
  }, []);

  const categorizeUserRoles = (users) => {
    const roles = { growers: 0, suppliers: 0, sellers: 0 };
    users.forEach(user => {
      if (user.role === 'grower') roles.growers++;
      if (user.role === 'supplier') roles.suppliers++;
      if (user.role === 'seller') roles.sellers++;
    });
    setUserRoles(roles);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/users/${editUser._id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditUser(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/orders/${orderId}/status`, { status: newStatus });
      const updatedOrder = response.data.order;
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.orderId === orderId ? updatedOrder : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const barChartData = {
    labels: topSellers.map((item) => item._id),
    datasets: [
      {
        label: "Quantity Sold",
        data: topSellers.map((item) => item.totalQuantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Items',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Item Name',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Quantity Sold',
        },
      },
    },
  };

  const pieChartData = {
    labels: ['Growers', 'Suppliers', 'Sellers'],
    datasets: [
      {
        label: 'User Roles',
        data: [userRoles.growers, userRoles.suppliers, userRoles.sellers],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Roles Distribution',
      },
    },
  };

  const orderStatusChartData = {
    labels: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Received Warehouse'],
    datasets: [
      {
        label: 'Order Statuses',
        data: [
          orderStatuses.processing,
          orderStatuses.shipped,
          orderStatuses.delivered,
          orderStatuses.cancelled,
          orderStatuses.receivedWarehouse
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
      },
    ],
  };

  const orderStatusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
      },
    },
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const totalIncomeChartData = {
    labels: monthlyIncome.map((income) => monthNames[income._id - 1]),
    datasets: [
      {
        label: 'Total Income',
        data: monthlyIncome.map((income) => income.totalIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const totalIncomeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expected Income',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Income (Rs.)',
        },
      },
    },
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <div className="user-list">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <button className="edit-btn" onClick={() => handleEditClick(user)}>Edit</button>
              <button className="remove-btn" onClick={() => handleRemove(user._id)}>Remove</button>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="edit-user-form">
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="input-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={editUser.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editUser.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={editUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="supplier">Supplier</option>
                  <option value="grower">Grower</option>
                  <option value="seller">Seller</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">Update</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="top-sellers-chart">
          <h2>Top Selling Items</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        <div className="user-roles-chart">
          <h2>User Roles Distribution</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        <div className="order-status-chart">
          <h2>Order Status Distribution</h2>
          <Pie data={orderStatusChartData} options={orderStatusChartOptions} />
        </div>

        <div className="total-income-chart">
          <h2>Expected Income</h2>
          <Bar data={totalIncomeChartData} options={totalIncomeChartOptions} />
        </div>

        <div className="orders-list">
          <h2>Orders</h2>
          {orders.length > 0 ? (
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order._id} className="order-card">
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
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Received Warehouse">Received Warehouse</option>
                  </select>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;