import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";


const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const { itemId } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch item details from backend
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/items/${itemId}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error("Error fetching item details:", err));
  }, [itemId]);

  // ✅ Handle Edit Button Click
  const handleEditClick = () => {
    navigate(`/suppliers/edit-item/${item._id}`);
  };

  return (
    <div className="item-details-page">
      <Navbar />

      <div className="item-details-section">
        {item ? (
          <>
            <img
              src={`http://localhost:3001${item.img}`}
              alt={item.name}
              className="item-image"
            />
            <div className="item-info">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Stock: {item.stock} Bunches</p>
              <p>Price: Rs. {item.price}</p>
              <div className="button-group">
                <button className="edit-btn" onClick={handleEditClick}>
                  Edit Item
                </button>
                <button className="back-btn" onClick={() => navigate(-1)}>
                  Go Back
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading item details...</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ItemDetailsPage;
