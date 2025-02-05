import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleRemoveFromWishlist = (flowerId) => {
    const updatedWishlist = wishlist.filter((flower) => flower._id !== flowerId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleCardClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="hero-section">
        <h1>Your Wishlist</h1>
        <p>View and manage your favorite flowers.</p>
      </div>

      <div className="flower-list">
        {wishlist.length > 0 ? (
          wishlist.map((flower) => (
            <div className="flower-card" key={flower._id} onClick={() => handleCardClick(flower._id)}>
              <div className="wishlist-container" onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(flower._id); }}>
                <FaHeart className="wishlist-icon active" />
              </div>
              <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
              <h3>{flower.name}</h3>
              <p>Stock: {flower.stock} Bunches</p>
              <p>Price: Rs. {flower.price}</p>
            </div>
          ))
        ) : (
          <p className="empty-message">Your wishlist is empty. Start adding your favorite flowers!</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;

