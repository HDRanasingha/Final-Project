import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const SellerPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFlower, setNewFlower] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [editFlower, setEditFlower] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sellers/flowers")
      .then((res) => setFlowers(res.data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editFlower) {
      setEditFlower({ ...editFlower, [name]: value });
    } else {
      setNewFlower({ ...newFlower, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFlower({ ...newFlower, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newFlower.name);
    formData.append("stock", newFlower.stock);
    formData.append("price", newFlower.price);
    formData.append("description", newFlower.description);
    formData.append("img", newFlower.img);

    try {
      await axios.post("http://localhost:3001/api/sellers/add-flower", formData);
      window.location.reload();
    } catch (error) {
      console.error("Error adding flower:", error);
    }
  };

  const handleEditClick = (flower) => {
    setEditFlower(flower);
    setShowForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/sellers/edit-flower/${editFlower._id}`,
        editFlower
      );
      setEditFlower(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating flower:", error);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this flower?")) {
      try {
        await axios.delete(`http://localhost:3001/api/sellers/delete-flower/${id}`);
        setFlowers(flowers.filter((flower) => flower._id !== id));
      } catch (error) {
        console.error("Error deleting flower:", error);
      }
    }
  };

  const handleViewOrders = () => {
    navigate("/seller/orders");
  };

  return (
    <div className="seller-page">
      <Navbar />

      <div className="hero-section">
        <h1>📦 Seller Dashboard</h1>
        <p>Manage your flower inventory and track customer orders.</p>
      </div>

      <div className="inventory-section">
        <h2>Your Flower Listings</h2>
        <div className="flower-list">
          {flowers.map((flower) => (
            <div className="flower-card" key={flower._id}>
              <img src={`http://localhost:3001${flower.img}`} alt={flower.name} />
              <h3>{flower.name}</h3>
              <p>Stock: {flower.stock} Bunches</p>
              <p>Price: Rs. {flower.price}</p>
              <button className="edit-btn" onClick={() => handleEditClick(flower)}>
                ✏️ Edit
              </button>
              <button className="remove-btn" onClick={() => handleRemove(flower._id)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="add-btn" onClick={() => setShowForm(true)}>➕ Add New Flower</button>
          <button className="view-orders-btn" onClick={handleViewOrders}>📦 View Orders</button>
        </div>

        {showForm && (
          <div className="add-flower-form">
            <h3>{editFlower ? "Edit Flower" : "Add New Flower"}</h3>
            <form onSubmit={editFlower ? handleEditSubmit : handleSubmit}>
              <label>Flower Name:</label>
              <input type="text" name="name" value={editFlower ? editFlower.name : newFlower.name} onChange={handleInputChange} required />

              <label>Quantity (Bunches):</label>
              <input type="number" name="stock" value={editFlower ? editFlower.stock : newFlower.stock} onChange={handleInputChange} required />

              <label>Description:</label>
              <textarea name="description" value={editFlower ? editFlower.description : newFlower.description} onChange={handleInputChange} required />

              <label>Price (Rs.):</label>
              <input type="number" name="price" value={editFlower ? editFlower.price : newFlower.price} onChange={handleInputChange} required />

              {!editFlower && (
                <>
                  <label>Upload Image:</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} required />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </>
              )}

              <button type="submit">{editFlower ? "Update Flower" : "Add Flower"}</button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SellerPage;
