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
  PointElement,
} from 'chart.js';
import { 
  FaUsers, 
  FaChartBar, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaTachometerAlt
} from 'react-icons/fa';
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/AdminPage.scss";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const barChartData = {
    labels: topSellers.map((item) => item._id),
    datasets: [
      {
        label: "Quantity Sold",
        data: topSellers.map((item) => item.totalQuantity),
        backgroundColor: "rgba(53, 162, 235, 0.6)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
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
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Item Name',
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Quantity Sold',
        },
        beginAtZero: true
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
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'User Roles Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
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
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const orderStatusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const totalIncomeChartData = {
    labels: monthlyIncome.map((income) => monthNames[income._id - 1]),
    datasets: [
      {
        label: 'Monthly Income',
        data: monthlyIncome.map((income) => income.totalIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
        text: 'Monthly Income',
        font: {
          size: 16,
          weight: 'bold'
        }
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
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  // Summary stats for dashboard
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = monthlyIncome.reduce((sum, month) => sum + month.totalIncome, 0);
  const pendingOrders = orders.filter(order => order.status === 'Processing').length;

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <ul className="sidebar-menu">
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt /> Dashboard
            </li>
            <li 
              className={activeTab === 'users' ? 'active' : ''} 
              onClick={() => setActiveTab('users')}
            >
              <FaUsers /> User Management
            </li>
            <li 
              className={activeTab === 'orders' ? 'active' : ''} 
              onClick={() => setActiveTab('orders')}
            >
              <FaShoppingCart /> Orders
            </li>
            <li 
              className={activeTab === 'analytics' ? 'active' : ''} 
              onClick={() => setActiveTab('analytics')}
            >
              <FaChartBar /> Analytics
            </li>
          </ul>
        </div>

        <div className="dashboard-content">
          <div className="content-header">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
            </h1>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-icon users">
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <h3>Total Users</h3>
                    <p>{totalUsers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orders">
                    <FaShoppingCart />
                  </div>
                  <div className="stat-details">
                    <h3>Total Orders</h3>
                    <p>{totalOrders}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <FaMoneyBillWave />
                  </div>
                  <div className="stat-details">
                    <h3>Total Revenue</h3>
                    <p>Rs. {totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <FaShoppingCart />
                  </div>
                  <div className="stat-details">
                    <h3>Pending Orders</h3>
                    <p>{pendingOrders}</p>
                  </div>
                </div>
              </div>

              <div className="chart-row">
                <div className="chart-container">
                  <h2>Monthly Income</h2>
                  <Bar data={totalIncomeChartData} options={totalIncomeChartOptions} />
                </div>
                <div className="chart-container">
                  <h2>Order Status</h2>
                  <Pie data={orderStatusChartData} options={orderStatusChartOptions} />
                </div>
              </div>

              <div className="chart-row">
                <div className="chart-container">
                  <h2>Top Selling Items</h2>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="chart-container">
                  <h2>User Distribution</h2>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-management">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="actions">
                          <button className="action-btn edit" onClick={() => handleEditClick(user)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="action-btn delete" onClick={() => handleRemove(user._id)}>
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showForm && (
                <div className="modal-overlay">
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
                        <button type="submit" className="btn-save">Update</button>
                        <button
                          type="button"
                          className="btn-cancel"
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-management">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderId || order._id}</td>
                        <td>{order.customer?.name || "Unknown"}</td>
                        <td>
                          <span className={`status-badge ${order.status?.toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Received Warehouse">Received Warehouse</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-details">
                {filteredOrders.length > 0 && (
                  <div className="order-items-list">
                    <h3>Order Items</h3>
                    <div className="order-items-container">
                      {filteredOrders.flatMap(order => 
                        order.items.map(item => (
                          <div className="order-item-card" key={`${order._id}-${item._id}`}>
                            <h4>{item.name}</h4>
                            <p>Price: Rs. {item.price.toFixed(2)}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Total: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            <p>Order ID: {order.orderId || order._id}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-dashboard">
              <div className="chart-row">
                <div className="chart-container full-width">
                  <h2>Monthly Income Trend</h2>
                  <Bar data={totalIncomeChartData} options={totalIncomeChartOptions} />
                </div>
              </div>
              
              <div className="chart-row">
                <div className="chart-container">
                  <h2>Top Selling Items</h2>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="chart-container">
                  <h2>Order Status Distribution</h2>
                  <Pie data={orderStatusChartData} options={orderStatusChartOptions} />
                </div>
              </div>
              
              <div className="chart-row">
                <div className="chart-container">
                  <h2>User Roles Distribution</h2>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="chart-container">
                  <div className="stats-summary">
                    <h2>Summary Statistics</h2>
                    <div className="summary-items">
                      <div className="summary-item">
                        <h3>Total Users</h3>
                        <p>{totalUsers}</p>
                      </div>
                      <div className="summary-item">
                        <h3>Total Orders</h3>
                        <p>{totalOrders}</p>
                      </div>
                      <div className="summary-item">
                        <h3>Total Revenue</h3>
                        <p>Rs. {totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="summary-item">
                        <h3>Pending Orders</h3>
                        <p>{pendingOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;