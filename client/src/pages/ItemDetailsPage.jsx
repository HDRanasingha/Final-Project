import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ItemDetailsPage.scss";

const ItemDetailsPage = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate(); // Hook for navigation
  const [item, setItem] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/items/${id}`)
      .then((res) => {
        setItem(res.data);
        setTotalPrice(res.data.price); // Set initial total price
      })
      .catch((err) => console.error("Error fetching item details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity doesn't go below 1
    setQuantity(newQuantity);
    setTotalPrice(item.price * newQuantity); // Update total price
  };

  const handleBuyNow = () => {
    if (item.stock === 0) {
      alert("This item is sold out and cannot be purchased.");
      return;
    }

    // Add item to cart (localStorage or API can be used)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.some(cartItem => cartItem._id === item._id)) {
      navigate("/cart");
      return;
    }
    storedCart.push({ ...item, quantity });
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Navigate to cart page
    navigate("/cart");
  };

  const handleAddToWishlist = () => {
    alert(`${item.name} added to your wishlist!`);
    // Implement wishlist logic here
  };

  if (!item) return <p>Loading item details...</p>;

  return (
    <div className="item-details-page">
      <Navbar />
      <div className="item-details">
        <img src={`http://localhost:3001${item.img}`} alt={item.name} />
        <div className="item-info">
          <h2>{item.name}</h2>
          <p><strong>Stock:</strong> {item.stock} Bunches</p>
          <p><strong>Price:</strong> Rs. {item.price}</p>
          <p><strong>Description:</strong> {item.description || "No description available"}</p>
          
          {/* Quantity and Total Price */}
          <div className="quantity-container">
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={item.stock}
            />
          </div>
          <p><strong>Total Price:</strong> Rs. {totalPrice}</p>

          {/* Action Buttons */}
          {userId !== item.supplierId._id && (
            <div className="action-buttons">
              <button className="buy-now-button" onClick={handleBuyNow}>🛒 Buy Now</button>
              <button className="wishlist-button" onClick={handleAddToWishlist}>♡ Add to Wishlist</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetailsPage;