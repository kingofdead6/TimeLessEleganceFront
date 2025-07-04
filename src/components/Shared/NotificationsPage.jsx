import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view notifications", { position: "top-right", autoClose: 3000 });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load notifications", {
          position: "top-right",
          autoClose: 3000,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer />
      <style>{`
        .textured-bg {
          background-image: url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png');
          background-blend-mode: overlay;
          background-size: cover;
          background-position: center;
          opacity: 0.2;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
      `}</style>
      <div className="textured-bg" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-black/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
        >
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-6">Notifications</h2>
          {loading ? (
            <p className="text-white/80 text-center text-lg">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-white/80 text-center text-lg">No notifications found.</p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={`bg-black/30 border border-white/20 rounded-lg p-4 ${notification.read ? 'opacity-70' : ''}`}
                  >
                    <p className="text-white/80">{notification.message}</p>
                    <p className="text-white/80 text-sm">Type: {notification.type}</p>
                    <p className="text-white/80 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsRead(notification._id)}
                        className="cursor-pointer mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Mark as Read
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;