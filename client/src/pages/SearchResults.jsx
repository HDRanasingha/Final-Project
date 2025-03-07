import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SearchResults.scss";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import { useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";
  const isGrower = currentUser?.role === "grower";
  const isSeller = currentUser?.role === "seller";
  const isSupplier = currentUser?.role === "supplier";
  
  const { flowers, products, items, users, query, isGrowerSearch } = location.state || { 
    flowers: [], 
    products: [], 
    items: [],
    users: [],
    query: "",
    isGrowerSearch: false
  };
  
  // Get wishlist from localStorage
  const [wishlist, setWishlist] = React.useState(() => {
    const savedWishlist = localStorage.getItem('guestWishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  
  const handleCardClick = (id, type) => {
    navigate(`/${type}/${id}`);
  };
  
  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = (e, item, type) => {
    e.stopPropagation(); // Prevent card click
    
    const itemWithType = { ...item, itemType: type };
    const isInWishlist = wishlist.some(wishItem => 
      wishItem._id === item._id && wishItem.itemType === type
    );
    
    let newWishlist;
    if (isInWishlist) {
      newWishlist = wishlist.filter(wishItem => 
        !(wishItem._id === item._id && wishItem.itemType === type)
      );
    } else {
      newWishlist = [...wishlist, itemWithType];
    }
    
    setWishlist(newWishlist);
    localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
  };
  
  // Check if item is in wishlist
  const isInWishlist = (id, type) => {
    return wishlist.some(item => item._id === id && item.itemType === type);
  };
  
  const totalResults = flowers.length + products.length + items.length + (isAdmin ? users.length : 0);
  
  return (
    <div>
      <Navbar />
      <div className="search-results-page">
        <h2>
          {isGrowerSearch 
            ? `Search Results for Your Flowers: "${query}"` 
            : isSeller 
              ? `Search Results for Your Products: "${query}"`
              : isSupplier
                ? `Search Results for Your Items: "${query}"`
                : `Search Results for "${query}"`}
        </h2>
        
        {totalResults === 0 ? (
          <div className="no-results">
            <p>No results found for "{query}". Please try a different search term.</p>
          </div>
        ) : (
          <>
            <p className="results-count">{totalResults} results found</p>
            
            {flowers.length > 0 && (
              <div className="results-section">
                <h3>Flowers ({flowers.length})</h3>
                <div className="flower-list">
                  {flowers.map((flower) => (
                    <div 
                      className={`flower-card ${flower.isOwnFlower ? 'own-flower' : ''}`} 
                      key={flower._id} 
                      onClick={() => handleCardClick(flower._id, 'flower')}
                    >
                      <div className="wishlist-icon" onClick={(e) => handleWishlistToggle(e, flower, 'flower')}>
                        {isInWishlist(flower._id, 'flower') ? 
                          <FaHeart style={{ color: 'red' }} /> : 
                          <FaRegHeart />
                        }
                      </div>
                      <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
                      <h3>{flower.name}</h3>
                      <p>Stock: {flower.stock} Bunches</p>
                      <p>Price: Rs. {flower.price}</p>
                      
                      {flower.isOwnFlower && isGrower && (
                        <div className="flower-stats">
                          <div className="stat">
                            <span className="label">Created:</span>
                            <span className="value">{new Date(flower.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="stat">
                            <span className="label">Last Updated:</span>
                            <span className="value">{new Date(flower.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {products.length > 0 && (
              <div className="results-section">
                <h3>Products ({products.length})</h3>
                <div className="product-list">
                  {products.map((product) => (
                    <div className="product-card" key={product._id} onClick={() => handleCardClick(product._id, 'product')}>
                      <div className="wishlist-icon" onClick={(e) => handleWishlistToggle(e, product, 'product')}>
                        {isInWishlist(product._id, 'product') ? 
                          <FaHeart style={{ color: 'red' }} /> : 
                          <FaRegHeart />
                        }
                      </div>
                      <img src={`http://localhost:3001${product.img}`} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>Stock: {product.stock} Bunches</p>
                      <p>Price: Rs. {product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {items.length > 0 && (
              <div className="results-section">
                <h3>Items ({items.length})</h3>
                <div className="item-list">
                  {items.map((item) => (
                    <div className="item-card" key={item._id} onClick={() => handleCardClick(item._id, 'item')}>
                      <div className="wishlist-icon" onClick={(e) => handleWishlistToggle(e, item, 'item')}>
                        {isInWishlist(item._id, 'item') ? 
                          <FaHeart style={{ color: 'red' }} /> : 
                          <FaRegHeart />
                        }
                      </div>
                      <img src={`http://localhost:3001${item.img}`} alt={item.name} />
                      <h3>{item.name}</h3>
                      <p>Stock: {item.stock} Bunches</p>
                      <p>Price: Rs. {item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isAdmin && users && users.length > 0 && (
              <div className="results-section">
                <h3>Users ({users.length})</h3>
                <div className="user-list">
                  {users.map((user) => (
                    <div className="user-card" key={user._id} onClick={() => handleUserClick(user._id)}>
                      <img 
                        className="user-avatar"
                        src={user.profileImagePath ? `http://localhost:3001/${user.profileImagePath}` : "/assets/default-avatar.png"} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                      <p className="user-email">{user.email}</p>
                      <span className={`user-role ${user.role}`}>{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;