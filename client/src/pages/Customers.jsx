import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';

import Footer from '../component/Footer';

const CustomerPage = () => {
  const [flowers, setFlowers] = useState([]);
  const customerId = "65c0abcd1234ef56789012ab"; // Example customer ID

  // ✅ Fetch flowers from backend
  useEffect(() => {
    axios.get('http://localhost:3001/api/customers/flowers')
      .then((res) => setFlowers(res.data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  // ✅ Add to Wishlist
  const addToWishlist = async (flowerId) => {
    try {
      await axios.post('http://localhost:3001/api/customers/wishlist/add', { customerId, flowerId });
      alert("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // ✅ Buy Flower
  const buyFlower = async (flowerId) => {
    const quantity = prompt("Enter quantity:");
    if (!quantity || isNaN(quantity) || quantity <= 0) return;
    
    try {
      await axios.post('http://localhost:3001/api/customers/buy', { customerId, flowerId, quantity });
      alert("Purchase successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error purchasing flower:", error);
      alert("Purchase failed: " + error.response.data.message);
    }
  };

  return (
    <div className="customer-page">
      <Navbar />
      
      <div className="hero-section">
        <h1>💐 Growers' Flowers</h1>
        <p>Explore high-quality flowers grown by our trusted growers!</p>
      </div>

      <div className="flower-list">
        {flowers.map(flower => (
          <div className="flower-card" key={flower._id}>
            <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
            <h3>{flower.name}</h3>
            <p>Stock: {flower.stock} Bunches</p>
            <p>Price: Rs. {flower.price}</p>
            <button className="wishlist-btn" onClick={() => addToWishlist(flower._id)}>❤️ Add to Wishlist</button>
            <button className="buy-btn" onClick={() => buyFlower(flower._id)}>🛒 Buy Now</button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerPage;
