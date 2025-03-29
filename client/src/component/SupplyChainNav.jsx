import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBoxOpen, FaChartLine } from 'react-icons/fa';
import '../styles/SupplyChainNav.scss'; // Import the styles

const SupplyChainNav = () => {
  const user = useSelector((state) => state.user);
  
  // Only show for logged-in users
  if (!user) return null;
  
  return (
    <div className="supply-chain-nav">
      <Link to="/supply-chain" className="supply-chain-link">
        <FaBoxOpen />
        <span>Supply Chain</span>
      </Link>
      
      {/* Only show analytics for admin users */}
      {user.role === 'admin' && (
        <Link to="/supply-chain?view=analytics" className="supply-chain-link">
          <FaChartLine />
          <span>SC Analytics</span>
        </Link>
      )}
    </div>
  );
};

export default SupplyChainNav;