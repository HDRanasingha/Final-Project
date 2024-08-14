import React from 'react'
import '../styles/Footer.scss'



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
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>privacy policy</li>
                </ul>
            

            </div>
            <div className='footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>Phone: +123456789</li>
                    <li>contact@Cookeryparadise.com</li>
                        </ul>
                        <img src="/assets/linkedin_icon.png" alt="linkedin" />
                        <img src="/assets/facebook_icon.png" alt="facebook" />
                        <img src="/assets/twitter_icon.png" alt="twitter" />

            </div>
        </div>
      <hr/>
      
      <p className='footer-copyright'>Copyright 2024 @ CookeryParadise.com-All Right Reserved</p>
      
    </div>
  )
}

export default Footer
