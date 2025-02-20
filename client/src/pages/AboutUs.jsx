import React from 'react';
import '../styles/AboutUs.scss';
import Footer from '../component/Footer';

const AboutUs = () => {
  return (
    <div>
    <div className="about-us-page">
      <section className="about-header">
        <h1>About FlowerSCM</h1>
        <p>Your trusted partner in fresh flower supply chain management, optimizing logistics and inventory with real-time solutions.</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At FlowerSCM, we are revolutionizing the flower supply chain by focusing on enhancing communication, ensuring real-time inventory tracking, and optimizing logistics management.
          We aim to provide seamless, efficient solutions to growers, suppliers, and retailers, ensuring that fresh flowers are always delivered on time and in optimal condition.
        </p>
      </section>

      <section className="about-vision">
        <h2>Our Vision</h2>
        <p>
          Our vision is to become the leading platform for flower supply chain management, connecting growers, wholesalers, and retailers with cutting-edge technology. We believe in empowering businesses through transparency, reliability, and efficiency.
        </p>
      </section>

      <section className="about-approach">
        <h2>Our Approach</h2>
        <div className="approach-items">
          <div className="approach-item">
            <h3>Real-Time Inventory</h3>
            <p>With our real-time inventory system, businesses can manage stock levels effortlessly, ensuring fresh flowers are always available when needed.</p>
          </div>
          <div className="approach-item">
            <h3>Enhanced Communication</h3>
            <p>We provide direct communication channels between growers, suppliers, and retailers, ensuring smooth coordination throughout the supply chain.</p>
          </div>
          <div className="approach-item">
            <h3>Logistics Management</h3>
            <p>Our platform tracks logistics in real-time, making it easier to monitor deliveries and ensure flowers are transported in the best possible condition.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src="/assets/member.jpg" alt="Team Member 1" />
            <h3>Hashini Ranasingha</h3>
            <p>Bsc.Hons In Computer Science</p>
            <p>An Undergraduate Student at the  University of Plymouth</p>
          </div>
          
        </div>
        
      </section>

    </div>
    <Footer />
    </div>
  
  );
  
};

export default AboutUs;

