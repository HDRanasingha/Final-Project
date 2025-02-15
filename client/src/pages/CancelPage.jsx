import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Cancelled</h1>
      <button onClick={() => navigate("/checkout")}>Go Back to Checkout</button>
    </div>
  );
};

export default PaymentCancel;