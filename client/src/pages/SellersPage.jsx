import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../styles/SellerPage.scss";
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
  // Add these state variables near your other useState declarations
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
      } catch (err) {
        console.error("Error fetching products:", err);
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
          
          // Filter orders for current seller
          const sellerOrders = ordersResponse.data.filter(order => 
            order.items && order.items.some(item => item.listerId === sellerId)
          );
          
          // Calculate current month and previous month metrics
          let currentMonthRevenue = 0;
          let previousMonthRevenue = 0;
          let currentMonthOrders = 0;
          let previousMonthOrders = 0;
          
          sellerOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const orderRevenue = order.items
              .filter(item => item.listerId === sellerId)
              .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (orderDate >= currentMonthStart) {
              currentMonthRevenue += orderRevenue;
              currentMonthOrders++;
            } else if (orderDate >= previousMonthStart && orderDate < currentMonthStart) {
              previousMonthRevenue += orderRevenue;
              previousMonthOrders++;
            }
          });
          
          // Calculate growth percentages
          const revenueGrowth = previousMonthRevenue === 0 
            ? 100 
            : Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);
          
          const ordersGrowth = previousMonthOrders === 0 
            ? 100 
            : Math.round(((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100);
          
          // Update stats with calculated values
          setStats({
            revenue: currentMonthRevenue,
            ordersCount: currentMonthOrders,
            productsCount: products.length,
            revenueGrowth: revenueGrowth,
            ordersGrowth: ordersGrowth,
            newProducts: 0
          });
          
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

    fetchProducts();
    fetchOrdersSummary();
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

        {/* Supply Chain Section - Moved inside the component return */}
        <div className="supply-chain-section">
          <h2>
            Supply Chain Visibility
            <a href="#" onClick={(e) => {
              e.preventDefault();
              navigate("/supply-chain");
            }}>View All</a>
          </h2>
          
          <div className="supply-chain-overview">
            <div className="chain-step">
              <div className="step-icon">
                <FaSeedling />
              </div>
              <div className="step-info">
                <h4>Raw Materials</h4>
                <small>Sourced from local farms</small>
              </div>
            </div>
            
            <div className="flow-arrow">
              <FaArrowRight />
            </div>
            
            <div className="chain-step">
              <div className="step-icon">
                <FaLeaf />
              </div>
              <div className="step-info">
                <h4>Growers</h4>
                <small>Sustainable farming</small>
              </div>
            </div>
            
            <div className="flow-arrow">
              <FaArrowRight />
            </div>
            
            <div className="chain-step">
              <div className="step-icon">
                <FaBox />
              </div>
              <div className="step-info">
                <h4>Packaging</h4>
                <small>Eco-friendly materials</small>
              </div>
            </div>
            
            <div className="flow-arrow">
              <FaArrowRight />
            </div>
            
            <div className="chain-step">
              <div className="step-icon">
                <FaStore />
              </div>
              <div className="step-info">
                <h4>Your Store</h4>
                <small>Ready for customers</small>
              </div>
            </div>
          </div>
          
          <div className="product-grid">
            {products.slice(0, 3).map((product) => (
              <div
                className="product-card"
                key={`trace-${product._id}`}
                onClick={() => handleTraceabilityClick(product)}
              >
                <div className="product-image">
                  <img
                    src={`http://localhost:3001${product.img}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="stock">View complete supply chain</p>
                  <button className="trace-btn">
                    View Traceability
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sustainability-info">
            <div className="sustainability-card">
              <h4>Carbon Footprint</h4>
              <p>Low - locally sourced materials</p>
            </div>
            <div className="sustainability-card">
              <h4>Water Usage</h4>
              <p>Optimized irrigation systems</p>
            </div>
            <div className="sustainability-card">
              <h4>Packaging</h4>
              <p>Recyclable materials</p>
            </div>
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
                          <img src="/assets/ecofriendlly.jpg" alt="Eco Packaging" />
                          <div className="material-info">
                            <h5>{traceabilityData.packaging?.name || "Eco-Friendly Packaging"}</h5>
                            <p>Material: {traceabilityData.packaging?.material || "Recycled Paper"}</p>
                            <div className="supplier-info">
                              <div className="supplier-icon">
                                <FaUsers />
                              </div>
                              Provided by: {traceabilityData.packaging?.provider || "GreenWrap Solutions"}
                            </div>
                            <div className="eco-badge">
                              <FaRecycle /> 100% Recyclable
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="edit-traceability-form">
                        <div className="form-group">
                          <label>Packaging Name:</label>
                          <input 
                            type="text" 
                            value={traceabilityData.packaging?.name || "Eco-Friendly Packaging"}
                            onChange={(e) => handleTraceabilityChange('packaging', 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Material:</label>
                          <input 
                            type="text" 
                            value={traceabilityData.packaging?.material || "Recycled Paper"}
                            onChange={(e) => handleTraceabilityChange('packaging', 'material', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Provider:</label>
                          <input 
                            type="text" 
                            value={traceabilityData.packaging?.provider || "GreenWrap Solutions"}
                            onChange={(e) => handleTraceabilityChange('packaging', 'provider', e.target.value)}
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
                    <div className="materials-list">
                      <div className="material-item">
                        <img 
                          src={`http://localhost:3001${selectedProduct.img}`} 
                          alt={selectedProduct.name} 
                        />
                        <div className="material-info">
                          <h5>{selectedProduct.name}</h5>
                          <p>Price: Rs. {selectedProduct.price}</p>
                          <p>Stock: {selectedProduct.stock} units</p>
                          <div className="supplier-info">
                            <div className="supplier-icon">
                              <FaStore />
                            </div>
                            Sold by: Your Flower Shop
                          </div>
                          <div className="carbon-footprint">
                            <div className="carbon-icon">
                              <FaLeaf />
                            </div>
                            Carbon Footprint: Low
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add a footer with sustainability information - Simplified */}
              <div className="modal-footer">
                <div className="sustainability-metrics">
                  <div className="metric">
                    <div className="metric-icon">
                      <FaRecycle />
                    </div>
                    <div className="metric-info">
                      <h5>Recyclable Packaging</h5>
                      <p>100% recyclable materials used</p>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-icon">
                      <FaLeaf />
                    </div>
                    <div className="metric-info">
                      <h5>Carbon Footprint</h5>
                      <p>30% lower than industry average</p>
                    </div>
                  </div>
                </div>
                <div className="traceability-actions">
                  <button className="print-btn" onClick={() => window.print()}>
                    Print Traceability Report
                  </button>
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
