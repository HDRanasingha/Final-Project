import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FaBoxOpen, FaTruck, FaWarehouse, FaStore, FaChartLine } from 'react-icons/fa';
import '../styles/SupplyChainAnalytics.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SupplyChainAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:3001/api/supply-chain/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching supply chain analytics:', err);
      setError('Failed to load analytics data. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!analyticsData) return <div className="no-data">No analytics data available</div>;

  // Prepare data for charts
  const orderData = {
    labels: analyticsData.monthlyOrders.map(item => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: 'Order Count',
        data: analyticsData.monthlyOrders.map(item => item.count),
        backgroundColor: 'rgba(248, 57, 90, 0.6)',
        borderColor: 'rgba(248, 57, 90, 1)',
        borderWidth: 1
      }
    ]
  };

  const revenueData = {
    labels: analyticsData.monthlyOrders.map(item => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: 'Revenue (Rs)',
        data: analyticsData.monthlyOrders.map(item => item.revenue),
        backgroundColor: 'rgba(36, 53, 90, 0.6)',
        borderColor: 'rgba(36, 53, 90, 1)',
        borderWidth: 1
      }
    ]
  };

  const inventoryData = {
    labels: ['Flowers', 'Products', 'Items'],
    datasets: [
      {
        label: 'Inventory Levels',
        data: [
          analyticsData.inventory.flowers.totalStock,
          analyticsData.inventory.products.totalStock,
          analyticsData.inventory.items.totalStock
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const avgPriceData = {
    labels: ['Flowers', 'Products', 'Items'],
    datasets: [
      {
        label: 'Average Price (Rs)',
        data: [
          analyticsData.inventory.flowers.avgPrice,
          analyticsData.inventory.products.avgPrice,
          analyticsData.inventory.items.avgPrice
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="supply-chain-analytics">
      <div className="analytics-header">
        <h2>Supply Chain Analytics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Monthly
          </button>
          <button 
            className={timeRange === 'quarter' ? 'active' : ''} 
            onClick={() => setTimeRange('quarter')}
          >
            Quarterly
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''} 
            onClick={() => setTimeRange('year')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <FaBoxOpen className="summary-icon" />
          <div className="summary-content">
            <h3>Total Inventory</h3>
            <p>{analyticsData.inventory.flowers.totalStock + 
                analyticsData.inventory.products.totalStock + 
                analyticsData.inventory.items.totalStock} units</p>
          </div>
        </div>
        
        <div className="summary-card">
          <FaTruck className="summary-icon" />
          <div className="summary-content">
            <h3>Total Orders</h3>
            <p>{analyticsData.monthlyOrders.reduce((sum, item) => sum + item.count, 0)}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <FaChartLine className="summary-icon" />
          <div className="summary-content">
            <h3>Total Revenue</h3>
            <p>Rs. {analyticsData.monthlyOrders.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Order Trends</h3>
          <Line 
            data={orderData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Order Count'
                }
              }
            }}
          />
        </div>
        
        <div className="chart-container">
          <h3>Revenue Analysis</h3>
          <Bar 
            data={revenueData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Revenue'
                }
              }
            }}
          />
        </div>
        
        <div className="chart-container">
          <h3>Inventory Distribution</h3>
          <Pie 
            data={inventoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Inventory by Category'
                }
              }
            }}
          />
        </div>
        
        <div className="chart-container">
          <h3>Average Price Comparison</h3>
          <Bar 
            data={avgPriceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Average Price by Category'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplyChainAnalytics;