import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ItemDetailsPage.scss";

const ItemDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/items/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const handleAddToWishlist = () => {
    alert(`${item.name} added to Wishlist!`);
    // Implement logic to store in wishlist
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${item.name}!`);
    // Redirect to checkout page
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="item-details">
      <Navbar />
      <div className="item-container">
        <img src={`http://localhost:3001${item.img}`} alt={item.name} />
        <div className="item-info">
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p>Price: Rs. {item.price}</p>
          <p>Stock: {item.stock}</p>
          <button onClick={handleBuyNow} className="buy-now-btn">🛒 Buy Now</button>
          <button onClick={handleAddToWishlist} className="wishlist-btn">❤️ Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default  ItemDetailsPage;
