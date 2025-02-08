import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import "../styles/productdetails.scss"; // Add CSS file for styling

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price
  const navigate = useNavigate(); // To navigate to different pages

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setTotalPrice(res.data.price); // Set initial total price
      })
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const handleAddToWishlist = () => {
    alert(`${product.name} added to Wishlist!`);
    // Implement logic to store in wishlist
  };

  const handleBuyNow = () => {
    // Add product to cart (localStorage or API can be used)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart.push({ ...product, quantity });
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Redirect to cart page
    navigate("/cart");
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity doesn't go below 1
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity); // Update total price
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <Navbar />
      <div className="product-container">
        <img src={`http://localhost:3001${product.img}`} alt={product.name} />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Price: Rs. {product.price}</p>
          <p>Stock: {product.stock}</p>
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
          <p>Total Price: Rs. {totalPrice}</p>
          <button onClick={handleBuyNow} className="buy-now-btn">🛒 Buy Now</button>
          <button onClick={handleAddToWishlist} className="wishlist-btn">❤ Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;