import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../styles/supplier.scss";
import Footer from "../component/Footer";

const SuppliersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [suppliersProducts, setSuppliersProducts] = useState([]);
  const [newSuppliersProduct, setNewSuppliersProduct] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editSuppliersProduct, setEditSuppliersProduct] = useState(null);
  const navigate = useNavigate();

  // Fetch suppliers' products from backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/suppliersProducts/all")
      .then((res) => setSuppliersProducts(res.data))
      .catch((err) => console.error("Error fetching suppliers' products:", err));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editSuppliersProduct) {
      setEditSuppliersProduct({ ...editSuppliersProduct, [name]: value });
    } else {
      setNewSuppliersProduct({ ...newSuppliersProduct, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSuppliersProduct({ ...newSuppliersProduct, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new suppliers' product to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newSuppliersProduct.name);
    formData.append("stock", newSuppliersProduct.stock);
    formData.append("price", newSuppliersProduct.price);
    formData.append("description", newSuppliersProduct.description);
    formData.append("img", newSuppliersProduct.img);
    formData.append("supplierId", "65b9ff3cdab5f4b02174a68f");

    try {
      await axios.post("http://localhost:3001/api/suppliersProducts/add", formData);
      window.location.reload();
    } catch (error) {
      console.error("Error adding suppliers' product:", error);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (suppliersProduct) => {
    setEditSuppliersProduct(suppliersProduct);
    setShowForm(true);
  };

  // Submit Edited Suppliers' Product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/suppliersProducts/edit/${editSuppliersProduct._id}`,
        editSuppliersProduct
      );
      setEditSuppliersProduct(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating suppliers' product:", error);
    }
  };

  // Remove suppliers' product
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/api/suppliersProducts/delete/${id}`);
        setSuppliersProducts(suppliersProducts.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting suppliers' product:", error);
      }
    }
  };

  // Handle Card Click (Navigate to Product Details)
  const handleCardClick = (productId) => {
    navigate(`/suppliersProduct/${productId}`);
  };

  return (
    <div className="suppliers-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <img src="/assets/supplier.jpg" alt="Product Field" className="hero-image" />
        <div className="hero-text">
          <h1> Empowering Suppliers</h1>
          <p>
            Suppliers play a key role in the floral supply chain by providing high-quality products to meet customer demand.
            Our platform helps suppliers manage inventory, connect with retailers, and optimize sales for maximum profitability.
          </p>
        </div>
      </div>

      <div className="inventory-section">
        <h2>Manage Product Inventory</h2>
        <div className="suppliersProduct-list">
          {suppliersProducts.map((product) => (
            <div
              className="suppliersProduct-card"
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:3001${product.img}`}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>Stock: {product.stock} Units</p>
              <p>Price: Rs. {product.price}</p>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(product);
                }}
              >
                Edit
              </button>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(product._id);
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
              setEditSuppliersProduct(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Product
          </button>
          <button
            className="view-orders-btn"
            onClick={() => navigate("/suppliers/orders")}
          >
            📦 View Orders
          </button>
        </div>

        {showForm && (
          <div className="add-suppliersProduct-form">
            <h3>{editSuppliersProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={editSuppliersProduct ? handleEditSubmit : handleSubmit}>
              <div className="input-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editSuppliersProduct ? editSuppliersProduct.name : newSuppliersProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Quantity (Units):</label>
                <input
                  type="number"
                  name="stock"
                  value={editSuppliersProduct ? editSuppliersProduct.stock : newSuppliersProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Description:</label>
                <textarea
                  name="description"
                  value={editSuppliersProduct ? editSuppliersProduct.description : newSuppliersProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label> Price (Rs.):</label>
                <input
                  type="number"
                  name="price"
                  value={editSuppliersProduct ? editSuppliersProduct.price : newSuppliersProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!editSuppliersProduct && (
                <div className="input-group">
                  <label>📷 Upload Image:</label>
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>
              )}

              <div className="form-buttons">
                <button type="submit">{editSuppliersProduct ? "Update" : "Add"}</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditSuppliersProduct(null);
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

export default SuppliersPage;
