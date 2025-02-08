import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/CheckoutPage.scss";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
    area: "",
  });

  const navigate = useNavigate();

  const deliveryFees = {
    Colombo: 200,
    Kandy: 250,
    Galle: 300,
    Jaffna: 350,
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  useEffect(() => {
    if (formData.area) {
      const fee = deliveryFees[formData.area] || 0;
      setDeliveryFee(fee);
    }
  }, [formData.area]);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.area) {
      alert("Please fill in all required fields.");
      return;
    }

    // Generate a unique Order ID
    const orderId = "ORD-" + Math.floor(Math.random() * 1000000);

    const orderData = {
      orderId,
      items: cart,
      total: total + deliveryFee,
      customer: formData,
      status: "Processing", // Initial order status
    };

    // Save order in localStorage
    localStorage.setItem("order", JSON.stringify(orderData));

    alert("Your order has been placed successfully!");

    localStorage.removeItem("cart"); // Clear cart
    navigate(`/track-order/${orderId}`); // Redirect to track order page
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <ul>
              {cart.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} x Rs. {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <h3>Total: Rs. {total.toFixed(2)}</h3>
            <h3>Delivery Fee: Rs. {deliveryFee}</h3>
            <h3>Grand Total: Rs. {(total + deliveryFee).toFixed(2)}</h3>
          </div>

          <div className="checkout-form">
            <h3>Billing Details</h3>
            
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              style={{ resize: "none", overflowY: "hidden" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              required
            />

            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />

            <label>Area:</label>
            <select name="area" value={formData.area} onChange={handleInputChange} required>
              <option value="">Select Area</option>
              {Object.keys(deliveryFees).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
            </select>

            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;


