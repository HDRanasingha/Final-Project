import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/CartPage.scss";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return; // Prevents quantity from going below 1

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty!</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price (Rs.)</th>
                  <th>Quantity</th>
                  <th>Subtotal (Rs.)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={`http://localhost:3001${item.img}`} alt={item.name} className="cart-item-img" />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                          min="1"
                        />
                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => handleRemoveItem(item._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <div className="summary-details">
                <p>Subtotal:</p>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

