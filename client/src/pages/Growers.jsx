import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../styles/Growers.scss";
import Footer from "../component/Footer";

const GrowersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [newFlower, setNewFlower] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editFlower, setEditFlower] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch flowers from backend
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const res = await axios.get("http://localhost:3001/api/flowers/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlowers(res.data);
      } catch (err) {
        console.error("Error fetching flowers:", err);
      }
    };

    fetchFlowers();
  }, []);

  // ✅ Handle input changes (Fix for description)
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
      if (editFlower) {
        setEditFlower({ ...editFlower, img: file });
      } else {
        setNewFlower({ ...newFlower, img: file });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit new flower to backend (Fix: Include description)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newFlower.name);
    formData.append("stock", newFlower.stock);
    formData.append("price", newFlower.price);
    formData.append("description", newFlower.description); // ✅ Added description
    formData.append("img", newFlower.img);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.post("http://localhost:3001/api/flowers/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding flower:", error);
    }
  };

  // ✅ Handle Edit Button Click
  const handleEditClick = (flower) => {
    setEditFlower(flower);
    setShowForm(true);
  };

  // ✅ Submit Edited Flower (Fix: Include description and image)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editFlower.name);
    formData.append("stock", editFlower.stock);
    formData.append("price", editFlower.price);
    formData.append("description", editFlower.description); // ✅ Added description
    if (editFlower.img instanceof File) {
      formData.append("img", editFlower.img);
    }

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.put(
        `http://localhost:3001/api/flowers/edit/${editFlower._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        await axios.delete(`http://localhost:3001/api/flowers/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlowers(flowers.filter((flower) => flower._id !== id));
      } catch (error) {
        console.error("Error deleting flower:", error);
      }
    }
  };

  // ✅ Handle Card Click (Navigate to Flower Details)
  const handleCardClick = (flowerId) => {
    navigate(`/flower/${flowerId}`);
  };

  return (
    <div className="growers-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <img src="/assets/test.jpg" alt="Flower Field" className="hero-image" />
        <div className="hero-text">
          <h1>🌱 Empowering Growers</h1>
          <p>
            Growers play a vital role in the floral supply chain by cultivating
            and nurturing high-quality flowers. Our platform enables growers to
            manage inventory efficiently, connect with suppliers, and optimize
            sales for maximum profit.
          </p>
        </div>
      </div>

      <div className="inventory-section">
        <h2>Manage Flower Inventory</h2>
        <div className="flower-list">
          {flowers.map((flower) => (
            <div
              className="flower-card"
              key={flower._id}
              onClick={() => handleCardClick(flower._id)}
              style={{ cursor: "pointer" }} // Makes it look clickable
            >
              {flower.stock === 0 && <div className="sold-out">Sold Out</div>}
              <img
                src={`http://localhost:3001${flower.img}`}
                alt={flower.name}
              />
              <h3>{flower.name}</h3>
              <p>Stock: {flower.stock} Bunches</p>
              <p>Price: Rs. {flower.price}</p>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(flower);
                }}
              >
                Edit
              </button>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(flower._id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="button-group">
          <button
            className="add-new-btn"
            onClick={() => {
              setEditFlower(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Flower
          </button>
          <button
            className="view-orders-btn"
            onClick={() => navigate("/recived/orders")}
          >
            📦 View Orders
          </button>
        </div>

        {showForm && (
          <div className="add-flower-form">
            <h3>{editFlower ? "Edit Flower" : "Add New Flower"}</h3>
            <form onSubmit={editFlower ? handleEditSubmit : handleSubmit}>
              <div className="input-group">
                <label>Flower Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editFlower ? editFlower.name : newFlower.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Quantity (Bunches):</label>
                <input
                  type="number"
                  name="stock"
                  value={editFlower ? editFlower.stock : newFlower.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Description:</label>
                <textarea
                  name="description"
                  value={
                    editFlower ? editFlower.description : newFlower.description
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Price (Rs.):</label>
                <input
                  type="number"
                  name="price"
                  value={editFlower ? editFlower.price : newFlower.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>📷 Upload Image:</label>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editFlower}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>

              <div className="form-buttons">
                <button type="submit">{editFlower ? "Update" : "Add"}</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditFlower(null);
                  }}
                >
                  Cancel
                </button>
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