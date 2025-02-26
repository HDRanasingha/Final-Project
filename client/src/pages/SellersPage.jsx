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
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const res = await axios.get("http://localhost:3001/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
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
      if (editProduct) {
        setEditProduct({ ...editProduct, img: file });
      } else {
        setNewProduct({ ...newProduct, img: file });
      }
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

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.post("http://localhost:3001/api/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("stock", editProduct.stock);
    formData.append("price", editProduct.price);
    formData.append("description", editProduct.description);
    if (editProduct.img instanceof File) {
      formData.append("img", editProduct.img);
    }

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.put(
        `http://localhost:3001/api/products/edit/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        await axios.delete(`http://localhost:3001/api/products/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Handle Card Click (Navigate to Product Details)
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
              {product.stock === 0 && <div className="sold-out">Sold Out</div>}
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

        <div className="button-group">
          <button
            className="add-new-btn"
            onClick={() => {
              setEditProduct(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Product
          </button>
          <button
            className="view-orders-btn"
            onClick={() => navigate("/recived/orders")}
          >
            📦 View Orders
          </button>
        </div>

        {showForm && (
          <div className="add-product-form">
            <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={editProduct ? handleEditSubmit : handleSubmit}>
              <div className="input-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editProduct ? editProduct.name : newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={editProduct ? editProduct.stock : newProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={
                    editProduct ? editProduct.description : newProduct.description
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Price (Rs.):</label>
                <input
                  type="number"
                  name="price"
                  value={editProduct ? editProduct.price : newProduct.price}
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
                  required={!editProduct}
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
                <button type="submit">{editProduct ? "Update" : "Add"}</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditProduct(null);
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

export default SellersPage;