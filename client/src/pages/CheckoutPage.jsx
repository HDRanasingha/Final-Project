import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/CheckoutPage.scss";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const items = [];
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
    area: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  // Add this function to update product stock after purchase
  const updateProductStock = async (cartItems) => {
    try {
      // Process each item in the cart
      for (const item of cartItems) {
        // Determine the item type and call the appropriate endpoint
        if (item.growerId) {
          // This is a flower
          await axios.put(`http://localhost:3001/api/flowers/update-stock/${item._id}`, {
            quantity: item.quantity
          });
        } else if (item.sellerId) {
          // This is a product
          await axios.put(`http://localhost:3001/api/products/update-stock/${item._id}`, {
            quantity: item.quantity
          });
        } else if (item.supplierId) {
          // This is a supplier item
          await axios.put(`http://localhost:3001/api/items/update-stock/${item._id}`, {
            quantity: item.quantity
          });
        }
      }
      console.log("All stock updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.area) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const orderId = "ORD-" + Math.floor(Math.random() * 1000000);

    cart.forEach(item => {
      items.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        listerId: item.growerId?._id || item.sellerId?._id || item.supplierId?._id
      });
    });

    const orderData = {
      orderId,
      items: items,
      total: total + deliveryFee,
      customer: formData,
      status: "Processing",
    };

    try {
      if (formData.paymentMethod === "card") {
        // Store orderId in localStorage before redirecting to payment
        localStorage.setItem("pendingOrderId", orderId);
        
        const { data } = await axios.post("http://localhost:3001/api/payment/create-checkout-session", {
          totalPrice: total + deliveryFee,
          orderId: orderId, // Pass orderId to the backend
        });

        window.location.href = data.url;
      }

      await axios.post("http://localhost:3001/api/orders/success", orderData);
      
      // Update stock for all purchased items
      await updateProductStock(cart);

      localStorage.removeItem("cart");

      setSuccessMessage("Your order has been placed successfully!");

      setTimeout(() => {
        navigate(`/thank-you?orderId=${orderId}`);
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("There was an issue with your order. Please try again.");
      setIsSubmitting(false);
    }
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
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter your full name"
              required 
            />

            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your delivery address"
              rows="3"
              style={{ resize: "none", overflowY: "hidden" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              required
            />

            <label>Phone:</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              placeholder="Enter your phone number"
              required 
            />

            <label>Area:</label>
            <select name="area" value={formData.area} onChange={handleInputChange} required>
              <option value="">Select Area</option>
              {Object.keys(deliveryFees).map((area) => (
                <option key={area} value={area}>
                  {area} (Rs. {deliveryFees[area]})
                </option>
              ))}
            </select>

            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
            </select>
            <button 
              className="place-order-button" 
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;