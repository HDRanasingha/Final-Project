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
import "../styles/Growers.scss";

const GrowersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [newFlower, setNewFlower] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editFlower, setEditFlower] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    flowersCount: 0
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Fetch flowers from backend
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/flowers/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlowers(res.data);
        setStats(prev => ({ 
          ...prev, 
          flowersCount: res.data.length,
          newFlowers: res.data.filter(flower => {
            const flowerDate = new Date(flower.createdAt);
            const currentDate = new Date();
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            return flowerDate >= monthStart;
          }).length
        }));
      } catch (err) {
        console.error("Error fetching flowers:", err);
      }
    };

    // Fetch orders summary with detailed stats
    const fetchOrdersSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const growerId = user?._id;
        
        if (!growerId) {
          console.error("Grower ID not found");
          return;
        }
        
        // Fetch all orders
        const ordersResponse = await axios.get("http://localhost:3001/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (ordersResponse.data && ordersResponse.data.length > 0) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // Get start dates for current and previous month
          const currentMonthStart = new Date(currentYear, currentMonth, 1);
          const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
          
          // Filter orders for current grower
          const growerOrders = ordersResponse.data.filter(order => 
            order.items && order.items.some(item => item.listerId === growerId)
          );
          
          // Calculate current month and previous month metrics
          let currentMonthRevenue = 0;
          let previousMonthRevenue = 0;
          let currentMonthOrders = 0;
          let previousMonthOrders = 0;
          
          growerOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const orderRevenue = order.items
              .filter(item => item.listerId === growerId)
              .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (orderDate >= currentMonthStart) {
              currentMonthRevenue += orderRevenue;
              currentMonthOrders++;
            } else if (orderDate >= previousMonthStart && orderDate < currentMonthStart) {
              previousMonthRevenue += orderRevenue;
              previousMonthOrders++;
            }
          });
          
          // Calculate percentage changes
          const revenueChange = previousMonthRevenue === 0 
            ? 100 
            : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
          
          const ordersChange = previousMonthOrders === 0 
            ? 100 
            : ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;
          
          // Update stats state
          setStats(prev => ({
            ...prev,
            revenue: currentMonthRevenue,
            revenueChange: revenueChange.toFixed(2),
            ordersCount: currentMonthOrders,
            ordersChange: ordersChange.toFixed(2),
            totalOrders: growerOrders.length
          }));
        }
      } catch (err) {
        console.error("Error fetching orders summary:", err);
      }
    };

    fetchFlowers();
    fetchOrdersSummary();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editFlower) {
      setEditFlower({ ...editFlower, [name]: value });
    } else {
      setNewFlower({ ...newFlower, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editFlower) {
        setEditFlower({ ...editFlower, img: file });
      } else {
        setNewFlower({ ...newFlower, img: file });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new flower to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newFlower.name);
    formData.append("stock", newFlower.stock);
    formData.append("price", newFlower.price);
    formData.append("description", newFlower.description);
    formData.append("img", newFlower.img);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/flowers/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding flower:", error);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (flower) => {
    setEditFlower(flower);
    setShowForm(true);
  };

  // Submit Edited Flower
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editFlower.name);
    formData.append("stock", editFlower.stock);
    formData.append("price", editFlower.price);
    formData.append("description", editFlower.description);
    if (editFlower.img instanceof File) {
      formData.append("img", editFlower.img);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/flowers/edit/${editFlower._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditFlower(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating flower:", error);
    }
  };

  // Remove flower
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this flower?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/flowers/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlowers(flowers.filter((flower) => flower._id !== id));
      } catch (error) {
        console.error("Error deleting flower:", error);
      }
    }
  };

  // Handle Card Click (Navigate to Flower Details)
  const handleCardClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };

  return (
    <div className="seller-dashboard">
      <Navbar />
      
      <div className="seller-dashboard__container">
        <div className="seller-dashboard__header">
          <h1>Grower Dashboard</h1>
          <div className="actions">
            <button onClick={() => {
              setEditFlower(null);
              setShowForm(true);
            }}>
              <FaPlus /> Add New Flower
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
              <FaSeedling />
            </div>
            <div className="stat-value">{stats.flowersCount || 0}</div>
            <div className="stat-label">Total Flowers</div>
            {stats.newFlowers && (
              <div className="stat-change positive">
                +{stats.newFlowers} new this month
              </div>
            )}
          </div>
        </div>
        
        <div className="seller-dashboard__products">
          <h2>Manage Your Flowers</h2>
          
          <div className="products-grid">
            {flowers.map((flower) => (
              <div className="product-card" key={flower._id}>
                {flower.stock === 0 && <div className="sold-out-badge">Sold Out</div>}
                <div className="product-image" onClick={() => handleCardClick(flower._id)}>
                  <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
                </div>
                <div className="product-info">
                  <h3>{flower.name}</h3>
                  <p className="product-price">Rs. {flower.price}</p>
                  <p className="product-stock">Stock: {flower.stock} Bunches</p>
                </div>
                <div className="product-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(flower)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleRemove(flower._id)}>
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add/Edit Flower Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editFlower ? "Edit Flower" : "Add New Flower"}</h2>
            <form onSubmit={editFlower ? handleEditSubmit : handleSubmit}>
              <div className="form-group">
                <label>Flower Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFlower ? editFlower.name : newFlower.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Stock (Bunches)</label>
                <input
                  type="number"
                  name="stock"
                  value={editFlower ? editFlower.stock : newFlower.stock}
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
                  value={editFlower ? editFlower.price : newFlower.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editFlower ? editFlower.description : newFlower.description}
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
                  required={!editFlower}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editFlower && !imagePreview && (
                  <div className="image-preview">
                    <img src={`http://localhost:3001${editFlower.img}`} alt="Current" />
                    <p>Current image (upload a new one to change)</p>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editFlower ? "Update Flower" : "Add Flower"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditFlower(null);
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

export default GrowersPage;