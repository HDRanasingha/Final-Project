import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the cart items from localStorage or API if it's persistent
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Calculate the total
    const totalAmount = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update cart in localStorage
  };

  const handleQuantityChange = (itemId, quantity) => {
    const updatedCart = cart.map((item) => 
      item._id === itemId ? { ...item, quantity: quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update cart in localStorage

    // Recalculate total
    const totalAmount = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={`http://localhost:3001${item.img}`} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Price: Rs. {item.price}</p>
                  <div className="quantity-container">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                      min="1"
                    />
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <p>Total: Rs. {item.price * item.quantity}</p>
                </div>
                <button className="remove-item" onClick={() => handleRemoveItem(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="cart-summary">
          <h3>Total: Rs. {total}</h3>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
