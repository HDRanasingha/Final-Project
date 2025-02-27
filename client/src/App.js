import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import GrowersDashboard from './pages/Growers';
import FlowerDetailsPage from './pages/FlowerDetailsPage';
import SellerPage from './pages/SellersPage';
import ProductDetailPage from './pages/Productdetailspage';
import SupplierPage from './pages/SupplierPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';

import PaymentGatewayPage from './pages/PaymentGatewayPage';
import SucsessPage from './pages/SucsessPage';
import CancelPage from './pages/CancelPage';
import GrowersOrderPage from './pages/GrowersOrderPage';
import AdminPage from './pages/AdminPage';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import ThankYouPage from './pages/ThankYouPage';
import Tracking from './pages/Tracking';

function App() {
  const user = useSelector((state) => state.user);

  // Function to determine user dashboard based on role
  const getUserDashboard = () => {
    if (!user) return <Navigate to="/" />; // Redirect to home if no user
    switch (user.role) {
      case "grower":
        return <GrowersDashboard />;
      case "seller":
        return <SellerPage />;
      case "supplier":
        return <SupplierPage />;
      case "admin":
        return <AdminPage />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <HomePage /> : getUserDashboard()} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Role-Based Routes (Accessible Only If Logged In) */}
        {user && (
          <>
            <Route path="/growers" element={<GrowersDashboard />} />
            <Route path="/sellers" element={<SellerPage />} />
            <Route path="/suppliers" element={<SupplierPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </>
        )}

        {/* Common Routes */}
        <Route path="/flower/:id" element={<FlowerDetailsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/item/:id" element={<ItemDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
       
        <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
        <Route path="/payment-success" element={<SucsessPage />} />
        <Route path="/payment-cancel" element={<CancelPage />} />
        <Route path="/recived/orders" element={<GrowersOrderPage />} />
        
        <Route path="/about-us" element={<AboutUs/>} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/order-tracking/:orderId" element={<TrackOrderPage/>} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/tracking" element={<Tracking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

