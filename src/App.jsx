import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/page";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/NavBar";
import WhatYouWantToShopForPage from "./components/Store/WhatYouWantToShopForPage";
import SubcategoriesPage from "./components/Store/SubcategoriesPage";
import ProductsPage from "./components/Store/ProductsPage";
import ProductDetail from "./components/Store/ProductDetail";
import CartPage from "./components/Store/CartPage";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import { AuthProvider } from "./components/auth/authContext";
import NotFound from "./pages/NotFound/page";
import CheckoutPage from "./components/Store/CheckoutPage";
import OrderConfirmationPage from "./components/Store/OrderConfirmationPage";
import UserOrdersPage from "./components/Store/UserOrdersPage";
import NotificationsPage from "./components/Shared/NotificationsPage";
import Chatbot from "./components/Shared/ChatBot";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";
import ResetPassword from "./components/auth/ResetPassword";
import Profile from "./components/Store/Profile";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/store" element={<WhatYouWantToShopForPage />} />
        <Route path="/subcategories" element={<SubcategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/orders" element={<UserOrdersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;