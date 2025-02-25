import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className="thank-you-page">
      <Navbar />
      <div className="thank-you-container">
        <h1>🎉 Thank You for Your Order!</h1>
        <p>Your Order ID: <strong>{orderId}</strong></p>
        <p>Use this Order ID to <strong>track your order</strong>.</p>
        <button onClick={() => navigate("/track-order")}>Track My Order</button>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
