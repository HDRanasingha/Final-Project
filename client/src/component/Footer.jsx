import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Flower Garden</h3>
          <p>
            We are dedicated to providing the freshest and most beautiful flowers for all occasions. 
            Our expert florists create stunning arrangements that bring joy and beauty to your special moments.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/growers">Growers</Link></li>
            <li><Link to="/sellers">Sellers</Link></li>
            <li><Link to="/tracking">Track Order</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Flower Street, Colombo, Sri Lanka</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+94 123 456 789</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>contact@FlowerSCM.com</span>
            </div>
            <div className="contact-item">
              <FaClock />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for updates on new arrivals, special offers, and flower care tips.</p>
          <div className="newsletter-form">
            <div className="form-group">
              <input type="email" placeholder="Your Email Address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Flower Garden. All Rights Reserved. 
          Designed with <span style={{ color: "#ff7e5f" }}>♥</span> by FlowerSCM
        </p>
      </div>
    </footer>
  );
};

export default Footer;
