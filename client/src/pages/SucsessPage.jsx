import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/PaymentSucsess.scss";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Successful!</h1>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  <Footer /></div>
  );
  
};

export default PaymentSuccess;