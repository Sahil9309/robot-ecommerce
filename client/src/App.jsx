import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import {UserContextProvider} from "./UserContext.jsx";
import RobotsPage from './pages/RobotsPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ContactPage from './pages/ContactPage';
import ToolsPage from './pages/ToolsPage';
import { Toaster } from 'react-hot-toast';
import UrdfUploader from './pages/UrdfUploader.jsx'
// In your main App.jsx or main.jsx file
import './config/axios.js'; // This sets up axios defaults
// ... rest of your imports and app code


// Use environment variable for base URL, fallback to localhost for development
axios.defaults.baseURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<RobotsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route
                path="/urdf-model"
                element={
                  <>
                    <UrdfUploader />
                  </>
                }
              />
            </Route>
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              success: {
                duration: 3000,
                style: {
                  background: '#E8F5E9',
                  color: '#1B5E20',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#FFEBEE',
                  color: '#B71C1C',
                },
              },
            }}
          />
        </CartProvider>
      </UserContextProvider>
    </>
  );
}

export default App;