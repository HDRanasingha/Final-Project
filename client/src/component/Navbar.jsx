import React, { useState, useEffect } from "react";
import { IconButton, Badge } from "@mui/material";
import { Search, Person, Menu, ShoppingCart } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setLogout } from "../redux/state";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  // Load cart items count from localStorage
  useEffect(() => {
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0); // Reset cart count when user is logged out
    }
  }, [user]); // Listen for changes in the user state

  const handleLogout = () => {
    // Clear the cart from localStorage when the user logs out
    localStorage.removeItem("cart");
    setCartCount(0); // Reset cart count
    dispatch(setLogout());
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo">
          <img src="/assets/logo.png" alt="Flower SCM Logo" />
        </Link>

        {/* Search Bar */}
        <div className="navbar__search">
          <input type="text" placeholder="Search..." />
          <IconButton>
            <Search sx={{ color: "#E91E63" }} />
          </IconButton>
        </div>

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
              </>
            ) : (
              <>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/chatbot">ChatBot</Link>
                <Link to="/login" onClick={handleLogout}>
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
                <button className="hero__cta">Learn More</button>
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
        </div>
      )}
    </>
  );
};

export default Navbar;




