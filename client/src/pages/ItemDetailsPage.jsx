import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ItemDetailsPage.scss";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons
import { addToWishlist, isInWishlist, removeFromWishlist } from '../utils/wishlistUtils'; // Import wishlist utilities

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inWishlist, setInWishlist] = useState(false); // Track if item is in wishlist

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/items/${id}`)
      .then((res) => {
        setItem(res.data);
        setTotalPrice(res.data.price);
        
        // Check if item is in wishlist
        setInWishlist(isInWishlist(res.data._id, 'item'));
      })
      .catch((err) => console.error("Error fetching item details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    setQuantity(newQuantity);
    setTotalPrice(item.price * newQuantity);
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
    if (!item) return;
    
    if (inWishlist) {
      // Remove from wishlist if already in wishlist
      removeFromWishlist(item._id, 'item');
      setInWishlist(false);
      alert(`${item.name} removed from your wishlist!`);
    } else {
      // Add to wishlist
      const added = addToWishlist({
        _id: item._id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        img: item.img,
        itemType: 'item'
      });
      
      if (added) {
        setInWishlist(true);
        alert(`${item.name} added to your wishlist!`);
      }
    }
  };

  if (!item) return <p>Loading item details...</p>;

  return (
    <div className="item-details-page">
      <Navbar />
      <div className="item-details">
        <img src={`http://localhost:3001${item.img}`} alt={item.name} />
        <div className="item-info">
          <h2>{item.name}</h2>
          <p>Price: Rs. {item.price}</p>
          <p>Stock: {item.stock} Units</p>
          <p>Description: {item.description || "No description available"}</p>
          
          <div className="quantity-container">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          
          <p className="total-price">Total: Rs. {totalPrice}</p>
          
          <div className="action-buttons">
            <button 
              className="buy-now-button" 
              onClick={handleBuyNow}
              disabled={item.stock === 0}
            >
              {item.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            
            <button 
              className="wishlist-button" 
              onClick={handleAddToWishlist}
            >
              {inWishlist ? 
                <FaHeart style={{color: 'white', marginRight: '5px'}} /> : 
                <FaRegHeart style={{color: 'white', marginRight: '5px'}} />
              } 
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetailsPage;