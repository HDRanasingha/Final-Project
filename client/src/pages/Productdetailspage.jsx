import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import '../styles/productdetails.scss';
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons
import { addToWishlist, isInWishlist, removeFromWishlist } from '../utils/wishlistUtils'; // Import wishlist utilities

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inWishlist, setInWishlist] = useState(false); // Track if item is in wishlist

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setTotalPrice(res.data.price);
        
        // Check if product is in wishlist
        setInWishlist(isInWishlist(res.data._id, 'product'));
      })
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      alert("This product is sold out and cannot be purchased.");
      return;
    }

    // Add product to cart (localStorage or API can be used)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.some(item => item._id === product._id)) {
      navigate("/cart");
      return;
    }
    storedCart.push({ ...product, quantity });
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Navigate to cart page
    navigate("/cart");
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      // Remove from wishlist if already in wishlist
      removeFromWishlist(product._id, 'product');
      setInWishlist(false);
      alert(`${product.name} removed from your wishlist!`);
    } else {
      // Add to wishlist
      const added = addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        img: product.img,
        itemType: 'product'
      });
      
      if (added) {
        setInWishlist(true);
        alert(`${product.name} added to your wishlist!`);
      }
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-details-page">
      <Navbar />
      <div className="product-details">
        <img src={`http://localhost:3001${product.img}`} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Price: Rs. {product.price}</p>
          <p>Stock: {product.stock} Units</p>
          <p>Description: {product.description || "No description available"}</p>
          
          <div className="quantity-container">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          
          <p className="total-price">Total: Rs. {totalPrice}</p>
          
          <div className="action-buttons">
            <button 
              className="buy-now-button" 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
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

export default ProductDetailsPage;