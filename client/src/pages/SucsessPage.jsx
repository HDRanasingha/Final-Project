
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
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
    } else {
      // If not in URL, try to get from localStorage (for card payments)
      const storedOrderId = localStorage.getItem("pendingOrderId");
      if (storedOrderId) {
        setOrderId(storedOrderId);
        // Clear from localStorage after retrieving
        localStorage.removeItem("pendingOrderId");
      }
    }
  }, [location.search]);

  return (
    <div className="payment-success">
      <Navbar />
      <div className="thank-you-container">
        <h1>🎉 Thank You for Your Order!</h1>
        {orderId ? (
          <>
            <p>Your Order ID: <strong>{orderId}</strong></p>
            <p>Use this Order ID to <strong>track your order</strong>.</p>
            <button onClick={() => navigate(`/track-order?orderId=${orderId}`)}>Track My Order</button>
          </>
        ) : (
          <>
            <p>Your order has been placed successfully!</p>
            <button onClick={() => navigate("/track-order")}>Track My Orders</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;