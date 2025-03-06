import React, { useState, useEffect } from "react";
import { IconButton, Badge } from "@mui/material";
import { Search, Person, Menu, ShoppingCart } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";
import "../styles/Navbar.scss";
import "../styles/Customers.scss";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [flowers, setFlowers] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]); 
  const [items, setItems] = useState([]);
  // Add new state for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ flowers: [], products: [], items: [] });
  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Load cart items count from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, []); // Run only once on component mount

  useEffect(() => {
    // Fetch flowers for customers
    axios
      .get("http://localhost:3001/api/flowers/all-flowers")
      .then((res) => setFlowers(res.data))
      .catch((err) => console.error("Error fetching flowers:", err));

    // Fetch products for sellers
    axios
      .get("http://localhost:3001/api/products/all-products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch items for suppliers
    axios
      .get("http://localhost:3001/api/items/all")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const handleLogout = () => {
    // Clear the cart from localStorage when the user logs out
    localStorage.removeItem("cart");
    setCartCount(0); // Reset cart count
    dispatch(setLogout());
    navigate('/'); // Redirect to home page
  };
  // Add this inside your Navbar component, typically near other navigation elements
{user && (
  <div className="nav-dropdown">
    <button className="dropdown-btn">
      {user.name || "Profile"} <i className="fas fa-caret-down"></i>
    </button>
    <div className="dropdown-content">
      <Link to="/profile">My Profile</Link>
      <Link to="/logout" onClick={handleLogout}>Logout</Link>
    </div>
  </div>
)}
  const handleCardClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };
  const handleWishlistToggle = (flowerId, e) => {
    e.stopPropagation(); // Prevent card click event
  
    if (wishlist.includes(flowerId)) {
      setWishlist(wishlist.filter((id) => id !== flowerId));
    } else {
      setWishlist([...wishlist, flowerId]);
      navigate("/wishlist"); // Navigate to wishlist page
    }
  };
  const handleProductCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  const handleProductWishlistToggle = (productId, e) => {
    e.stopPropagation(); // Prevent card click event
  
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
      navigate("/wishlist"); // Navigate to wishlist page
    }
  };
  const handleItemCardClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };
  const handleItemWishlistToggle = (itemId, e) => {
    e.stopPropagation(); // Prevent card click event
  
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter((id) => id !== itemId));
    } else {
      setWishlist([...wishlist, itemId]);
      navigate("/wishlist"); // Navigate to wishlist page
    }
  };
  // Add search function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    try {
      const response = await axios.get(`http://localhost:3001/api/search?query=${searchQuery}`);
      setSearchResults(response.data);
      
      // Navigate to search results page with the data
      navigate('/search-results', { 
        state: { 
          flowers: response.data.flowers,
          products: response.data.products,
          items: response.data.items,
          query: searchQuery
        } 
      });
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo">
          <img src="/assets/logo.png" alt="Flower SCM Logo" />
        </Link>
  
        {/* Updated Search Bar */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="submit">
            <Search sx={{ color: "#E91E63" }} />
          </IconButton>
        </form>
  
        {/* Cart Icon with Item Count */}
        <Link to="/cart" className="navbar__cart">
          <IconButton>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart sx={{ color: "#333" }} />
            </Badge>
          </IconButton>
        </Link>
  
        {/* Account Button */}
        <button
          className="navbar__account-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Menu sx={{ color: "#333" }} />
          {user?.profileImagePath ? (
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="Profile"
              className="navbar__profile-photo"
            />
          ) : (
            <Person sx={{ color: "#333" }} />
          )}
        </button>
  
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="navbar__dropdown">
            {!user ? (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/register">Sign Up</Link>
                <Link to="/tracking">OrderTracking</Link>
              </>
            ) : (
              <>
                <Link to="/profile">Profile Details</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/chatbot">ChatBot</Link>
                <Link to="/" onClick={handleLogout}>
                  Log Out
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
  
      {/* Hero Section (Only on Home Page & Before Login) */}
      {location.pathname === "/" && !user && (
        <div className="hero">
          <header className="hero__header">
            <div className="hero__container">
              <img src="/assets/landing1.jpeg" alt="Flower SCM" className="hero__image" />
              <div className="hero__text">
                <h1>Revolutionizing the Fresh Flower Supply Chain</h1>
                <p>
                  Connecting Growers, Suppliers, Sellers, and Customers to ensure
                  <strong> real-time inventory management</strong>, optimized
                  logistics, and seamless communication—reducing waste and
                  maximizing freshness.
                </p>
                <button className="hero__cta" onClick={() => navigate('/customer')}>Shop Now</button>
              </div>
            </div>
          </header>
  
          {/* Features Section */}
          <section className="features">
            <div className="feature">
              <h3>Real-Time Inventory</h3>
              <img src="/assets/inventory.jpeg" alt="Real-Time Inventory" />
              <p>Manage your inventory live and never run out of stock.</p>
            </div>
            <div className="feature">
              <h3>Streamlined Communication</h3>
              <img src="/assets/comunication.png" alt="Streamlined Communication" />
              <p>Seamless chat integration with suppliers and buyers.</p>
            </div>
            <div className="feature">
              <h3>Optimized Logistics</h3>
              <img src="/assets/logic.jpeg" alt="Optimized Logistics" />
              <p>Reduce delays with AI-driven smart routing.</p>
            </div>
          </section>
  
          {/* Growers Flowers Section */}
          <div className="flower-list">
            <h2>Growers Flowers</h2>
            {flowers.map((flower) => (
              <div className="flower-card" key={flower._id} onClick={() => handleCardClick(flower._id)}>
                {flower.stock === 0 && <div className="sold-out">Sold Out</div>}
                <div className="wishlist-container" onClick={(e) => handleWishlistToggle(flower._id, e)}>
                  {wishlist.includes(flower._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
                </div>
                <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
                <h3>{flower.name}</h3>
                <p>Stock: {flower.stock} Bunches</p>
                <p>Price: Rs. {flower.price}</p>
                <button onClick={() => handleCardClick(flower._id)}>View Details</button>
              </div>
            ))}
          </div>
  
          {/* Sellers' Products Section */}
          <div className="product-list">
            <h2>Sellers' Products</h2>
            {products.map((product) => (
              <div className="product-card" key={product._id} onClick={() => handleProductCardClick(product._id)}>
                {product.stock === 0 && <div className="sold-out">Sold Out</div>}
                <div className="wishlist-container" onClick={(e) => handleProductWishlistToggle(product._id, e)}>
                  {wishlist.includes(product._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
                </div>
                <img src={`http://localhost:3001${product.img}`} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Stock: {product.stock} Bunches</p>
                <p>Price: Rs. {product.price}</p>
                <button onClick={() => handleProductCardClick(product._id)}>View Details</button>
              </div>
            ))}
          </div>
  
          {/* Supplier's Items Section */}
          <div className="item-list">
            <h2>Supplier's Items</h2>
            {items.map((item) => (
              <div className="item-card" key={item._id} onClick={() => handleItemCardClick(item._id)}>
                {item.stock === 0 && <div className="sold-out">Sold Out</div>}
                <div className="wishlist-container" onClick={(e) => handleItemWishlistToggle(item._id, e)}>
                  {wishlist.includes(item._id) ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
                </div>
                <img src={`http://localhost:3001${item.img}`} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Stock: {item.stock} Bunches</p>
                <p>Price: Rs. {item.price}</p>
                <button onClick={() => handleItemCardClick(item._id)}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;