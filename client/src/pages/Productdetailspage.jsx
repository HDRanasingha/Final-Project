import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import '../styles/productdetails.scss'; // Add CSS file for styling

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // Hook for navigation
  const [product, setProduct] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setTotalPrice(res.data.price); // Set initial total price
      })
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity doesn't go below 1
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity); // Update total price
  };

  const handleBuyNow = () => {
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
    alert(`${product.name} added to your wishlist!`);
    // Implement wishlist logic here
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-details-page">
      <Navbar />
      <div className="product-details">
        <img src={`http://localhost:3001${product.img}`} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>Stock:</strong> {product.stock} Bunches</p>
          <p><strong>Price:</strong> Rs. {product.price}</p>
          <p><strong>Description:</strong> {product.description || "No description available"}</p>
          
          {/* Quantity and Total Price */}
          <div className="quantity-container">
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={product.stock}
            />
          </div>
          <p><strong>Total Price:</strong> Rs. {totalPrice}</p>

          {/* Action Buttons */}
          {userId !== product.sellerId._id && (
            <div className="action-buttons">
              <button className="buy-now-button" onClick={handleBuyNow}>🛒 Buy Now</button>
              <button className="wishlist-button" onClick={handleAddToWishlist}>♡ Add to Wishlist</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;