import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/wishlistpage.scss";
import { getWishlist, removeFromWishlist } from "../utils/wishlistUtils";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get wishlist using the utility function
    const items = getWishlist();
    console.log("Loaded wishlist items:", items);
    setWishlist(items);
  }, []);

  const handleRemoveFromWishlist = (id, type) => {
    console.log("Removing item:", id, type);
    removeFromWishlist(id, type);
    setWishlist(prev => prev.filter(item => 
      !(item._id === id && item.itemType === type)
    ));
  };

  const handleViewDetails = (id, type) => {
    navigate(`/${type}/${id}`);
  };

  const addToCart = (item) => {
    // Get existing cart or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const itemExists = existingCart.find(
      cartItem => cartItem._id === item._id && cartItem.itemType === item.itemType
    );
    
    if (itemExists) {
      // Update quantity if item exists
      const updatedCart = existingCart.map(cartItem => 
        (cartItem._id === item._id && cartItem.itemType === item.itemType)
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Add new item with quantity 1
      const newCart = [...existingCart, { ...item, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    
    alert('Item added to cart!');
  };

  return (
    <div>
      <Navbar />
      <div className="wishlist-page">
        <h1>My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <h2>Your wishlist is empty</h2>
            <p>Add items to your wishlist by clicking the heart icon on products you like.</p>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((item, index) => (
              <div className="wishlist-item" key={`${item._id || index}-${item.itemType}`}>
                <img 
                  src={item.img && item.img.startsWith('http') 
                    ? item.img 
                    : `http://localhost:3001${item.img}`}
                  alt={item.name || "Wishlist Item"} 
                  onClick={() => handleViewDetails(item._id, item.itemType)}
                  onError={(e) => {
                    console.error("Image failed to load:", item.img);
                    e.target.src = "https://via.placeholder.com/200x200?text=Image+Not+Found";
                  }}
                />
                <div className="item-details">
                  <h3>{item.name || "Product Name"}</h3>
                  <p>Type: {item.itemType ? item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1) : "Product"}</p>
                  <p>Price: Rs. {item.price || 0}</p>
                  <p>Stock: {item.stock || 0} {item.itemType === 'flower' ? 'Bunches' : 'Units'}</p>
                  
                  <div className="item-actions">
                    <button 
                      className="view-details" 
                      onClick={() => handleViewDetails(item._id, item.itemType)}
                    >
                      View Details
                    </button>
                    <button 
                      className="add-to-cart" 
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveFromWishlist(item._id, item.itemType)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
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
