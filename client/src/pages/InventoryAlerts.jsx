import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/InventoryAlerts.scss";

const InventoryAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in or not the right role
    if (!user || !['grower', 'seller', 'supplier', 'admin'].includes(user.role)) {
      navigate('/');
      return;
    }
    
    fetchAlerts();
  }, [user, navigate]);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/inventory/low-stock', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Filter alerts based on user role
      let filteredAlerts = [];
      if (user.role === 'grower') {
        filteredAlerts = response.data.filter(item => item.type === 'flower' && item.growerId?._id === user._id);
      } else if (user.role === 'seller') {
        filteredAlerts = response.data.filter(item => item.type === 'product' && item.sellerId?._id === user._id);
      } else if (user.role === 'supplier') {
        filteredAlerts = response.data.filter(item => item.type === 'item' && item.supplierId?._id === user._id);
      } else if (user.role === 'admin') {
        filteredAlerts = response.data; // Admin sees all alerts
      }
      
      setAlerts(filteredAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      setError('Failed to load inventory alerts. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleSendEmails = async () => {
    try {
      setSendingEmails(true);
      await axios.post('http://localhost:3001/api/inventory/send-alerts', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmailSent(true);
      setSendingEmails(false);
      
      // Reset email sent message after 5 seconds
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending alert emails:', error);
      setError('Failed to send alert emails. Please try again later.');
      setSendingEmails(false);
    }
  };
  
  const handleItemClick = (alert) => {
    if (alert.type === 'flower') {
      navigate(`/flower/${alert._id}`);
    } else if (alert.type === 'product') {
      navigate(`/product/${alert._id}`);
    } else if (alert.type === 'item') {
      navigate(`/item/${alert._id}`);
    }
  };
  
  return (
    <div className="inventory-alerts-page">
      <Navbar />
      
      <div className="inventory-alerts-container">
        <h1>Inventory Alerts</h1>
        <p className="description">
          Items with stock levels below the threshold of 10 units are shown here.
          These items require attention to prevent stockouts.
        </p>
        
        {loading ? (
          <div className="loading">Loading alerts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {user.role === 'admin' && (
              <div className="admin-actions">
                <button 
                  className="send-emails-btn"
                  onClick={handleSendEmails}
                  disabled={sendingEmails || alerts.length === 0}
                >
                  {sendingEmails ? 'Sending...' : 'Send Email Alerts to All Users'}
                </button>
                {emailSent && <span className="success-message">Emails sent successfully!</span>}
              </div>
            )}
            
            {alerts.length === 0 ? (
              <div className="no-alerts">
                <p>No low stock items found. Your inventory is in good shape!</p>
              </div>
            ) : (
              <div className="alerts-grid">
                {alerts.map(alert => (
                  <div 
                    key={`${alert.type}-${alert._id}`} 
                    className="alert-card"
                    onClick={() => handleItemClick(alert)}
                  >
                    <div className="alert-header">
                      <span className={`alert-type ${alert.type}`}>
                        {alert.type === 'flower' ? '🌸 Growers' : 
                         alert.type === 'product' ? '📦 Sellers' : 
                         '🛠️ Supplliers'}
                      </span>
                      <span className="alert-stock">Stock: <span className="stock-count">{alert.stock}</span></span>
                    </div>
                    
                    <h3 className="alert-name">{alert.name}</h3>
                    
                    <div className="alert-details">
                      <p className="alert-price">Price: Rs. {alert.price}</p>
                      <p className="alert-owner">
                        Owner: {
                          alert.type === 'flower' ? alert.growerId?.firstName + ' ' + alert.growerId?.lastName :
                          alert.type === 'product' ? alert.sellerId?.firstName + ' ' + alert.sellerId?.lastName :
                          alert.supplierId?.firstName + ' ' + alert.supplierId?.lastName
                        }
                      </p>
                    </div>
                    
                    <button className="view-details-btn">View Details</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default InventoryAlerts;