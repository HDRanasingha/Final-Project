import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/CartPage.scss";
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowRight, FaHome } from "react-icons/fa";

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
          <div className="empty-cart">
            <img src="/assets/empty-cart.jpeg" alt="Empty Cart" />
            <p>Your cart is empty!</p>
            <p>Add some beautiful flowers to your cart and make someone's day special.</p>
            <Link to="/" className="continue-shopping">
              <FaHome /> Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
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
                      <img
                        src={item.img ? `http://localhost:3001/${item.img.replace(/\\/g, '/')}` : "/images/placeholder.png"}
                        alt={item.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                    </td>
                    <td className="product-name">{item.name}</td>
                    <td className="price">{item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                          }
                        />
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="subtotal">
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <span className="label">Subtotal</span>
                <span className="value">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="summary-details">
                <span className="label">Shipping</span>
                <span className="value">Calculated at checkout</span>
              </div>
              <div className="summary-details total">
                <span className="label">Total</span>
                <span className="value">Rs. {total.toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout <FaArrowRight />
              </button>
              <Link to="/" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

