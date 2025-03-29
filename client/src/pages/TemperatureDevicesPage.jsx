import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import "../styles/TemperatureDevices.scss";
import { FaPlus, FaEdit, FaTrash, FaQrcode, FaPrint, FaThermometerHalf } from "react-icons/fa";

const TemperatureDevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    minTemperature: 2,
    maxTemperature: 8,
    status: "active"
  });

  // Fetch temperature devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/temperature-devices/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevices(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching temperature devices:", err);
        setError("Failed to load temperature devices. Please try again later.");
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      minTemperature: 2,
      maxTemperature: 8,
      status: "active"
    });
    setEditingDevice(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      if (editingDevice) {
        // Update existing device
        await axios.put(
          `http://localhost:3001/api/temperature-devices/edit/${editingDevice._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Add new device
        await axios.post(
          "http://localhost:3001/api/temperature-devices/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      
      // Refresh devices list
      const res = await axios.get("http://localhost:3001/api/temperature-devices/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setDevices(res.data);
      resetForm();
    } catch (error) {
      console.error("Error saving temperature device:", error);
      setError("Failed to save temperature device. Please try again.");
    }
  };

  // Handle edit button click
  const handleEdit = (device) => {
    setFormData({
      name: device.name,
      location: device.location,
      minTemperature: device.minTemperature,
      maxTemperature: device.maxTemperature,
      status: device.status
    });
    setEditingDevice(device);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this temperature device?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/temperature-devices/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Remove device from state
        setDevices(devices.filter(device => device._id !== id));
      } catch (error) {
        console.error("Error deleting temperature device:", error);
        setError("Failed to delete temperature device. Please try again.");
      }
    }
  };

  // Handle temperature update
  const handleUpdateTemperature = async (id) => {
    const newTemp = prompt("Enter current temperature (°C):");
    if (newTemp === null) return;
    
    const temperature = parseFloat(newTemp);
    if (isNaN(temperature)) {
      alert("Please enter a valid number");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3001/api/temperature-devices/update-temperature/${id}`,
        { currentTemperature: temperature },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update device in state
      setDevices(devices.map(device => 
        device._id === id ? res.data : device
      ));
    } catch (error) {
      console.error("Error updating temperature:", error);
      setError("Failed to update temperature. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="temperature-devices-page">
      <Navbar />
      
      <div className="devices-container">
        <h1>Temperature Monitoring Devices</h1>
        <p className="description">
          Monitor and manage temperature conditions for your flower storage areas
        </p>
        
        <div className="actions-bar">
          <button 
            className="add-device-btn" 
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FaPlus /> Add New Device
          </button>
        </div>
        
        {showForm && (
          <div className="device-form-container">
            <div className="device-form">
              <h2>{editingDevice ? "Edit Temperature Device" : "Add New Temperature Device"}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Device Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Cold Storage #1"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Warehouse A, Section 3"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Minimum Temperature (°C)</label>
                    <input
                      type="number"
                      name="minTemperature"
                      value={formData.minTemperature}
                      onChange={handleInputChange}
                      step="0.1"
                      required
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>Maximum Temperature (°C)</label>
                    <input
                      type="number"
                      name="maxTemperature"
                      value={formData.maxTemperature}
                      onChange={handleInputChange}
                      step="0.1"
                      required
                    />
                  </div>
                  
                  {editingDevice && (
                    <div className="form-group half">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    {editingDevice ? "Update Device" : "Add Device"}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="loading">Loading temperature devices...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : devices.length === 0 ? (
          <div className="no-devices">
            <p>No temperature monitoring devices found.</p>
            <p>Add your first device to start monitoring temperatures.</p>
          </div>
        ) : (
          <div className="devices-grid">
            {devices.map((device) => (
              <div key={device._id} className="device-card">
                <div className="device-header">
                  <h3>{device.name}</h3>
                  <span className={`device-status ${device.status}`}>
                    {device.status}
                  </span>
                </div>
                
                <div className="device-details">
                  <p><strong>Location:</strong> {device.location}</p>
                  <p>
                    <strong>Current Temperature:</strong> 
                    {device.currentTemperature !== null 
                      ? `${device.currentTemperature}°C` 
                      : "Not recorded"}
                  </p>
                  <p><strong>Acceptable Range:</strong> {device.minTemperature}°C to {device.maxTemperature}°C</p>
                  <p><strong>Last Updated:</strong> {formatDate(device.lastUpdated)}</p>
                  
                  {device.currentTemperature !== null && (
                    <p className={
                      device.currentTemperature < device.minTemperature || 
                      device.currentTemperature > device.maxTemperature 
                        ? "temperature-alert" 
                        : "temperature-normal"
                    }>
                      <strong>Status:</strong> 
                      {device.currentTemperature < device.minTemperature 
                        ? "Too Cold!" 
                        : device.currentTemperature > device.maxTemperature 
                          ? "Too Hot!" 
                          : "Normal"}
                    </p>
                  )}
                </div>
                
                <div className="device-actions">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEdit(device)}
                  >
                    <FaEdit /> Edit
                  </button>
                  
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(device._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                  
                  <button 
                    className="action-btn qr-btn" 
                    onClick={() => handleUpdateTemperature(device._id)}
                  >
                    <FaThermometerHalf /> Update Temp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TemperatureDevicesPage;