import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "recharts";


const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirect if not admin
    }
    fetchUsers();
    fetchSalesData();
    fetchIncomeData();
  }, [user, navigate]);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3001/users");
    const data = await response.json();
    setUsers(data);
  };

  const fetchSalesData = async () => {
    const response = await fetch("http://localhost:3001/sales-data");
    const data = await response.json();
    setSalesData(data);
  };

  const fetchIncomeData = async () => {
    const response = await fetch("http://localhost:3001/income-data");
    const data = await response.json();
    setIncomeData(data);
  };

  const handleDeleteUser = async (userId) => {
    await fetch(`http://localhost:3001/users/${userId}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin_users">
        <h2>Manage Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u._id}>
              {u.name} ({u.role})
              <button onClick={() => handleDeleteUser(u._id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin_charts">
        <h2>Best Sellers</h2>
        <Bar data={salesData} dataKey="sales" nameKey="name" />
        <h2>Income Trends</h2>
        <Line data={incomeData} dataKey="income" nameKey="date" />
      </div>
    </div>
  );
};

export default AdminPage;
