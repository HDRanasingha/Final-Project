import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { CheckCircle, ShoppingBag, Timeline } from "@mui/icons-material";
import "../styles/PaymentSucsess.scss";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // First try to get orderId from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const urlOrderId = queryParams.get("orderId");
    
    if (urlOrderId) {
      setOrderId(urlOrderId);
      // Clear cart when arriving at success page
      localStorage.removeItem("cart");
    } else {
      // If not in URL, try to get from localStorage (for card payments)
      const storedOrderId = localStorage.getItem("pendingOrderId");
      if (storedOrderId) {
        setOrderId(storedOrderId);
        // Clear cart when arriving at success page
        localStorage.removeItem("cart");
        // Clear from localStorage after retrieving
        localStorage.removeItem("pendingOrderId");
      }
    }
  }, [location.search]);

  return (
    <div className="payment-success">
      <Navbar />
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle />
          </div>
          
          <h1>Payment Successful!</h1>
          
          {orderId && (
            <div className="order-id-container">
              <span className="order-id">Order ID: {orderId}</span>
              <button 
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(orderId)}
              >
                Copy ID
              </button>
            </div>
          )}
          
          <div className="success-message">
            <p>
              Thank you for your purchase! Your payment has been processed successfully.
              You will receive an email confirmation shortly.
            </p>
          </div>
          
          <div className="order-details">
            <div className="order-info">
              <p>
                <span>Status</span>
                <span className="status-badge">Confirmed</span>
              </p>
              {orderId && (
                <p>
                  <span>Order ID</span>
                  <span>{orderId}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="action-info">
            Track your order or continue shopping
          </div>
          
          <div className="action-buttons">
            <button 
              className="continue-shopping"
              onClick={() => navigate("/")}
            >
              <ShoppingBag /> Continue Shopping
            </button>
            <button 
              className="track-order"
              onClick={() => navigate(`/track-order${orderId ? `?orderId=${orderId}` : ''}`)}
            >
              <Timeline /> Track Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;