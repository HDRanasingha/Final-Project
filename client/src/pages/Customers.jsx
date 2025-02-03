
import React from "react";

const Customers = () => {
  const flowers = [
    { id: 1, name: "Roses", price: "$15", image: "/images/roses.jpg" },
    { id: 2, name: "Tulips", price: "$12", image: "/images/tulips.jpg" },
    { id: 3, name: "Orchids", price: "$20", image: "/images/orchids.jpg" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Welcome, Customers!</h1>
          <p className="text-gray-700 text-lg mt-2">
            Browse available fresh flowers and manage your orders.
          </p>
        </header>

        {/* Product Listings */}
        <section className="grid md:grid-cols-3 gap-6">
          {flowers.map((flower) => (
            <div key={flower.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={flower.image}
                alt={flower.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">{flower.name}</h3>
              <p className="text-gray-600">{flower.price}</p>
              <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                Order Now
              </button>
            </div>
          ))}
        </section>

        {/* Order Tracking Section */}
        <section className="mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Track Your Orders</h2>
          <p className="text-gray-600 mt-2">Check the status of your flower orders in real-time.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            View Orders
          </button>
        </section>

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-yellow-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition">
            💬 Chat with Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
