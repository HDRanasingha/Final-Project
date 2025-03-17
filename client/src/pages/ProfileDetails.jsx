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

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "",
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setProfileData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        role: user?.role || "",
      });
      setNewProfileImage(null);
      setPreviewImage(null);
    }
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("email", profileData.email);
      
      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }

      const response = await axios.put(
        `http://localhost:3001/api/users/${user._id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Update Redux state with new user data
        dispatch(
          setLogin({
            user: response.data.user,
            token: localStorage.getItem("token"),
          })
        );
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

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
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="profile-image" />
              ) : user?.profileImagePath ? (
                <img
                  src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {profileData.firstName.charAt(0)}
                  {profileData.lastName.charAt(0)}
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
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={formatRole(profileData.role)}
                  disabled
                  className="role-field"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="profile-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="edit-button"
                    onClick={handleEditToggle}
                  >
                    <Edit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={loading}
                    >
                      <Save /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleEditToggle}
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