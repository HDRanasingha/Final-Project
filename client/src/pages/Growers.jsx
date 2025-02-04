import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import "../styles/Growers.scss";
import Footer from '../component/Footer';

const GrowersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [newFlower, setNewFlower] = useState({ name: "", stock: 1, price: 1000, img: null });
  const [imagePreview, setImagePreview] = useState("");
  const [editFlower, setEditFlower] = useState(null); // Flower being edited
  const navigate = useNavigate();

  // ✅ Fetch flowers from backend
  useEffect(() => {
    axios.get('http://localhost:3001/api/flowers/all')
      .then((res) => setFlowers(res.data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editFlower) {
      setEditFlower({ ...editFlower, [name]: value });
    } else {
      setNewFlower({ ...newFlower, [name]: value });
    }
  };

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFlower({ ...newFlower, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Increase/decrease stock and price
  const increaseValue = (field) => {
    setNewFlower((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decreaseValue = (field) => {
    setNewFlower((prev) => ({
      ...prev,
      [field]: prev[field] > 1 ? prev[field] - 1 : 1,
    }));
  };

  // ✅ Submit new flower to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newFlower.name);
    formData.append("stock", newFlower.stock);
    formData.append("price", newFlower.price);
    formData.append("img", newFlower.img);
    formData.append("growerId", "65b9ff3cdab5f4b02174a68f"); // Example Grower ID

    try {
      await axios.post("http://localhost:3001/api/flowers/add", formData);
      window.location.reload(); // Refresh to fetch updated flowers
    } catch (error) {
      console.error("Error adding flower:", error);
    }
  };

  // ✅ Handle Edit Button Click (Load Flower Details into Form)
  const handleEditClick = (flower) => {
    setEditFlower(flower);
    setShowForm(true);
  };

  // ✅ Submit Edited Flower to Backend
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/flowers/edit/${editFlower._id}`, editFlower);
      setEditFlower(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating flower:", error);
    }
  };

  // ✅ Remove flower
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this flower?")) {
      try {
        await axios.delete(`http://localhost:3001/api/flowers/delete/${id}`);
        setFlowers(flowers.filter(flower => flower._id !== id));
      } catch (error) {
        console.error("Error deleting flower:", error);
      }
    }
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
            <div className="flower-card" key={flower._id}>
              <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
              <h3>{flower.name}</h3>
              <p>Stock: {flower.stock} Bunches</p>
              <p>Price: Rs. {flower.price}</p>
              <button className="edit-btn" onClick={() => handleEditClick(flower)}>Edit</button>
              <button className="remove-btn" onClick={() => handleRemove(flower._id)}>Remove</button>
            </div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="button-group">
          <button className="add-new-btn" onClick={() => { setEditFlower(null); setShowForm(true); }}>➕ Add New Flower</button>
          <button className="view-orders-btn" onClick={() => navigate('/growers/orders')}>📦 View Orders</button>
        </div>
        
        {showForm && (
          <div className="add-flower-form">
            <h3>{editFlower ? "Edit Flower" : "Add New Flower"}</h3>
            <form onSubmit={editFlower ? handleEditSubmit : handleSubmit}>
              
              <div className="input-group">
                <label>Flower Name:</label>
                <input type="text" name="name" value={editFlower ? editFlower.name : newFlower.name} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label> Quantity (Bunches):</label>
                <input type="number" name="stock" value={editFlower ? editFlower.stock : newFlower.stock} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label> Price (Rs.):</label>
                <input type="number" name="price" value={editFlower ? editFlower.price : newFlower.price} onChange={handleInputChange} required />
              </div>

              {!editFlower && (
                <div className="input-group">
                  <label>📷 Upload Image:</label>
                  <input type="file" name="img" accept="image/*" onChange={handleImageChange} required />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>
              )}

              <div className="form-buttons">
                <button type="submit">{editFlower ? "Update" : "Add"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditFlower(null); }}>Cancel</button>
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


