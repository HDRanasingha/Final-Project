// //import React, { useState, useEffect } from "react";
// //import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import Navbar from "../component/Navbar";
// import Footer from "../component/Footer";
// import "../styles/Customers.scss";

// const CustomerPage = () => {
//   const [flowers, setFlowers] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [products, setProducts] = useState([]); // For sellers' products
//   const [items, setItems] = useState([]); // For supplier's items
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch flowers for customers
//     axios
//       .get("http://localhost:3001/api/flowers/all-flowers")
//       .then((res) => setFlowers(res.data))
//       .catch((err) => console.error("Error fetching flowers:", err));

//     // Fetch products for sellers
//     axios
//       .get("http://localhost:3001/api/products/all")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Error fetching products:", err));

//     // Fetch items for suppliers
//     axios
//       .get("http://localhost:3001/api/items/all")
//       .then((res) => setItems(res.data))
//       .catch((err) => console.error("Error fetching items:", err));
//   }, []);

//   const handleCardClick = (flowerId) => {
//     navigate(`/flower/${flowerId}`);
//   };

//   const handleWishlistToggle = (flowerId, e) => {
//     e.stopPropagation(); // Prevent card click event

//     if (wishlist.includes(flowerId)) {
//       setWishlist(wishlist.filter((id) => id !== flowerId));
//     } else {
//       setWishlist([...wishlist, flowerId]);
//       navigate("/wishlist"); // Navigate to wishlist page
//     }
//   };

//   const handleProductCardClick = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   const handleProductWishlistToggle = (productId, e) => {
//     e.stopPropagation(); // Prevent card click event

//     if (wishlist.includes(productId)) {
//       setWishlist(wishlist.filter((id) => id !== productId));
//     } else {
//       setWishlist([...wishlist, productId]);
//       navigate("/wishlist"); // Navigate to wishlist page
//     }
//   };

//   const handleItemCardClick = (itemId) => {
//     navigate(`/item/${itemId}`);
//   };

//   const handleItemWishlistToggle = (itemId, e) => {
//     e.stopPropagation(); // Prevent card click event

//     if (wishlist.includes(itemId)) {
//       setWishlist(wishlist.filter((id) => id !== itemId));
//     } else {
//       setWishlist([...wishlist, itemId]);
//       navigate("/wishlist"); // Navigate to wishlist page
//     }
//   };

//   return (
//     <div className="customer-page">
//       <Navbar />
//       <div className="hero-section">
//         <h1>Fresh Flowers for You</h1>
//         <p>Browse and order from a variety of fresh flowers directly from growers.</p>
//       </div>

//       <div className="flower-list">
//         <h2>Growers Flowers</h2>
//         {flowers.map((flower) => (
//           <div className="flower-card" key={flower._id} onClick={() => handleCardClick(flower._id)}>
//             <div className="wishlist-container" onClick={(e) => handleWishlistToggle(flower._id, e)}>
//               {wishlist.includes(flower._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
//             </div>
//             <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
//             <h3>{flower.name}</h3>
//             <p>Stock: {flower.stock} Bunches</p>
//             <p>Price: Rs. {flower.price}</p>
//             <button onClick={() => handleCardClick(flower._id)}>View Details</button>
//           </div>
//         ))}
//       </div>

//       <div className="product-list">
//         <h2>Sellers' Products</h2>
//         {products.map((product) => (
//           <div className="product-card" key={product._id} onClick={() => handleProductCardClick(product._id)}>
//             <div className="wishlist-container" onClick={(e) => handleProductWishlistToggle(product._id, e)}>
//               {wishlist.includes(product._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
//             </div>
//             <img src={`http://localhost:3001${product.img}`} alt={product.name} />
//             <h3>{product.name}</h3>
//             <p>Stock: {product.stock} Bunches</p>
//             <p>Price: Rs. {product.price}</p>
//             <button onClick={() => handleProductCardClick(product._id)}>View Details</button>
//           </div>
//         ))}
//       </div>

//       <div className="item-list">
//         <h2>Supplier's Items</h2>
//         {items.map((item) => (
//           <div className="item-card" key={item._id} onClick={() => handleItemCardClick(item._id)}>
//             <div className="wishlist-container" onClick={(e) => handleItemWishlistToggle(item._id, e)}>
//               {wishlist.includes(item._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
//             </div>
//             <img src={`http://localhost:3001${item.img}`} alt={item.name} />
//             <h3>{item.name}</h3>
//             <p>Stock: {item.stock} Bunches</p>
//             <p>Price: Rs. {item.price}</p>
//             <button onClick={() => handleItemCardClick(item._id)}>View Details</button>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default CustomerPage;