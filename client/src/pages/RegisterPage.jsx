import React, { useEffect, useState } from "react";
import "../styles/Register.scss";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaImage, FaUserPlus } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    role: "Grower", // Default role
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.password === "");
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "profileImage" && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
      setFormData({
        ...formData,
        profileImage: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordMatch) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setErrorMessage("");

    try {
      const register_form = new FormData();

      for (var key in formData) {
        register_form.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });
      
      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again later.");
      console.log("Registration failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-overlay"></div>
          <div className="register-content">
            <h1>FlowerSCM</h1>
            <p>Join our network of flower supply chain professionals</p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">🌱</span>
                <span>Connect with growers and suppliers</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌿</span>
                <span>Manage your inventory efficiently</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌷</span>
                <span>Grow your flower business</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="register-right">
          <div className="register-form-container">
            <div className="register-header">
              <h2>Create an Account</h2>
              <p>Please fill in your details to register</p>
            </div>
            
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-with-icon">
                    <div className="icon-container">
                      <FaUser className="input-icon" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-with-icon">
                    <div className="icon-container">
                      <FaUser className="input-icon" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaEnvelope className="input-icon" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaLock className="input-icon" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaLock className="input-icon" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={!passwordMatch ? "input-error" : ""}
                  />
                </div>
                {!passwordMatch && <p className="error-text">Passwords do not match</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaUserTag className="input-icon" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="Grower">Grower</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Seller">Seller</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Profile Preview" />
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaImage />
                      <span>Upload Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="file-input"
                  />
                </div>
              </div>
              
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              
              <div className="form-actions">
                <button type="submit" className="register-button" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <FaUserPlus /> Register
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="register-footer">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

