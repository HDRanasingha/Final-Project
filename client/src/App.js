import  { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Customers from './pages/Customers';
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
import OrdersPage from './pages/OrdersPage';
import PaymentGatewayPage from './pages/PaymentGatewayPage';
import SucsessPage from './pages/SucsessPage';
import CancelPage from './pages/CancelPage';





function App() {
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={< RegisterPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customers" element={<Customers/>} />
        <Route path="/growers" element={<GrowersDashboard/>} />
        <Route path="/flower/:id" element={<FlowerDetailsPage/>} />
        <Route path="/sellers" element={<SellerPage/>}/>
        <Route path="/product/:id" element={<ProductDetailPage/>} />
        <Route path="/item/:id" element={<ItemDetailsPage/>} />
        <Route path="/suppliers" element={<SupplierPage/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
        <Route path="/suppliers/orders" element={<OrdersPage />} />
        <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
        <Route path="/payment-success" element={<SucsessPage/>}/>
        <Route path="/payment-cancel" element={<CancelPage/>}/>
        
        
        
        
        
        
       
      </Routes>
      
      </BrowserRouter>

    </div>
  );
}

export default App;
