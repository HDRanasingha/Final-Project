import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import "../styles/productdetails.scss"; // Add CSS file for styling


const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const handleAddToWishlist = () => {
    alert(`${product.name} added to Wishlist!`);
    // Implement logic to store in wishlist
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${product.name}!`);
    // Redirect to checkout page
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
          <button onClick={handleBuyNow} className="buy-now-btn">🛒 Buy Now</button>
          <button onClick={handleAddToWishlist} className="wishlist-btn">❤️ Add to Wishlist</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
