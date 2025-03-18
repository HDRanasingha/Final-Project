import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogin } from "../redux/state";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/ProfileDetails.scss";
import { Edit, Save, Cancel, PhotoCamera } from "@mui/icons-material";

const ProfileDetails = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Separate state for view mode and edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [viewData, setViewData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize data when user is loaded
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "",
      };
      setViewData(userData);
      setEditData(userData);
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Debug user state changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  // Debug edit mode changes
  useEffect(() => {
    console.log("Edit mode changed:", isEditing);
  }, [isEditing]);

  // Start editing - switch to edit mode with improved state handling
  const handleStartEdit = () => {
    // First set the edit data to match current user data
    const currentUserData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
    };
    
    setEditData(currentUserData);
    setNewProfileImage(null);
    setPreviewImage(null);
    setError("");
    setSuccess("");
    
    // Set editing mode in a separate state update to ensure it happens after data is prepared
    setTimeout(() => {
      setIsEditing(true);
    }, 0);
  };

  // Cancel editing - with improved cleanup
  const handleCancelEdit = () => {
    // Clean up resources first
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
    setNewProfileImage(null);
    setError("");
    setSuccess("");
    
    // Exit edit mode after cleanup
    setIsEditing(false);
  };

  // Submit changes with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if not in edit mode
    if (!isEditing) {
      console.log("Not in edit mode, preventing submission");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create a new FormData object for each submission
      const formData = new FormData();
      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("email", editData.email);

      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Make the API call
      const response = await axios({
        method: 'put',
        url: `http://localhost:3001/api/users/${user._id}/update`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      // Handle successful response
      if (response.data.user) {
        // Update Redux state
        dispatch(
          setLogin({
            user: response.data.user,
            token: token,
          })
        );
        
        // Update view data
        setViewData({
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          email: response.data.user.email || "",
          role: response.data.user.role || "",
        });
        
        setSuccess("Profile updated successfully!");
        
        // Exit edit mode after a short delay to ensure success message is seen
        setTimeout(() => {
          setIsEditing(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Determine which data to display based on mode
  const displayData = isEditing ? editData : viewData;

  return (
    <div className="profile-details-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Details</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <div className="profile-image-container">
              {isEditing && previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="profile-image" />
              ) : user?.profileImagePath ? (
                <img
                  src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {displayData.firstName.charAt(0)}
                  {displayData.lastName.charAt(0)}
                </div>
              )}
              {isEditing && (
                <div className="image-upload">
                  <label htmlFor="profile-image-upload" className="image-upload-label">
                    <PhotoCamera />
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="profile-details-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={displayData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={displayData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={displayData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={formatRole(displayData.role)}
                  disabled={true}
                  className="role-field"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="profile-actions">
                {!isEditing ? (
                  <button type="button" className="edit-button" onClick={handleStartEdit}>
                    <Edit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button type="submit" className="save-button" disabled={loading}>
                      <Save /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <Cancel /> Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileDetails;