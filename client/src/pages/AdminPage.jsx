import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/AdminPage.scss";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [topSellers, setTopSellers] = useState([]);

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
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTopSellers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders/top-selling");
        setTopSellers(res.data);
      } catch (err) {
        console.error("Error fetching top-selling items:", err);
      }
    };

    fetchUsers();
    fetchTopSellers();
  }, []);

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

        <div className="top-sellers">
          <h2>Top Selling Items</h2>
          <ul>
            {topSellers.map((item) => (
              <li key={item._id}>
                <p>Item Name: {item._id}</p>
                <p>Total Quantity Sold: {item.totalQuantity}</p>
                <p>Total Revenue: Rs. {item.totalRevenue.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;