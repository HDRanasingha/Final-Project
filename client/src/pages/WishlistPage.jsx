import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import axios from "axios";
import "../styles/wishlistpage.scss";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch wishlist from backend
    axios
      .get("http://localhost:3001/api/wishlist")
      .then((res) => setWishlist(res.data))
      .catch((err) => console.error("Error fetching wishlist:", err));
  }, []);

  const removeFromWishlist = (flowerId) => {
    axios
      .delete(`http://localhost:3001/api/wishlist/${flowerId}`)
      .then(() => {
        setWishlist(wishlist.filter(item => item._id !== flowerId));
      })
      .catch((err) => console.error("Error removing from wishlist:", err));
  };

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist-section">
        <h1>Your Wishlist</h1>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty. Start adding flowers, products, and items to your wishlist!</p>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((flower) => (
              <div className="wishlist-card" key={flower._id}>
                <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
                <h3>{flower.name}</h3>
                <p>Stock: {flower.stock} Bunches</p>
                <p>Price: Rs. {flower.price}</p>
                <div className="remove-button" onClick={() => removeFromWishlist(flower._id)}>
                  Remove from Wishlist
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
