import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../styles/supplier.scss";
import Footer from "../component/Footer";

const SupplierPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const res = await axios.get("http://localhost:3001/api/items/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // ✅ Handle input changes (Fix for description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem({ ...editItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editItem) {
        setEditItem({ ...editItem, img: file });
      } else {
        setNewItem({ ...newItem, img: file });
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit new item to backend (Fix: Include description)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("stock", newItem.stock);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description); // ✅ Added description
    formData.append("img", newItem.img);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.post("http://localhost:3001/api/items/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // ✅ Handle Edit Button Click
  const handleEditClick = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  // ✅ Submit Edited Item (Fix: Include description and image)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editItem.name);
    formData.append("stock", editItem.stock);
    formData.append("price", editItem.price);
    formData.append("description", editItem.description); // ✅ Added description
    if (editItem.img instanceof File) {
      formData.append("img", editItem.img);
    }

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.put(
        `http://localhost:3001/api/items/edit/${editItem._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditItem(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // ✅ Remove item
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        await axios.delete(`http://localhost:3001/api/items/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(items.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // ✅ Handle Card Click (Navigate to Item Details)
  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="suppliers-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <img src="/assets/supplier.jpg" alt="Supplier Image" className="hero-image" />
        <div className="hero-text">
          <h1> Empowering Suppliers</h1>
          <p>
            Suppliers provide essential products that sustain the floral supply chain.
            Our platform helps suppliers manage inventory efficiently, connect with growers,
            and streamline sales for maximum profit.
          </p>
        </div>
      </div>

      <div className="inventory-section">
        <h2>Manage Item Inventory</h2>
        <div className="item-list">
          {items.map((item) => (
            <div
              className="item-card"
              key={item._id}
              onClick={() => handleCardClick(item._id)}
              style={{ cursor: "pointer" }} // Makes it look clickable
            >
              {item.stock === 0 && <div className="sold-out">Sold Out</div>}
              <img
                src={`http://localhost:3001${item.img}`}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>Stock: {item.stock} Bunches</p>
              <p>Price: Rs. {item.price}</p>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(item);
                }}
              >
                Edit
              </button>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item._id);
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
              setEditItem(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Item
          </button>
          <button
            className="view-orders-btn"
            onClick={() => navigate("/suppliers/orders")}
          >
            📦 View Orders
          </button>
        </div>

        {showForm && (
          <div className="add-item-form">
            <h3>{editItem ? "Edit Item" : "Add New Item"}</h3>
            <form onSubmit={editItem ? handleEditSubmit : handleSubmit}>
              <div className="input-group">
                <label>Item Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editItem ? editItem.name : newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Quantity (Bunches):</label>
                <input
                  type="number"
                  name="stock"
                  value={editItem ? editItem.stock : newItem.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editItem ? editItem.description : newItem.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Price (Rs.):</label>
                <input
                  type="number"
                  name="price"
                  value={editItem ? editItem.price : newItem.price}
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
                  required={!editItem}
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
                <button type="submit">{editItem ? "Update" : "Add"}</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditItem(null);
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

export default SupplierPage;