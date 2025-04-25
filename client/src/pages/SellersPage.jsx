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
  FaRecycle,
  FaArrowRight,
  FaDollarSign,
  FaThermometerHalf
} from "react-icons/fa";
import "../styles/SellerPage.scss";

const SellersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0
  });
  const [showTraceability, setShowTraceability] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingTraceability, setEditingTraceability] = useState(false);
  const [traceabilityData, setTraceabilityData] = useState({
    supplier: {
      name: "Quality Suppliers Co.",
      location: "Western Province, Sri Lanka",
      manager: "Supply Chain Partners"
    },
    rawMaterials: {
      name: "Sunflower Seeds",
      origin: "Local Farms, Sri Lanka",
      supplier: "Sunshine Seeds Co."
    },
    growing: {
      name: "Sunflower Field",
      location: "Central Province, Sri Lanka",
      harvested: "3 days ago",
      grower: "Green Thumb Farms"
    },
    packaging: {
      name: "Eco-Friendly Packaging",
      material: "Recycled Paper",
      provider: "GreenWrap Solutions"
    }
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching products with token:", token);
        const res = await axios.get("http://localhost:3001/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Products data:", res.data);
        setProducts(res.data);
        setStats(prev => ({
          ...prev,
          productsCount: res.data.length,
          newProducts: res.data.filter(product => {
            const productDate = new Date(product.createdAt);
            const currentDate = new Date();
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            return productDate >= monthStart;
          }).length
        }));

        console.log("Products count updated:", res.data.length);
        return Promise.resolve(); // Ensure this function returns a promise
      } catch (err) {
        console.error("Error fetching products:", err);
        return Promise.reject(err); // Return rejected promise on error
      }
    };

    // Fetch orders summary with detailed stats
    const fetchOrdersSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const sellerId = user?._id;

        if (!sellerId) {
          console.error("Seller ID not found");
          return;
        }

        console.log("Fetching orders for seller ID:", sellerId);

        // Use the dedicated endpoint for received orders
        const ordersResponse = await axios.get(`http://localhost:3001/api/orders/received/${sellerId}`, {
          params: {
            role: "seller",
            _t: new Date().getTime() // Add timestamp to prevent caching
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Received orders response:", ordersResponse.data);

        if (ordersResponse.data && ordersResponse.data.length > 0) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          // Get start dates for current and previous month
          const currentMonthStart = new Date(currentYear, currentMonth, 1);
          const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);

          // These orders are already filtered for the current seller by the server
          const sellerOrders = ordersResponse.data;
          console.log(`Found ${sellerOrders.length} orders for this seller`);

          // Calculate current month and previous month metrics
          let currentMonthRevenue = 0;
          let previousMonthRevenue = 0;
          let currentMonthOrders = 0;
          let previousMonthOrders = 0;

          sellerOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            // Calculate total revenue from all items in this order (already filtered by server)
            const orderRevenue = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            console.log(`Order ${order.orderId || order._id} date: ${orderDate}, revenue: ${orderRevenue}`);

            if (orderDate >= currentMonthStart) {
              currentMonthRevenue += orderRevenue;
              currentMonthOrders++;
              console.log(`Added to current month: ${orderRevenue}`);
            } else if (orderDate >= previousMonthStart && orderDate < currentMonthStart) {
              previousMonthRevenue += orderRevenue;
              previousMonthOrders++;
              console.log(`Added to previous month: ${orderRevenue}`);
            }
          });

          // Calculate growth percentages
          const revenueGrowth = previousMonthRevenue === 0
            ? 100
            : Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);

          const ordersGrowth = previousMonthOrders === 0
            ? 100
            : Math.round(((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100);

          // Update stats with calculated values while preserving product count
          setStats(prev => ({
            ...prev,
            revenue: currentMonthRevenue,
            ordersCount: currentMonthOrders,
            revenueGrowth: revenueGrowth,
            ordersGrowth: ordersGrowth
          }));

          console.log("Updated seller stats:", {
            currentMonthRevenue,
            previousMonthRevenue,
            revenueGrowth,
            currentMonthOrders,
            previousMonthOrders,
            ordersGrowth
          });
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setStats(prev => ({
          ...prev,
          revenue: 0,
          ordersCount: 0,
          revenueGrowth: 0,
          ordersGrowth: 0
        }));
      }
    };

    // First fetch products, then fetch orders to ensure product count is set first
    fetchProducts().then(() => {
      fetchOrdersSummary();
    });
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editProduct) {
        setEditProduct({ ...editProduct, img: file });
      } else {
        setNewProduct({ ...newProduct, img: file });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new product to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("stock", newProduct.stock);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("img", newProduct.img);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  // Submit Edited Product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("stock", editProduct.stock);
    formData.append("price", editProduct.price);
    formData.append("description", editProduct.description);
    if (editProduct.img instanceof File) {
      formData.append("img", editProduct.img);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/products/edit/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditProduct(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Remove product
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/products/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Handle Card Click (Navigate to Product Details)
  // Add these handler functions before the return statement, after the handleCardClick function
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Add these functions inside the component
  const handleTraceabilityClick = (product) => {
    setSelectedProduct(product);
    setShowTraceability(true);
  };

  const handleCloseTraceability = () => {
    setShowTraceability(false);
  };

  // Add these missing functions
  const handleTraceabilityChange = (section, field, value) => {
    setTraceabilityData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveTraceabilityData = async () => {
    try {
      const token = localStorage.getItem("token");
      // You'll need to create this endpoint on your backend
      await axios.post(
        `http://localhost:3001/api/supply-chain/update/${selectedProduct._id}`,
        { traceabilityData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingTraceability(false);
      // Optional: Show success message
      alert("Supply chain data updated successfully!");
    } catch (error) {
      console.error("Error saving traceability data:", error);
      alert("Failed to update supply chain data. Please try again.");
    }
  };

  return (
    <div className="seller-dashboard">
      <Navbar />

      <div className="seller-dashboard__container">
        <div className="seller-dashboard__header">
          <h1>Seller Dashboard</h1>
          <div className="actions">
            <button onClick={() => {
              setEditProduct(null);
              setShowForm(true);
            }}>
              <FaPlus />
              Add Product
            </button>
            <button className="view-orders-btn" onClick={() => navigate("/recived/orders")}>
              <FaShoppingCart />
              View Orders
            </button>
          </div>
        </div>

        <div className="seller-dashboard__stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-value">Rs. {stats.revenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
            <div className={`stat-change ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FaChartLine /> {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth || 0}% from last month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <FaShoppingCart />
            </div>
            <div className="stat-value">{stats.ordersCount}</div>
            <div className="stat-label">Total Orders</div>
            <div className={`stat-change ${stats.ordersGrowth >= 0 ? 'positive' : 'negative'}`}>
              <FaChartLine /> {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth || 0}% from last month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <FaBoxOpen />
            </div>
            <div className="stat-value">{stats.productsCount}</div>
            <div className="stat-label">Products</div>
            <div className="stat-change positive">
              <FaChartLine /> +{stats.newProducts || 0} new this month
            </div>
          </div>
        </div>

        <div className="inventory-section">
          <h2>Manage Flower Inventory</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div
                className={`product-card ${product.stock === 0 ? 'sold-out' : ''}`}
                key={product._id}
                onClick={() => handleCardClick(product._id)}
              >
                {product.stock === 0 && <div className="sold-out">Sold Out</div>}
                <div className="product-image">
                  <img
                    src={`http://localhost:3001${product.img}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="stock">Stock: {product.stock} Bunches</p>
                  <p className="price">Rs. {product.price}</p>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(product);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="form-overlay">
            <div className="add-product-form">
              <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={editProduct ? handleEditSubmit : handleSubmit}>
                <div className="input-group">
                  <label>Product Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editProduct ? editProduct.name : newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={editProduct ? editProduct.stock : newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={
                      editProduct ? editProduct.description : newProduct.description
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Price (Rs.):</label>
                  <input
                    type="number"
                    name="price"
                    value={editProduct ? editProduct.price : newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>📷 Upload Image:</label>
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editProduct}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                  {editProduct && !imagePreview && (
                    <img
                      src={`http://localhost:3001${editProduct.img}`}
                      alt="Current"
                      className="image-preview"
                    />
                  )}
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    {editProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditProduct(null);
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

        {/* Traceability Modal - Simplified version */}
        {showTraceability && selectedProduct && (
          <div className="product-traceability-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Supply Chain: {selectedProduct.name}</h3>
                <div className="modal-actions">
                  {!editingTraceability ? (
                    <button
                      className="edit-traceability-btn"
                      onClick={() => setEditingTraceability(true)}
                    >
                      <FaEdit /> Edit Supply Chain
                    </button>
                  ) : (
                    <button
                      className="save-traceability-btn"
                      onClick={saveTraceabilityData}
                    >
                      Save Changes
                    </button>
                  )}
                  <button className="close-button" onClick={handleCloseTraceability}>×</button>
                </div>
              </div>
              <div className="modal-body">
                {/* Temperature Section - New */}
                <div className="journey-step">
                  <div className="step-icon">
                    <FaThermometerHalf />
                  </div>
                  <div className="step-content">
                    <h4>Temperature Monitoring</h4>
                    {!editingTraceability ? (
                      <div className="materials-list">
                        <div className="material-item">
                          <div className="temperature-gauge">
                            <div className="gauge-value">22°C</div>
                            <div className="gauge-range">
                              <span>Min: 18°C</span>
                              <span>Max: 25°C</span>
                            </div>
                          </div>
                          <div className="material-info">
                            <h5>Cold Storage Facility</h5>
                            <p>Current Status: Optimal</p>
                            <p>Last Updated: Today, 10:30 AM</p>
                            <div className="temperature-history">
                              <div className="history-bar">
                                <div className="history-point" style={{height: '60%'}} title="6 AM: 20°C"></div>
                                <div className="history-point" style={{height: '70%'}} title="8 AM: 21°C"></div>
                                <div className="history-point" style={{height: '75%'}} title="10 AM: 22°C"></div>
                                <div className="history-point" style={{height: '73%'}} title="12 PM: 21.5°C"></div>
                                <div className="history-point" style={{height: '70%'}} title="2 PM: 21°C"></div>
                              </div>
                              <div className="history-label">24-hour temperature history</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="edit-traceability-form">
                        <div className="form-group">
                          <label>Facility Name:</label>
                          <input
                            type="text"
                            value="Cold Storage Facility"
                          />
                        </div>
                        <div className="form-group">
                          <label>Min Temperature (°C):</label>
                          <input
                            type="number"
                            value="18"
                          />
                        </div>
                        <div className="form-group">
                          <label>Max Temperature (°C):</label>
                          <input
                            type="number"
                            value="25"
                          />
                        </div>
                        <div className="form-group">
                          <label>Current Temperature (°C):</label>
                          <input
                            type="number"
                            value="22"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Packaging Section - Kept */}
                <div className="journey-step">
                  <div className="step-icon">
                    <FaBox />
                  </div>
                  <div className="step-content">
                    <h4>Packaging</h4>
                    {!editingTraceability ? (
                      <div className="materials-list">
                        <div className="material-item">
                          <div className="material-info">
                            <h5>{traceabilityData.packaging?.name || "Eco-Friendly Packaging"}</h5>
                            <p>Material: {traceabilityData.packaging?.material || "Recycled Paper"}</p>
                            <div className="eco-badge">
                              <FaRecycle /> 100% Recyclable
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="edit-traceability-form">
                        <div className="form-group">
                          <label>Material:</label>
                          <input
                            type="text"
                            value={traceabilityData.packaging?.material || "Recycled Paper"}
                            onChange={(e) => handleTraceabilityChange('packaging', 'material', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Product Section - Kept */}
                <div className="journey-step">
                  <div className="step-icon">
                    <FaStore />
                  </div>
                  <div className="step-content">
                    <h4>Final Product</h4>
                    <div className="material-item">
                      <img
                        src={`http://localhost:3001${selectedProduct.img}`}
                        alt={selectedProduct.name}
                      />
                      <div>
                        <p><strong>{selectedProduct.name}</strong></p>
                        <p>Sold by: {user?.firstName || ''} {user?.lastName || ''}</p>
                        <p>Quality Checked:
                          {!editingTraceability ? (
                            <span className={selectedProduct.qualityChecked ? "status-yes" : "status-no"}>
                              {selectedProduct.qualityChecked ? "Yes" : "No"}
                            </span>
                          ) : (
                            <select
                              value={selectedProduct.qualityChecked}
                              onChange={(e) => {
                                const updatedProduct = { ...selectedProduct, qualityChecked: e.target.value === 'true' };
                                setSelectedProduct(updatedProduct);
                              }}
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          )}
                        </p>
                        <p>Date Added: {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                        <div className="carbon-footprint-selector">
                          <label>Carbon Footprint:</label>
                          {!editingTraceability ? (
                            <span className={`footprint-badge ${selectedProduct.carbonFootprint?.toLowerCase() || 'low'}`}>
                              {selectedProduct.carbonFootprint || 'Low'}
                            </span>
                          ) : (
                            <select
                              value={selectedProduct.carbonFootprint || 'Low'}
                              onChange={(e) => {
                                const updatedProduct = { ...selectedProduct, carbonFootprint: e.target.value };
                                setSelectedProduct(updatedProduct);
                              }}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SellersPage;
