import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import "../styles/SellerPage.scss";
import Footer from "../component/Footer";

const SellersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: 1,
    price: 1000,
    description: "",
    img: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products/all")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new product to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("stock", newProduct.stock);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("img", newProduct.img);
    formData.append("sellerId", "65b9ff3cdab5f4b02174a68f");

    try {
      await axios.post("http://localhost:3001/api/products/add", formData);
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  // Submit Edited Product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/products/edit/${editProduct._id}`,
        editProduct
      );
      setEditProduct(null);
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Remove product
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/api/products/delete/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  // ✅ Handle Card Click (Navigate to Flower Details)
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="sellers-page">
      <Navbar />
      <div className="hero-section">
        <img
          src="/assets/seller.jpeg"
          alt="Marketplace"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>🛒 Seller Marketplace</h1>
          <p>
            Sellers can list high-quality products for customers, manage stock,
            and track sales. Optimize your business with real-time insights.
          </p>
        </div>
      </div>

      <div className="inventory-section">
        <h2>Manage Flower Inventory</h2>
        <div className="product-list">
          {products.map((product) => (
            <div
              className="product-card"
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              style={{ cursor: "pointer" }} // Makes it look clickable
            >
              <img
                src={`http://localhost:3001${product.img}`}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>Stock: {product.stock} Bunches</p>
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

        <button className="add-new-btn" onClick={() => setShowForm(true)}>
          ➕ Add New Product
        </button>
        <button
          className="view-orders-btn"
          onClick={() => navigate("/sellers/orders")}
        >
          📦 View Orders
        </button>
      </div>

      {showForm && (
        <div className="add-product-form">
          <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={editProduct ? handleEditSubmit : handleSubmit}>
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={editProduct ? editProduct.name : newProduct.name}
              onChange={handleInputChange}
              required
            />
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={editProduct ? editProduct.stock : newProduct.stock}
              onChange={handleInputChange}
              required
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={
                editProduct ? editProduct.description : newProduct.description
              }
              onChange={handleInputChange}
              required
            />
            <label>Price (Rs.):</label>
            <input
              type="number"
              name="price"
              value={editProduct ? editProduct.price : newProduct.price}
              onChange={handleInputChange}
              required
            />
            {!editProduct && (
              <>
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
              </>
            )}
            <button type="submit">{editProduct ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SellersPage;
