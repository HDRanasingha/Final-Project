// //import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "../styles/SearchResults.scss";
// import Footer from "../component/Footer";
// import Navbar from "../component/Navbar";


// const SearchResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { flowers, products, items } = location.state || { flowers: [], products: [], items: [] };

//   const handleCardClick = (id, type) => {
//     navigate(`/${type}/${id}`);
//   };

//   return (

//     <div>
//     <Navbar />
//     <div className="search-results-page">
//       <h2>Search Results</h2>
//       <div className="results-section">
//         <h3>Flowers</h3>
//         <div className="flower-list">
//           {flowers.map((flower) => (
//             <div className="flower-card" key={flower._id} onClick={() => handleCardClick(flower._id, 'flower')}>
//               <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
//               <h3>{flower.name}</h3>
//               <p>Stock: {flower.stock} Bunches</p>
//               <p>Price: Rs. {flower.price}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="results-section">
//         <h3>Products</h3>
//         <div className="product-list">
//           {products.map((product) => (
//             <div className="product-card" key={product._id} onClick={() => handleCardClick(product._id, 'product')}>
//               <img src={`http://localhost:3001${product.img}`} alt={product.name} />
//               <h3>{product.name}</h3>
//               <p>Stock: {product.stock} Bunches</p>
//               <p>Price: Rs. {product.price}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="results-section">
//         <h3>Items</h3>
//         <div className="item-list">
//           {items.map((item) => (
//             <div className="item-card" key={item._id} onClick={() => handleCardClick(item._id, 'item')}>
//               <img src={`http://localhost:3001${item.img}`} alt={item.name} />
//               <h3>{item.name}</h3>
//               <p>Stock: {item.stock} Bunches</p>
//               <p>Price: Rs. {item.price}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//     <Footer />
//     </div>
//   );
// };

// export default SearchResults;