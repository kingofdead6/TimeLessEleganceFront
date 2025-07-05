import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

const CheckoutPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [deliveryMethod, setDeliveryMethod] = useState("desk");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [deliveryPrices, setDeliveryPrices] = useState({ desk: {}, address: {} });
  const navigate = useNavigate();

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", 
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", 
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", 
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", 
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", 
    "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", 
    "Relizane"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search])
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view checkout", { position: "top-right", autoClose: 3000 });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const [cartResponse, userResponse, pricesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/delivery-prices`)
        ]);
        setCart(cartResponse.data.cart);
        setWilaya(userResponse.data.user.wilaya);
        setDeliveryPrices(pricesResponse.data.prices);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load data", {
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
    fetchData();
  }, [navigate]);

  const calculateSubtotal = () => {
    return cart.items.reduce(
      (sum, item) => sum + (item.product_id?.price || 0) * item.quantity,
      0
    ).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const deliveryPrice = deliveryMethod === "desk" 
      ? deliveryPrices.desk[wilaya] || deliveryPrices.desk.default
      : deliveryPrices.address[wilaya] || deliveryPrices.address.default;
    return (subtotal + deliveryPrice).toFixed(2);
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place order", { position: "top-right", autoClose: 3000 });
      navigate("/login");
      return;
    }
    if (!wilaya || (deliveryMethod === "address" && !address)) {
      toast.error("Please complete all delivery information", { position: "top-right", autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        {
          items: cart.items,
          deliveryMethod,
          wilaya,
          address: deliveryMethod === "address" ? address : undefined,
          subtotal: calculateSubtotal(),
          total: calculateTotal()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully!", { position: "top-right", autoClose: 3000 });
      navigate("/order-confirmation", { state: { orderId: response.data.order._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 mt-20 sm:px-6 lg:px-8 relative">
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
      `}</style>
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
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-6">Checkout</h2>

          {loading ? (
            <p className="text-white/80 text-center text-lg">Loading...</p>
          ) : cart.items.length === 0 ? (
            <p className="text-white/80 text-center text-lg">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                <AnimatePresence>
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center bg-black/30 border border-white/20 rounded-lg p-4 cursor-pointer"
                      onClick={() => setPopupProduct(item.product_id)}
                    >
                      <div
                        className="w-24 h-24 bg-cover bg-center rounded-lg"
                        style={{
                          backgroundImage: `url(${item.product_id?.pictures?.[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                        }}
                      />
                      <div className="flex-1 ml-4">
                        <h3 className="text-xl font-bold text-white">{item.product_id?.name}</h3>
                        <p className="text-white/80">Price: ${item.product_id?.price.toFixed(2)}</p>
                        <p className="text-white/80">Quantity: {item.quantity}</p>
                        <p className="text-white/80">Size: {item.size}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="bg-black/30 p-6 rounded-lg border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Delivery Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 block mb-2">Delivery Method</label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white"
                    >
                      <option value="desk">Desk Delivery</option>
                      <option value="address">Address Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/80 block mb-2">Wilaya</label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white"
                    >
                      <option value="">Select Wilaya</option>
                      {wilayas.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  {deliveryMethod === "address" && (
                    <div>
                      <label className="text-white/80 block mb-2">Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white"
                        placeholder="Enter delivery address"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xl font-bold text-white">Subtotal: ${calculateSubtotal()}</p>
                <p className="text-xl font-bold text-white">
                  Delivery: ${(deliveryPrices[deliveryMethod][wilaya] || deliveryPrices[deliveryMethod].default).toFixed(2)}
                </p>
                <p className="text-2xl font-bold text-white">Total: ${calculateTotal()}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className={`cursor-pointer mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {popupProduct && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-black/80 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">{popupProduct.name}</h3>
              <img
                src={popupProduct.pictures?.[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"}
                alt={popupProduct.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-white/80">Price: ${popupProduct.price?.toFixed(2)}</p>
              <p className="text-white/80">Description: {popupProduct.description}</p>
              <p className="text-white/80">Category: {popupProduct.category}</p>
              <p className="text-white/80">Subcategory: {popupProduct.subcategory}</p>
              <p className="text-white/80">Gender: {popupProduct.gender}</p>
              <p className="text-white/80">Age: {popupProduct.age}</p>
              <p className="text-white/80">Season: {popupProduct.season}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPopupProduct(null)}
                className="cursor-pointer mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;