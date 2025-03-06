import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PaymentSuccess.scss";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract payment ID from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const paymentId = searchParams.get("payment_id");
    const sessionId = searchParams.get("session_id");
    
    if (paymentId || sessionId) {
      // Fetch order details using the payment ID or session ID
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/orders/payment-details`, {
            params: { 
              payment_id: paymentId,
              session_id: sessionId
            }
          });
          setOrderDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching order details:", error);
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [location]);

  const handleContinueShopping = () => {
    navigate("/customer");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="payment-success-container loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">
          <i className="checkmark">✓</i>
        </div>
        <h1>Payment Successful!</h1>
        
        {orderDetails ? (
          <div className="order-details">
            <p className="payment-id">Payment ID: <span>{orderDetails.paymentId || "N/A"}</span></p>
            <p>Order ID: <span>{orderDetails.orderId || "N/A"}</span></p>
            <p>Amount Paid: <span>Rs. {orderDetails.amount?.toFixed(2) || "0.00"}</span></p>
            <p>Date: <span>{new Date(orderDetails.createdAt).toLocaleString() || "N/A"}</span></p>
          </div>
        ) : (
          <p className="payment-id">Payment ID: <span>{new URLSearchParams(location.search).get("payment_id") || "N/A"}</span></p>
        )}
        
        <p className="success-message">
          Thank you for your purchase! Your payment has been processed successfully.
          You will receive an email confirmation shortly.
        </p>
        
        <div className="action-buttons">
          <button className="continue-shopping" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
          <button className="view-orders" onClick={handleViewOrders}>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;