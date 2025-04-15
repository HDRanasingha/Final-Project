import React from 'react';
import '../styles/PrivacyPolicy.scss';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <Navbar />
      
      <section className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Effective Date: February 2025</p>
      </section>

      <section className="privacy-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to FlowerSCM. Your privacy is important to us, and we are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following types of information when you use our platform:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email, phone number, and billing details.</li>
          <li><strong>Business Information:</strong> Grower, supplier, or retailer details.</li>
          <li><strong>Transactional Data:</strong> Orders, payments, and shipment details.</li>
          <li><strong>Technical Information:</strong> IP address, browser type, and device data.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use collected data to:</p>
        <ul>
          <li>Facilitate order processing and deliveries.</li>
          <li>Improve user experience and customer support.</li>
          <li>Ensure secure transactions and prevent fraud.</li>
          <li>Send updates, promotions, and service-related notifications.</li>
        </ul>

        <h2>4. Data Protection & Security</h2>
        <p>
          We implement strong security measures to protect your data against unauthorized access, alteration, and misuse. 
          However, no online platform is 100% secure.
        </p>

        <h2>5. Sharing of Information</h2>
        <p>We do not sell your personal data. However, we may share it with:</p>
        <ul>
          <li>Trusted logistics partners for order fulfillment.</li>
          <li>Payment processors to handle secure transactions.</li>
          <li>Law enforcement if required by legal authorities.</li>
        </ul>

        <h2>6. Cookies & Tracking Technologies</h2>
        <p>
          We use cookies to improve your browsing experience. You can manage your cookie preferences in your browser settings.
        </p>

        <h2>7. Your Rights & Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal data.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request a copy of the data we store.</li>
        </ul>

        <h2>8. Policy Updates</h2>
        <p>
          We may update this Privacy Policy periodically. Any changes will be posted on this page, and we encourage users to review it regularly.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this policy, contact us at <a href="mailto:privacy@flowerscm.com">privacy@flowerscm.com</a>.
        </p>
      </section>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
