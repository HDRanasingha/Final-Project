import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import SupplyChainAnalytics from "../component/SupplyChainAnalytics";
import "../styles/SupplyChainPage.scss";
import { FaBoxOpen, FaTruck, FaWarehouse, FaStore, FaUser } from "react-icons/fa";

const SupplyChainPage = () => {
  const [supplyChainData, setSupplyChainData] = useState({
    flowers: [],
    items: [],
    products: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState("overview"); // overview, product, order, analytics
  
  const user = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    // Check if view parameter is in URL
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam && ['overview', 'product', 'order', 'analytics'].includes(viewParam)) {
      setView(viewParam);
    }
    
    fetchSupplyChainData();
  }, [location]);

  const fetchSupplyChainData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [flowersRes, itemsRes, productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3001/api/flowers/all", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:3001/api/items/all", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:3001/api/products/all", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:3001/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSupplyChainData({
        flowers: flowersRes.data,
        items: itemsRes.data,
        products: productsRes.data,
        orders: ordersRes.data
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching supply chain data:", error);
      setError("Failed to load supply chain data. Please try again later.");
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setView("product");
  };

  const renderOverview = () => (
    <div className="supply-chain-overview">
      <h2>Supply Chain Overview</h2>
      
      <div className="supply-chain-stats">
        <div className="stat-card">
          <FaBoxOpen className="stat-icon" />
          <div className="stat-content">
            <h3>Flowers</h3>
            <p>{supplyChainData.flowers.length} varieties</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaWarehouse className="stat-icon" />
          <div className="stat-content">
            <h3>Supply Items</h3>
            <p>{supplyChainData.items.length} items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaStore className="stat-icon" />
          <div className="stat-content">
            <h3>Products</h3>
            <p>{supplyChainData.products.length} products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaTruck className="stat-icon" />
          <div className="stat-content">
            <h3>Orders</h3>
            <p>{supplyChainData.orders.length} orders</p>
          </div>
        </div>
      </div>
      
      <div className="supply-chain-flow">
        <h3>Supply Chain Flow</h3>
        <div className="flow-diagram">
          <div className="flow-step">
            <div className="flow-icon">
              <FaBoxOpen />
            </div>
            <p>Growers</p>
            <small>Produce flowers</small>
          </div>
          
          <div className="flow-arrow">→</div>
          
          <div className="flow-step">
            <div className="flow-icon">
              <FaWarehouse />
            </div>
            <p>Suppliers</p>
            <small>Provide materials</small>
          </div>
          
          <div className="flow-arrow">→</div>
          
          <div className="flow-step">
            <div className="flow-icon">
              <FaStore />
            </div>
            <p>Sellers</p>
            <small>Create products</small>
          </div>
          
          <div className="flow-arrow">→</div>
          
          <div className="flow-step">
            <div className="flow-icon">
              <FaUser />
            </div>
            <p>Customers</p>
            <small>Purchase products</small>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Orders</h3>
        <div className="orders-list">
          {supplyChainData.orders.slice(0, 5).map(order => (
            <div key={order._id} className="order-item" onClick={() => setView("order")}>
              <p><strong>Order #{order.orderId}</strong></p>
              <p>Status: {order.status}</p>
              <p>Total: Rs. {order.total.toFixed(2)}</p>
              <p>Items: {order.items.length}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="product-traceability">
        <h3>Product Traceability</h3>
        <p>Select a product to view its complete supply chain journey:</p>
        
        <div className="products-grid">
          {supplyChainData.products.slice(0, 8).map(product => (
            <div 
              key={product._id} 
              className="product-card"
              onClick={() => handleProductSelect(product)}
            >
              <img 
                src={`http://localhost:3001${product.img}`} 
                alt={product.name} 
              />
              <h4>{product.name}</h4>
              <p>Rs. {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductView = () => {
    if (!selectedProduct) return null;
    
    // Find related flowers and items that might be used in this product
    // This is a simplified example - in a real app, you'd have proper relationships
    const relatedFlowers = supplyChainData.flowers.slice(0, 3);
    const relatedItems = supplyChainData.items.slice(0, 2);
    
    return (
      <div className="product-traceability-view">
        <button className="back-button" onClick={() => setView("overview")}>
          ← Back to Overview
        </button>
        
        <h2>Supply Chain: {selectedProduct.name}</h2>
        
        <div className="product-details">
          <img 
            src={`http://localhost:3001${selectedProduct.img}`} 
            alt={selectedProduct.name} 
            className="product-image"
          />
          
          <div className="product-info">
            <h3>{selectedProduct.name}</h3>
            <p><strong>Price:</strong> Rs. {selectedProduct.price}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock} units</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
          </div>
        </div>
        
        <div className="supply-chain-journey">
          <h3>Supply Chain Journey</h3>
          
          <div className="journey-timeline">
            <div className="journey-step">
              <div className="step-icon">
                <FaBoxOpen />
              </div>
              <div className="step-content">
                <h4>Raw Materials (Flowers)</h4>
                <div className="materials-list">
                  {relatedFlowers.map(flower => (
                    <div key={flower._id} className="material-item">
                      <img 
                        src={`http://localhost:3001${flower.img}`} 
                        alt={flower.name} 
                      />
                      <div>
                        <p><strong>{flower.name}</strong></p>
                        <p>Grown by: {flower.growerId?.firstName || "Unknown Grower"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="journey-step">
              <div className="step-icon">
                <FaWarehouse />
              </div>
              <div className="step-content">
                <h4>Supplies & Packaging</h4>
                <div className="materials-list">
                  {relatedItems.map(item => (
                    <div key={item._id} className="material-item">
                      <img 
                        src={`http://localhost:3001${item.img}`} 
                        alt={item.name} 
                      />
                      <div>
                        <p><strong>{item.name}</strong></p>
                        <p>Supplied by: {item.supplierId?.firstName || "Unknown Supplier"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
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
                    <p>Created by: {selectedProduct.sellerId?.firstName || "Unknown Seller"}</p>
                    <p>Quality Checked: Yes</p>
                    <p>Date Added: {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="journey-step">
              <div className="step-icon">
                <FaTruck />
              </div>
              <div className="step-content">
                <h4>Distribution</h4>
                <p>This product is available for shipping nationwide.</p>
                <p>Average delivery time: 2-3 business days</p>
                <p>Packaging: Eco-friendly materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderView = () => (
    <div className="order-tracking-view">
      <button className="back-button" onClick={() => setView("overview")}>
        ← Back to Overview
      </button>
      
      <h2>Order Tracking</h2>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {supplyChainData.orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.customer?.name || "Unknown"}</td>
                <td>{order.items.length} items</td>
                <td>Rs. {order.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="supply-chain-page">
      <Navbar />
      
      <div className="supply-chain-container">
        <h1>Integrated Supply Chain Visibility</h1>
        
        <div className="view-selector">
          <button 
            className={view === "overview" ? "active" : ""}
            onClick={() => setView("overview")}
          >
            Overview
          </button>
          <button 
            className={view === "order" ? "active" : ""}
            onClick={() => setView("order")}
          >
            Order Tracking
          </button>
          {user && user.role === 'admin' && (
            <button 
              className={view === "analytics" ? "active" : ""}
              onClick={() => setView("analytics")}
            >
              SC Analytics
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="loading">Loading supply chain data...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {view === "overview" && renderOverview()}
            {view === "product" && renderProductView()}
            {view === "order" && renderOrderView()}
            {view === "analytics" && user && user.role === 'admin' && <SupplyChainAnalytics />}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SupplyChainPage;