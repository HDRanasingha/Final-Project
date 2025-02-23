import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed and imported
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
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

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
    console.log(storedCart[0]?.growerId?._id);
   
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

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.area) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Generate a unique Order ID
    const orderId = "ORD-" + Math.floor(Math.random() * 1000000);

    console.log("cart: ", cart);
    // push items from cart to items array

    // {
    //"_id": "67b9eb828ceb5474c26f14b1",
    //"name": "ffrefer",
    //"stock": 1,
    //"price": 1000,
    //"description": "dfregre",
    //"img": "/uploads/1740277896938-grow.jpg",
    //"growerId": {
       // "_id": "67b5ee4a7c496cf762a56695",
        //"firstName": "john",
        //"lastName": "luvis"
   // },
    //"createdAt": "2025-02-22T15:21:38.603Z",
//"updatedAt": "2025-02-23T02:31:37.079Z",
    //"__v": 0,
    //"quantity": 1
//}
// item should include name, price, quantity, growerId
    cart.map(item =>{
      console.log("item: ", item);
      items.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        listerId: item.growerId._id
      });
    })

    const orderData = {
      orderId,
      items: items,
      total: total + deliveryFee,
      customer: formData,
      status: "Processing", // Initial order status
    };

    if (formData.paymentMethod === "card") {
      try {
        // Create a Stripe Checkout session
        const { data } = await axios.post("http://localhost:3001/api/payment/create-checkout-session", {
          totalPrice: total + deliveryFee,
        });

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        setErrorMessage("There was an issue with your payment. Please try again.");
      }
    } else {
      try {
        // Send the order data to the server (you should have an API endpoint that handles this)
        await axios.post("http://localhost:3001/api/orders", orderData);

        alert("Your order has been placed successfully!");

        // Clear the cart and order data from localStorage
        localStorage.removeItem("cart");

        // Redirect to home page or another page
        navigate("/");
      } catch (error) {
        console.error("Error placing order:", error);
        setErrorMessage("There was an issue with your order. Please try again.");
      }
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

            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;