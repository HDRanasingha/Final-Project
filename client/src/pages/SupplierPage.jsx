import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaChartLine, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaUsers, 
  FaSeedling, 
  FaLeaf, 
  FaBox, 
  FaStore, 
  FaTruck,
  FaDollarSign
} from "react-icons/fa";
import "../styles/supplier.scss";

const SupplierPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    itemsCount: 0
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/items/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data);
        setStats(prev => ({ 
          ...prev, 
          itemsCount: res.data.length,
          newItems: res.data.filter(item => {
            const itemDate = new Date(item.createdAt);
            const currentDate = new Date();
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            return itemDate >= monthStart;
          }).length
        }));
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    // Fetch orders summary with detailed stats
    const fetchOrdersSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        const supplierId = userData?._id;
        
        if (!supplierId) {
          console.error("Supplier ID not found");
          return;
        }
        
        console.log("Current supplier ID:", supplierId);
        
        // Fetch all orders
        const ordersResponse = await axios.get("http://localhost:3001/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (ordersResponse.data && ordersResponse.data.length > 0) {
          console.log("Total orders fetched:", ordersResponse.data.length);
          
          // Filter orders for current supplier
          // Based on the Order model, we need to check items.listerId
          const supplierOrders = ordersResponse.data.filter(order => {
            return order.items && order.items.some(item => {
              // Check if listerId matches supplierId (could be string or object)
              if (typeof item.listerId === 'object') {
                return item.listerId?._id === supplierId;
              } else {
                return item.listerId === supplierId;
              }
            });
          });
          
          console.log("Filtered supplier orders:", supplierOrders.length);
          
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // Get start dates for current and previous month
          const currentMonthStart = new Date(currentYear, currentMonth, 1);
          const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
          
          // Calculate current month and previous month metrics
          let currentMonthRevenue = 0;
          let previousMonthRevenue = 0;
          let currentMonthOrders = 0;
          let previousMonthOrders = 0;
          
          supplierOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            
            // Calculate revenue only from items belonging to this supplier
            const orderRevenue = order.items
              .filter(item => {
                if (typeof item.listerId === 'object') {
                  return item.listerId?._id === supplierId;
                } else {
                  return item.listerId === supplierId;
                }
              })
              .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            console.log(`Order ${order.orderId} date:`, orderDate);
            console.log(`Order ${order.orderId} revenue for this supplier:`, orderRevenue);
            
            if (orderDate >= currentMonthStart) {
              currentMonthRevenue += orderRevenue;
              currentMonthOrders++;
              console.log("Added to current month");
            } else if (orderDate >= previousMonthStart && orderDate < currentMonthStart) {
              previousMonthRevenue += orderRevenue;
              previousMonthOrders++;
              console.log("Added to previous month");
            }
          });
          
          console.log("Current month revenue:", currentMonthRevenue);
          console.log("Previous month revenue:", previousMonthRevenue);
          console.log("Current month orders:", currentMonthOrders);
          console.log("Previous month orders:", previousMonthOrders);
          
          // Calculate percentage changes with proper handling for zero values
          let revenueChange = 0;
          if (previousMonthRevenue === 0) {
            revenueChange = currentMonthRevenue > 0 ? 100 : 0;
          } else {
            revenueChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          }
          
          let ordersChange = 0;
          if (previousMonthOrders === 0) {
            ordersChange = currentMonthOrders > 0 ? 100 : 0;
          } else {
            ordersChange = ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;
          }
          
          // Update stats state
          setStats(prev => ({
            ...prev,
            revenue: currentMonthRevenue,
            revenueChange: revenueChange.toFixed(2),
            ordersCount: currentMonthOrders,
            ordersChange: ordersChange.toFixed(2),
            totalOrders: supplierOrders.length
          }));
        } else {
          console.log("No orders found");
        }
      } catch (error) {
        console.error("Error fetching orders summary:", error);
      }
    };

    fetchItems();
    fetchOrdersSummary();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem({ ...editItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editItem) {
        setEditItem({ ...editItem, img: file });
      } else {
        setNewItem({ ...newItem, img: file });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new item to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("stock", newItem.stock);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    formData.append("img", newItem.img);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/items/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  // Submit Edited Item
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editItem.name);
    formData.append("stock", editItem.stock);
    formData.append("price", editItem.price);
    formData.append("description", editItem.description);
    if (editItem.img instanceof File) {
      formData.append("img", editItem.img);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/items/edit/${editItem._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditItem(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Remove item
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/items/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(items.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Handle Card Click (Navigate to Item Details)
  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="seller-dashboard">
      <Navbar />
      
      <div className="seller-dashboard__container">
        <div className="seller-dashboard__header">
          <h1>Supplier Dashboard</h1>
          <div className="actions">
            <button onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}>
              <FaPlus /> Add New Item
            </button>
            <button className="view-orders-btn" onClick={() => navigate("/recived/orders")}>
              <FaShoppingCart /> View Orders
            </button>
          </div>
        </div>
        
        <div className="seller-dashboard__stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-value">Rs. {stats.revenue?.toLocaleString() || 0}</div>
            <div className="stat-label">Monthly Revenue</div>
            {stats.revenueChange && (
              <div className={`stat-change ${parseFloat(stats.revenueChange) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(stats.revenueChange) >= 0 ? '+' : ''}{stats.revenueChange}% from last month
              </div>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon orders">
              <FaShoppingCart />
            </div>
            <div className="stat-value">{stats.ordersCount || 0}</div>
            <div className="stat-label">Monthly Orders</div>
            {stats.ordersChange && (
              <div className={`stat-change ${parseFloat(stats.ordersChange) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(stats.ordersChange) >= 0 ? '+' : ''}{stats.ordersChange}% from last month
              </div>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon products">
              <FaBox />
            </div>
            <div className="stat-value">{stats.itemsCount || 0}</div>
            <div className="stat-label">Total Items</div>
            {stats.newItems && (
              <div className="stat-change positive">
                +{stats.newItems} new this month
              </div>
            )}
          </div>
        </div>
        
        <div className="seller-dashboard__products">
          <h2>Manage Your Items</h2>
          
          <div className="products-grid">
            {items.map((item) => (
              <div className="product-card" key={item._id}>
                {item.stock === 0 && <div className="sold-out-badge">Sold Out</div>}
                <div className="product-image" onClick={() => handleCardClick(item._id)}>
                  <img src={`http://localhost:3001${item.img}`} alt={item.name} />
                </div>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p className="product-price">Rs. {item.price}</p>
                  <p className="product-stock">Stock: {item.stock} Bunches</p>
                </div>
                <div className="product-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleRemove(item._id)}>
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add/Edit Item Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={editItem ? handleEditSubmit : handleSubmit}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={editItem ? editItem.name : newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Stock (Bunches)</label>
                <input
                  type="number"
                  name="stock"
                  value={editItem ? editItem.stock : newItem.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={editItem ? editItem.price : newItem.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editItem ? editItem.description : newItem.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  name="img"
                  onChange={handleImageChange}
                  accept="image/*"
                  required={!editItem}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editItem && !imagePreview && (
                  <div className="image-preview">
                    <img src={`http://localhost:3001${editItem.img}`} alt="Current" />
                    <p>Current image (upload a new one to change)</p>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditItem(null);
                    setImagePreview("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default SupplierPage;