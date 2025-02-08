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

  useEffect(() => {
    axios.get(`http://localhost:3001/api/flowers/${id}`)
      .then(res => setFlower(res.data))
      .catch(err => console.error("Error fetching flower details:", err));
  }, [id]);

  if (!flower) return <p>Loading flower details...</p>;

  const handleBuyNow = () => {
    navigate(`/checkout?flowerId=${id}&price=${flower.price}`); // Navigate to checkout
  };

  const handleAddToWishlist = () => {
    console.log("Added to Wishlist:", flower.name);
    alert(`${flower.name} added to your wishlist!`);
  };

  return (
    <div className="flower-details-page">
      <Navbar />
      <div className="flower-details">
        <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
        <h2>{flower.name}</h2>
        <p><strong>Stock:</strong> {flower.stock} Bunches</p>
        <p><strong>Price:</strong> Rs. {flower.price}</p>
        <p><strong>Description:</strong> {flower.description || "No description available"}</p>
        
        {/* Buy Now & Wishlist Buttons */}
        <div className="action-buttons">
          <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
          <button className="wishlist-button" onClick={handleAddToWishlist}>♡ Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FlowerDetailsPage;