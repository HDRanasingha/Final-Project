import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentGatewayPage = () => {
  const { itemId } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const processPayment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment/pay/${itemId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Payment Successful!");
        // Clear the cart from localStorage after successful payment
        localStorage.removeItem("cart");
        setTimeout(() => {
          navigate("/success"); // Redirect after payment
        }, 2000);
      } else {
        setMessage("Payment Failed. Try Again.");
      }
    } catch (err) {
      console.error("Payment failed:", err.message);
      setMessage("Payment Failed. Try Again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (itemId) {
      processPayment();
    }
  }, [itemId]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>{loading ? "Processing Payment..." : message}</h1>
    </div>
  );
};

export default PaymentGatewayPage;


