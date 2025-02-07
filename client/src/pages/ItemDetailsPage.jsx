import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ItemDetailsPage.scss";

const ItemDetailsPage = () => {
  const { id } = useParams(); // Get item ID from URL
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price
  const navigate = useNavigate(); // To navigate to different pages

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/items/${id}`)
      .then((res) => {
        setItem(res.data);
        setTotalPrice(res.data.price); // Set initial total price
      })
      .catch((err) => console.error("Error fetching item details:", err));
  }, [id]);

  const handleAddToWishlist = () => {
    alert(`${item.name} added to Wishlist!`);
    // Implement logic to store in wishlist
  };

  const handleBuyNow = () => {
    // Redirect to cart page
    navigate("/cart");
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity doesn't go below 1
    setQuantity(newQuantity);
    setTotalPrice(item.price * newQuantity); // Update total price
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
          <p>Total Price: Rs. {totalPrice}</p>
          <button onClick={handleBuyNow} className="buy-now-btn">🛒 Buy Now</button>
          <button onClick={handleAddToWishlist} className="wishlist-btn">❤️ Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetailsPage;

