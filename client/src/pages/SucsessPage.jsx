import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Successful!</h1>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default PaymentSuccess;