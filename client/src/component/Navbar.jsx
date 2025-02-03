import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/state";
import Footer from "./Footer";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <>
      {/* Navbar Section */}
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

        {/* Account Button */}
        <button
          className="navbar__account-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Menu sx={{ color: "#333" }} />
          {!user ? (
            <Person sx={{ color: "#333" }} />
          ) : (
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="Profile"
              className="navbar__profile-photo"
            />
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
                <Link to="/customers">Customers</Link>
                <Link to="/growers">Growers</Link>
                <Link to="/suppliers">Suppliers</Link>
                <Link to="/sellers">Sellers</Link>
                <Link to="/orders">Wishlist</Link>
                <Link to="/chatbot">ChatBot</Link>
                <Link
                  to="/login"
                  onClick={() => dispatch(setLogout())}
                >
                  Log Out
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section (Visible Before Registration) */}
      {!user && (
        <div className="hero">
          <header className="hero__header">
            <div className="hero__container">
              <img
                src="/assets/landing1.jpeg"
                alt="Flower SCM"
                className="hero__image"
              />
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



