import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.scss';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src="/assets/logo.png" alt="logo" />
            </div>
            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>Phone: +123456789</li>
                    <li>contact@FlowerSCM.com</li>
                </ul>
                <div className="social-icons">
                    <img src="/assets/linkedin_icon.png" alt="linkedin" />
                    <img src="/assets/facebook_icon.png" alt="facebook" />
                    <img src="/assets/twitter_icon.png" alt="twitter" />
                </div>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2024 @ FlowerSCM.com - All Rights Reserved</p>
    </div>
  );
}

export default Footer;
