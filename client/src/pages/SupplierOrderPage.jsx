// //import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "../component/Navbar";
// import Footer from "../component/Footer";


// const SupplierOrderPage = () => {
//   const [orders, setOrders] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   const supplierId = user._id;

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/orders", {
//         params: {
//           supplierId,
//         },
//       })
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setOrders(res.data);
//         } else {
//           console.error("Invalid data format:", res.data);
//         }
//       })
//       .catch((err) => console.error("Error fetching orders:", err));
//   }, [supplierId]);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const response = await axios.put(`http://localhost:3001/api/orders/${orderId}/status`, { status: newStatus });
//       const updatedOrder = response.data.order;
//       setOrders((prevOrders) =>
//         prevOrders.map((order) => (order.orderId === orderId ? updatedOrder : order))
//       );
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   return (
//     <div className="supplier-orders-page">
//       <Navbar />
//       <div className="orders-container">
//         <h1>📦 Supplier Orders</h1>
//         {orders.length > 0 ? (
//           <ul className="order-list">
//             {orders.map((order) => (
//               <li key={order._id} className="order-card">
//                 <h3>Order ID: {order.orderId || order._id}</h3>
//                 <p>Customer: {order.customer?.name || "Unknown"}</p>
//                 <p>Status: {order.status || "Pending"}</p>
//                 <p>Ordered At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
//                 <ul>
//                   {order.items
//                     .filter((item) => item.supplierId === supplierId)
//                     .map((item) => (
//                       <li key={item._id}>
//                         <p>Item Name: {item.name}</p>
//                         <p>Price: Rs. {item.price.toFixed(2)}</p>
//                         <p>Quantity: {item.quantity}</p>
//                       </li>
//                     ))}
//                 </ul>
//                 <select
//                   value={order.status}
//                   onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
//                 >
//                   <option value="Processing">Processing</option>
//                   <option value="Shipped">Shipped</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No orders found.</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default SupplierOrderPage;