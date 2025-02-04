import  { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Customers from './pages/Customers';
import GrowersDashboard from './pages/Growers';
import FlowerDetailsPage from './pages/FlowerDetailsPage';




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

        
        
        
        
       
      </Routes>
      
      </BrowserRouter>

    </div>
  );
}

export default App;
