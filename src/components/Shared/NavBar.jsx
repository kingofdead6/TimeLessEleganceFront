import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaShoppingCart, FaBell } from 'react-icons/fa';
import { useAuth } from '../auth/authContext';
import axios from 'axios';
import { API_BASE_URL } from '../../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Handle scroll to show/hide navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
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
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsNotificationsOpen(false);
  };

  // Toggle notifications popup
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsOpen(false);
  };

  // Mark notification as read
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

  // Animation variants for navbar
  const navbarVariants = {
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
    hidden: { 
      y: '-100%', 
      opacity: 0, 
      transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: { 
      y: '-100%', 
      opacity: 0, 
      transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
    open: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
  };

  // Animation variants for notifications popup
  const notificationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  // Animation variants for nav items
  const itemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-indigo-950/30 via-cyan-900/30 to-purple-950/30 backdrop-blur-2xl border-b border-cyan-400/20 shadow-lg"
        >
          <ToastContainer />
          <style>{`
            .nav-link {
              position: relative;
              transition: color 0.3s ease;
              font-size: 1.25rem;
              font-weight: 500;
              padding: 0.5rem 1rem;
            }
            .nav-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 3px;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              background: linear-gradient(to right, #38f6fc, #007bff);
              transition: width 0.3s ease;
            }
            .nav-link:hover::after {
              width: 80%;
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
            @media (max-width: 768px) {
              .nav-link {
                font-size: 1.5rem;
                padding: 0.75rem 0;
              }
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
          <div className="container mx-auto px-6 sm:px-8 py-5 flex justify-between items-center relative">
            <div className="wave-bg"></div>
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 relative z-10">
              Timeless Elegance
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center relative z-10">
              <Link to="/products" className="nav-link text-white/90 hover:text-cyan-300">
                Store
              </Link>
              <Link to="/contact-us" className="nav-link text-white/90 hover:text-cyan-300">
                Contact Us
              </Link>
              <Link to="/about-us" className="nav-link text-white/90 hover:text-cyan-300">
                About Us
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to="/orders" className="nav-link text-white/90 hover:text-cyan-300">
                    Orders
                  </Link>
                  <Link to="/profile" className="nav-link text-white/90 hover:text-cyan-300">
                    Profile
                  </Link>
                  <Link to="/cart" className="nav-link text-white/90 hover:text-cyan-300">
                    <FaShoppingCart className="inline mr-1" size={20} /> Cart
                  </Link>
                  <motion.button
                    onClick={toggleNotifications}
                    className="nav-link text-white/90 hover:text-cyan-300 relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaBell className="inline mr-1" size={20} />
                    Notifications
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="nav-button flex items-center text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt className="mr-2" size={20} /> Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link text-white/90 hover:text-cyan-300">
                    Login
                  </Link>
                  <Link to="/register" className="nav-link text-white/90 hover:text-cyan-300">
                    Register
                  </Link>
                </>
              )}
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
              <button className="ml-2 text-cyan-300 focus:outline-none" onClick={toggleMenu}>
                {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="mobile-menu bg-gradient-to-br from-indigo-950/80 via-cyan-900/80 to-purple-950/80 backdrop-blur-2xl border-b border-cyan-400/20"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="flex flex-col items-center py-8 space-y-6">
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/products"
                      className="nav-link text-white/90 hover:text-cyan-300"
                      onClick={toggleMenu}
                    >
                      Store
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/contact-us"
                      className="nav-link text-white/90 hover:text-cyan-300"
                      onClick={toggleMenu}
                    >
                      Contact Us
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/about-us"
                      className="nav-link text-white/90 hover:text-cyan-300"
                      onClick={toggleMenu}
                    >
                      About Us
                    </Link>
                  </motion.div>
                  {isLoggedIn ? (
                    <>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/orders"
                          className="nav-link text-white/90 hover:text-cyan-300"
                          onClick={toggleMenu}
                        >
                          Orders
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/profile"
                          className="nav-link text-white/90 hover:text-cyan-300"
                          onClick={toggleMenu}
                        >
                           Profile
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/cart"
                          className="nav-link text-white/90 hover:text-cyan-300"
                          onClick={toggleMenu}
                        >
                          <FaShoppingCart className="inline mr-1" size={24} /> Cart
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <button
                          onClick={toggleNotifications}
                          className="nav-link text-white/90 hover:text-cyan-300"
                        >
                          <FaBell className="inline mr-1" size={24} /> Notifications
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {notifications.filter(n => !n.read).length}
                            </span>
                          )}
                        </button>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <motion.button
                          onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}
                          className="nav-button flex items-center text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaSignOutAlt className="mr-2" size={24} /> Logout
                        </motion.button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/login"
                          className="nav-link text-white/90 hover:text-cyan-300"
                          onClick={toggleMenu}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          to="/register"
                          className="nav-link text-white/90 hover:text-cyan-300"
                          onClick={toggleMenu}
                        >
                          Register
                        </Link>
                      </motion.div>
                    </>
                  )}
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
      )}
    </AnimatePresence>
  );
};

export default Navbar;