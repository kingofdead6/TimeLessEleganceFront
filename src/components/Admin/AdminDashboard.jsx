import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { FaBell, FaUsers, FaBox, FaShoppingCart, FaStar, FaSignOutAlt, FaOctopusDeploy, FaNewspaper, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import AdminOffers from "./AdminOffers";
import { useAuth } from "../auth/authContext";
import AdminMain from "./AdminMain";
import AdminNewsletters from "./AdminNewsletters";
import AdminContacts from "./AdminContacts";
import AdminOrdersPage from "./AdminOrdersPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("menu");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      try {
        let fetchedUser = location.state?.user;
        if (!fetchedUser) {
          const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.user.user_type === "admin") {
            fetchedUser = response.data.user;
          } else {
            throw new Error("Invalid user type");
          }
        }
        if (location.state?.activeSection) {
          setActiveSection(location.state.activeSection);
        }
      } catch (error) {
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchUser();
    if (user?.user_type === "admin") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [navigate, location, logout, user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsMenuOpen(false);
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.map((n) => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark notification as read", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const navItems = [
    { label: "Dashboard", key: "menu", icon: <FaBell className="h-6 w-6" /> },
    { label: "Users", key: "users", icon: <FaUsers className="h-6 w-6" /> },
    { label: "Products", key: "products", icon: <FaBox className="h-6 w-6" /> },
    { label: "Orders", key: "orders", icon: <FaShoppingCart className="h-6 w-6" /> },
    { label: "Offers", key: "offers", icon: <FaOctopusDeploy className="h-6 w-6" /> },
    { label: "Newsletter", key: "newsletter", icon: <FaNewspaper className="h-6 w-6" /> },
    { label: "Contact", key: "contact", icon: <FaPhone className="h-6 w-6" /> },
  ];

  const notificationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-cyan-900 to-purple-950">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/90 text-xl font-medium"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-cyan-900 to-purple-950">
      <ToastContainer />
      <style>{`
        .wave-bg {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(34, 211, 238, 0.2)' stroke-width='2' d='M0,160 C320,100 640,100 960,160 C1280,220 1440,220 1440,220'/%3E%3Ccircle cx='360' cy='120' r='4' fill='rgba(34, 211, 238, 0.5)'/%3E%3Ccircle cx='720' cy='180' r='4' fill='rgba(139, 92, 246, 0.5)'/%3E%3Ccircle cx='1080' cy='140' r='4' fill='rgba(236, 72, 153, 0.5)'/%3E%3C/svg%3E");
          opacity: 0.3;
          background-size: 200%;
          animation: moveWave 8s linear infinite;
          pointer-events: none;
        }
        @keyframes moveWave {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        .nav-button {
          background: linear-gradient(45deg, #38f6fc, #007bff);
          border: 1px solid rgba(56, 246, 252, 0.5);
          box-shadow: 0 0 15px rgba(56, 246, 252, 0.4);
          transition: all 0.3s ease;
          font-size: 1rem;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
        }
        .nav-button:hover {
          box-shadow: 0 0 25px rgba(56, 246, 252, 0.7);
          transform: scale(1.05);
        }
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 40;
        }
        .notification-popup {
          position: fixed;
          top: 80px;
          right: 0;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 50;
        }
        .glow-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          filter: blur(3px);
          animation: blink 4s ease-in-out infinite;
        }
        .glow-dot:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
        .glow-dot:nth-child(2) { top: 70%; left: 80%; animation-delay: 1s; }
        .glow-dot:nth-child(3) { top: 50%; left: 40%; animation-delay: 2s; }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @media (max-width: 768px) {
          .nav-button {
            font-size: 1.25rem;
            padding: 0.75rem 2rem;
          }
          .notification-popup {
            width: 100%;
            right: 0;
          }
        }
      `}</style>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-indigo-950/30 via-cyan-900/30 to-purple-950/30 backdrop-blur-2xl border-b border-cyan-400/20 shadow-lg"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="wave-bg"></div>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 relative z-10">
                Timeless Elegance
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2 relative z-10">
              {navItems.map(({ label, key, icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveSection(key);
                    setIsMenuOpen(false);
                    setIsNotificationsOpen(false);
                  }}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium text-white/90 transition-all duration-300 ${
                    activeSection === key
                      ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg"
                      : "hover:bg-cyan-900/50 hover:text-cyan-300"
                  }`}
                >
                  {icon}
                  {label}
                </motion.button>
              ))}
              <motion.button
                onClick={toggleNotifications}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-cyan-900/50 hover:text-cyan-300 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell className="h-6 w-6" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="cursor-pointer nav-button flex items-center text-white"
              >
                <FaSignOutAlt className="mr-2" size={20} />
                Logout
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center relative z-10">
              <motion.button
                onClick={toggleNotifications}
                className="p-2 text-cyan-300 hover:bg-cyan-900/50 rounded-full relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaBell size={28} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="ml-2 p-2 text-cyan-300 hover:bg-cyan-900/50 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="mobile-menu bg-gradient-to-br from-indigo-950/80 via-cyan-900/80 to-purple-950/80 backdrop-blur-2xl border-b border-cyan-400/20"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map(({ label, key, icon }, index) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => {
                      setActiveSection(key);
                      setIsMenuOpen(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/90 transition-all duration-300 ${
                      activeSection === key
                        ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg"
                        : "hover:bg-cyan-900/50 hover:text-cyan-300"
                    }`}
                  >
                    {icon}
                    {label}
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  onClick={toggleNotifications}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/90 hover:bg-cyan-900/50 hover:text-cyan-300`}
                >
                  <FaBell className="h-6 w-6" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                  onClick={handleLogout}
                  className="cursor-pointer w-full nav-button flex items-center text-white"
                >
                  <FaSignOutAlt className="mr-2" size={24} />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Popup */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div
              variants={notificationVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="notification-popup bg-black/80 rounded-lg shadow-lg p-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-white/80">No notifications found.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 rounded-lg ${notification.read ? 'bg-black/30 opacity-70' : 'bg-black/50'}`}
                    >
                      <p className="text-white/80">{notification.message}</p>
                      <p className="text-white/80 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                      {!notification.read && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markAsRead(notification._id)}
                          className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Mark as Read
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen relative">
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="max-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.6, 0.01, 0.05, 0.95] }}
            className="p-6 sm:p-8"
          >
            {activeSection === "menu" && <AdminMain />}
            {activeSection === "users" && <AdminUsers />}
            {activeSection === "products" && <AdminProducts />}
            {activeSection === "orders" && <AdminOrdersPage />}
            {activeSection === "offers" && <AdminOffers />}
            {activeSection === "newsletter" && <AdminNewsletters />}
            {activeSection === "contact" && <AdminContacts />}
          </motion.div>
        </div>
      </div>
    </div>
  );

  function handleLogout() {
    logout();
    navigate("/");
  }
}