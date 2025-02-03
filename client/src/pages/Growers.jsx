import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import "../styles/Growers.scss";
import Footer from '../component/Footer';

const GrowersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [newFlower, setNewFlower] = useState({ name: "", stock: 1, price: 1000, img: null });
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlower({ ...newFlower, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFlower({ ...newFlower, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle increase/decrease for stock and price
  const increaseValue = (field) => {
    setNewFlower((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decreaseValue = (field) => {
    setNewFlower((prev) => ({
      ...prev,
      [field]: prev[field] > 1 ? prev[field] - 1 : 1,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFlower.img) {
      const imageUrl = URL.createObjectURL(newFlower.img);
      setFlowers([...flowers, { ...newFlower, id: flowers.length + 1, img: imageUrl }]);
    }
    setNewFlower({ name: "", stock: 1, price: 1000, img: null });
    setImagePreview("");
    setShowForm(false);
  };

  return (
    <div className="growers-page">
      <Navbar />
      
      {/* Hero Section with Description */}
      <div className="hero-section">
        <img src="/assets/test.jpg" alt="Flower Field" className="hero-image" />
        <div className="hero-text">
          <h1>🌱 Empowering Growers</h1>
          <p>
            Growers play a vital role in the floral supply chain by cultivating and nurturing 
            high-quality flowers. Our platform enables growers to manage inventory efficiently, 
            connect with suppliers, and optimize sales for maximum profit.
          </p>
        </div>
      </div>
      
      <div className="inventory-section">
        <h2>Manage Flower Inventory</h2>
        <div className="flower-list">
          {flowers.map(flower => (
            <div className="flower-card" key={flower.id}>
              <img src={flower.img} alt={flower.name} />
              <h3>{flower.name}</h3>
              <p>Stock: {flower.stock} Bunches</p>
              <p>Price: Rs. {flower.price}</p>
              <button className="edit-btn">Edit</button>
              <button className="remove-btn">Remove</button>
            </div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="button-group">
          <button className="add-new-btn" onClick={() => setShowForm(true)}>➕ Add New Flower</button>
          <button className="view-orders-btn" onClick={() => navigate('/growers/orders')}>📦 View Orders</button>
        </div>
        
        {showForm && (
          <div className="add-flower-form">
            <h3>Add New Flower</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="input-group">
                <label>Flower Name:</label>
                <input type="text" name="name" placeholder="Enter Flower Name" value={newFlower.name} onChange={handleInputChange} required />
              </div>

              {/* Stock Quantity Field with Buttons */}
              <div className="input-group">
                <label> Quantity (Bunches):</label>
                <div className="counter">
                  <button type="button" className="decrease" onClick={() => decreaseValue('stock')}>-</button>
                  <input type="number" name="stock" value={newFlower.stock} readOnly />
                  <button type="button" className="increase" onClick={() => increaseValue('stock')}>+</button>
                </div>
              </div>

              {/* Price Field with Buttons */}
              <div className="input-group">
                <label> Price (Rs.):</label>
                <div className="counter">
                  <button type="button" className="decrease" onClick={() => decreaseValue('price')}>-</button>
                  <input type="number" name="price" value={newFlower.price} onChange={handleInputChange} required />
                  <button type="button" className="increase" onClick={() => increaseValue('price')}>+</button>
                </div>
              </div>

              {/* Image Upload with Preview */}
              <div className="input-group">
                <label>📷 Upload Image:</label>
                <input type="file" name="img" accept="image/*" onChange={handleImageChange} required />
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              </div>

              <div className="form-buttons">
                <button type="submit"> Add</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}> Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GrowersPage;



