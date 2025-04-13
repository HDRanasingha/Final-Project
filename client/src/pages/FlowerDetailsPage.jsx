import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import "../styles/FlowerDetailsPage.scss";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons
import { addToWishlist, isInWishlist, removeFromWishlist } from '../utils/wishlistUtils'; // Import wishlist utilities
import { useSelector } from 'react-redux'; // Add this import

const FlowerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flower, setFlower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inWishlist, setInWishlist] = useState(false); // Track if item is in wishlist
  
  // Get user from Redux store
  const user = useSelector((state) => state.user);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/flowers/${id}`)
      .then(res => {
        setFlower(res.data);
        setTotalPrice(res.data.price);
        
        // Check if flower is in wishlist
        setInWishlist(isInWishlist(res.data._id, 'flower'));
      })
      .catch(err => console.error("Error fetching flower details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    setQuantity(newQuantity);
    setTotalPrice(flower.price * newQuantity);
  };

  const handleAddToCart = () => {
    if (flower.stock === 0) {
      alert("This flower is sold out and cannot be added to cart.");
      return;
    }

    // Add flower to cart (localStorage or API can be used)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if flower already exists in cart
    const existingItemIndex = storedCart.findIndex(item => item._id === flower._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if flower already in cart
      storedCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new flower to cart
      storedCart.push({ ...flower, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(storedCart));
    alert(`${flower.name} added to your cart!`);
  };

  const handleBuyNow = () => {
    if (flower.stock === 0) {
      alert("This flower is sold out and cannot be purchased.");
      return;
    }

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

  const handleWishlistToggle = () => {
    if (!flower) return;
    
    if (inWishlist) {
      // Remove from wishlist if already in wishlist
      removeFromWishlist(flower._id, 'flower');
      setInWishlist(false);
      alert(`${flower.name} removed from your wishlist!`);
    } else {
      // Add to wishlist
      const added = addToWishlist({
        _id: flower._id,
        name: flower.name,
        price: flower.price,
        stock: flower.stock,
        img: flower.img,
        itemType: 'flower'
      });
      
      if (added) {
        setInWishlist(true);
        alert(`${flower.name} added to your wishlist!`);
      }
    }
  };

  // Function to check if current user is the owner of the flower
  const isOwner = () => {
    if (!user || !flower || !flower.growerId) return false;
    return user.role === 'grower' && flower.growerId._id === user._id;
  };

  // Function to determine if buttons should be shown
  const shouldShowButtons = () => {
    // Show buttons if user is not logged in OR user is logged in but not the owner
    return !user || (user && !isOwner());
  };

  if (!flower) return <p>Loading flower details...</p>;

  return (
    <>
      <Navbar />
      <div className="flower-details-page">
        <div className="flower-details">
          <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
          <div className="flower-info">
            <h2>{flower.name}</h2>
            <p>Price: Rs. {flower.price}</p>
            <p>Stock: {flower.stock} Units</p>
            <p>Description: {flower.description || "No description available"}</p>
            
            {/* Always show quantity selector */}
            <div className="quantity-container">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={flower.stock}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            
            <p className="total-price">Total: Rs. {totalPrice}</p>
            
            {/* Conditionally show action buttons */}
            {shouldShowButtons() && (
              <div className="action-buttons">
                <button 
                  className="buy-now-button" 
                  onClick={handleBuyNow}
                  disabled={flower.stock === 0}
                >
                  {flower.stock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
                
                {/* Replace both wishlist buttons with a single one */}
                <button 
                  className={`add-to-wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  {inWishlist ? (
                    <>
                      <FaHeart className="heart-icon" />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="heart-icon" />
                      Add to Wishlist
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Show edit button if user is the owner */}
            {isOwner() && (
              <div className="action-buttons">
                
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FlowerDetailsPage;