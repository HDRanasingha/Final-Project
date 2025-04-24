import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ThankYouPage.scss"; // We'll create this style file

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className="thank-you-page">
      <Navbar />
      <div className="thank-you-container">
        <div className="thank-you-card">
          <div className="success-icon">✓</div>
          <h1>Thank You for Your Order!</h1>
          
          
          {orderId && (
            <div className="order-details">
              <p>Order ID: <span className="highlight">{orderId}</span></p>
            </div>
          )}
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You can track your order status anytime</li>
              <li>Our team is preparing your items for shipment</li>
              <li>You'll receive updates as your order progresses</li>
            </ul>
          </div>
          
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={() => navigate(orderId ? `/track-order?orderId=${orderId}` : "/track-order")}
            >
              Track My Order
            </button>
            <button 
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
