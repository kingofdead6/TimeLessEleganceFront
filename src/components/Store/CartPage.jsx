import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  };

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your cart", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cart);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load cart", {
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

    fetchCart();
  }, [navigate]);

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to update your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/cart/update`,
        { itemId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
      toast.success("Cart updated!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to update your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId },
      });
      setCart(response.data.cart);
      toast.success("Item removed from cart!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) => sum + (item.product_id?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative mt-15">
      <ToastContainer />
      <style>
        {`
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
          .cart-grid {
            display: grid;
            gap: 1.5rem;
          }
          .cart-item {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .cart-item:hover {
            transform: scale(0.98);
            box-shadow: 0 10px 20px rgba(0, 255, 255, 0.3);
          }
        `}
      </style>
      <div className="textured-bg" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-black/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-extrabold text-white tracking-wide">Your Cart</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
            >
              Back to Products
            </motion.button>
          </div>

          {loading ? (
            <p className="text-white/80 text-center text-lg">Loading cart...</p>
          ) : cart.items.length === 0 ? (
            <p className="text-white/80 text-center text-lg">Your cart is empty.</p>
          ) : (
            <div className="cart-grid">
              <AnimatePresence>
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ delay: index * 0.05 }}
                    className="cart-item flex items-center bg-black/30 border border-white/20 rounded-lg p-4"
                  >
                    <div
                      className="w-24 h-24 bg-cover bg-center rounded-lg"
                      style={{
                        backgroundImage: `url(${item.product_id?.pictures?.[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                      }}
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-xl font-bold text-white">{item.product_id?.name || "Product"}</h3>
                      <p className="text-white/80">Size: {item.size}</p>
                      <p className="text-white/80">Price: ${item.product_id?.price?.toFixed(2) || "0.00"}</p>
                      <div className="flex items-center mt-2">
                        <label className="text-white/80 mr-2">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          max={item.product_id?.stock?.find((s) => s.size === item.size)?.quantity || 1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-16 px-2 py-1 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80">Subtotal: ${(item.product_id?.price * item.quantity || 0).toFixed(2)}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeItem(item._id)}
                        className="cursor-pointer mt-2 text-red-400 hover:text-red-500"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {cart.items.length > 0 && (
            <div className="mt-8 flex justify-between items-center">
              <p className="text-2xl font-bold text-white">Total: ${total.toFixed(2)}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/checkout")}
                className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;