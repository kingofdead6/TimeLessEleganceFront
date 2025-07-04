import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
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
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your orders", { position: "top-right", autoClose: 3000 });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load orders", {
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
    fetchOrders();
  }, [navigate]);
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search])
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 py-20 mt-10 px-4 sm:px-6 lg:px-8 relative">
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
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-6">My Orders</h2>
          {loading ? (
            <p className="text-white/80 text-center text-lg">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-white/80 text-center text-lg">No orders found.</p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-black/30 border border-white/20 rounded-lg p-4"
                  >
                    <h3 className="text-xl font-bold text-white">Order #{order._id}</h3>
                    <p className="text-white/80">Status: {order.status}</p>
                    <p className="text-white/80">Subtotal: ${order.subtotal}</p>
                    <p className="text-white/80">Delivery: ${(order.total - order.subtotal).toFixed(2)}</p>
                    <p className="text-white/80">Total: ${order.total}</p>
                    <p className="text-white/80">Delivery: {order.deliveryMethod}</p>
                    <p className="text-white/80">Wilaya: {order.wilaya}</p>
                    {order.address && <p className="text-white/80">Address: {order.address}</p>}
                    <div className="mt-2">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-2">
                          <img
                            src={item.product_id?.pictures?.[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"}
                            alt={item.product_id?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="text-white/80">{item.product_id?.name}</p>
                            <p className="text-white/80">Qty: {item.quantity}, Size: {item.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default UserOrdersPage;