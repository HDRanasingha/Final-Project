import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import outline and filled heart icons
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/Customers.scss";

const CustomerPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/flowers/all")
      .then((res) => setFlowers(res.data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  const handleCardClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };

  const handleWishlistToggle = (flowerId, e) => {
    e.stopPropagation(); // Prevent card click event

    if (wishlist.includes(flowerId)) {
      setWishlist(wishlist.filter((id) => id !== flowerId));
    } else {
      setWishlist([...wishlist, flowerId]);
      navigate("/wishlist"); // Navigate to wishlist page
    }
  };

  return (
    <div className="customer-page">
      <Navbar />
      <div className="hero-section">
        <h1>Fresh Flowers for You</h1>
        <p>Browse and order from a variety of fresh flowers directly from growers.</p>
      </div>

      <div className="flower-list">
        {flowers.map((flower) => (
          <div className="flower-card" key={flower._id} onClick={() => handleCardClick(flower._id)}>
            {/* Wishlist Icon at Top Left */}
            <div className="wishlist-container" onClick={(e) => handleWishlistToggle(flower._id, e)}>
              {wishlist.includes(flower._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
            </div>
            <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
            <h3>{flower.name}</h3>
            <p>Stock: {flower.stock} Bunches</p>
            <p>Price: Rs. {flower.price}</p>

            <button onClick={() => handleCardClick(flower._id)}>View Details</button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerPage;


