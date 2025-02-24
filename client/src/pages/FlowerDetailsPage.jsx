import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import "../styles/FlowerDetailsPage.scss"; // Add CSS file for styling

const FlowerDetailsPage = () => {
  const { id } = useParams(); // Get flower ID from URL
  const navigate = useNavigate(); // Hook for navigation
  const [flower, setFlower] = useState(null);
  
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  useEffect(() => {
    axios.get(`http://localhost:3001/api/flowers/${id}`)
      .then(res => {
        setFlower(res.data);
        setTotalPrice(res.data.price); // Set initial total price
      })
      .catch(err => console.error("Error fetching flower details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity doesn't go below 1
    setQuantity(newQuantity);
    setTotalPrice(flower.price * newQuantity); // Update total price
  };

  const handleBuyNow = () => {
    // Add flower to cart (localStorage or API can be used)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.some(item => item._id === flower._id)) {
      navigate("/cart");
      return;
    }
    storedCart.push({ ...flower, quantity });
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Navigate to cart page
    navigate("/cart");
  };

 

  const handleAddToWishlist = () => {
    
    alert(`${flower.name} added to your wishlist!`);
    // Implement wishlist logic here
  };

  if (!flower) return <p>Loading flower details...</p>;

  return (
    <div className="flower-details-page">
      <Navbar />
      <div className="flower-details">
        <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
        <div className="flower-info">
          <h2>{flower.name}</h2>
          <p><strong>Stock:</strong> {flower.stock} Bunches</p>
          <p><strong>Price:</strong> Rs. {flower.price}</p>
          <p><strong>Description:</strong> {flower.description || "No description available"}</p>
          
          {/* Quantity and Total Price */}
          <div className="quantity-container">
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={flower.stock}
            />
          </div>
          <p><strong>Total Price:</strong> Rs. {totalPrice}</p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="buy-now-button" onClick={handleBuyNow}>🛒 Buy Now</button>
            <button className="wishlist-button" onClick={handleAddToWishlist}>♡ Add to Wishlist</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FlowerDetailsPage;
