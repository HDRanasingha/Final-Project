import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 6.9271, lng: 79.8612 }; // Default: Colombo

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Processing");
  const [position, setPosition] = useState(center);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Add your API key
  });

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    if (storedOrder && storedOrder.orderId === orderId) {
      setOrder(storedOrder);

      setTimeout(() => setStatus("Out for Delivery"), 5000);
      setTimeout(() => setStatus("Delivered"), 10000);
    }
  }, [orderId]);

  if (!order) return <h2>Loading Order Details...</h2>;

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="order-details">
        <h2>Track Your Order</h2>
        <h3>Order ID: {order.orderId}</h3>
        <h3>Status: {status}</h3>
        <h3>Grand Total: Rs. {order.total}</h3>

        {isLoaded && (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={position} zoom={12}>
            <Marker position={position} />
          </GoogleMap>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
