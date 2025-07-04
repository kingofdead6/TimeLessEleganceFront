import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900  px-4 sm:px-6 lg:px-8 relative">
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
      <div className="max-w-5xl mx-auto relative z-10 top-60">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-black/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-center"
        >
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-6">Order Confirmed!</h2>
          <p className="text-white/80 text-lg mb-4">
            Thank you for your order (ID: {state?.orderId || "N/A"}). You will receive a call withing the next 24 hours from our staff to confirm your order.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;