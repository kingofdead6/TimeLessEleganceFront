import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { useAuth } from "../auth/authContext";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", image: null, showOnMainPage: false });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const visibleOffersCount = offers.filter((offer) => offer.showOnMainPage).length;
  const canShowMore = visibleOffersCount < 4;

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
        logout();
        navigate("/login");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/offers/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(response.data.offers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load offers");
        toast.error(err.response?.data?.message || "Failed to load offers", {
          position: "top-right",
          autoClose: 3000,
        });
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("showOnMainPage", formData.showOnMainPage);
      if (formData.image) data.append("image", formData.image);

      await axios.post(`${API_BASE_URL}/api/offers`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Offer added successfully!", { position: "top-right", autoClose: 3000 });
      setFormData({ title: "", description: "", image: null, showOnMainPage: true });
      setIsPopupOpen(false);
      const response = await axios.get(`${API_BASE_URL}/api/offers/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(response.data.offers);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save offer", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowOnMainPage = async (id, currentStatus) => {
    if (!currentStatus && visibleOffersCount >= 4) {
      toast.error("Cannot show more than 4 offers on the main page", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    try {
      const data = new FormData();
      const offer = offers.find((o) => o._id === id);
      data.append("title", offer.title);
      data.append("description", offer.description);
      data.append("showOnMainPage", !currentStatus);

      await axios.put(`${API_BASE_URL}/api/offers/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setOffers(offers.map((o) => (o._id === id ? { ...o, showOnMainPage: !currentStatus } : o)));
      toast.success(`Offer ${!currentStatus ? "shown" : "hidden"} on main page!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update offer", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(offers.filter((offer) => offer._id !== id));
      toast.success("Offer deleted successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete offer", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 relative -mt-20 min-w-md -ml-15">
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
        .offer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          justify-content: center;
          justify-items: center;
        }
        .offer-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 250px;
          min-height: 350px;
        }
        .offer-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(56, 246, 252, 0.3);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .input-field, .textarea-field {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .input-field:focus, .textarea-field:focus {
          border-color: transparent;
          outline: none;
          ring: 2px solid #38f6fc;
          box-shadow: 0 0 10px rgba(56, 246, 252, 0.5);
        }
        .input-field::placeholder, .textarea-field::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .nav-button {
          background: linear-gradient(45deg, #38f6fc, #007bff);
          border: 1px solid rgba(56, 246, 252, 0.5);
          box-shadow: 0 0 15px rgba(56, 246, 252, 0.4);
          transition: all 0.3s ease;
          border-radius: 9999px;
        }
        .nav-button:hover {
          box-shadow: 0 0 25px rgba(56, 246, 252, 0.7);
          transform: scale(1.05);
        }
        .nav-button:disabled {
          background: linear-gradient(45deg, #4b5e6e, #3b4b5a);
          cursor: not-allowed;
          box-shadow: none;
        }
        .delete-button {
          background: linear-gradient(45deg, #ff3b3b, #b91c1c);
          border: 1px solid rgba(255, 99, 99, 0.5);
          box-shadow: 0 0 15px rgba(255, 99, 99, 0.4);
        }
        .delete-button:hover {
          box-shadow: 0 0 25px rgba(255, 99, 99, 0.7);
          transform: scale(1.05);
        }
        .delete-button:disabled {
          background: linear-gradient(45deg, #4b5e6e, #3b4b5a);
          cursor: not-allowed;
          box-shadow: none;
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
        @media (max-width: 640px) {
          .offer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .offer-card {
            width: 90vw;
            max-width: 350px;
            min-height: 320px;
            margin: 0 auto;
          }
          .form-grid {
            gap: 0.75rem;
          }
          .popup-overlay .form-grid {
            width: 90vw;
            max-width: 350px;
          }
          h2 {
            font-size: 1.75rem;
            text-align: center;
          }
          p {
            font-size: 0.95rem;
            text-align: center;
          }
          .offer-card .text-xl {
            font-size: 1.25rem;
          }
          .offer-card .text-lg {
            font-size: 1rem;
          }
          .offer-card .text-sm {
            font-size: 0.875rem;
          }
        }
      `}</style>
      <div className="wave-bg"></div>
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-7xl mx-auto relative z-10 my-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-[#0f2027]/50 via-[#203a43]/50 to-[#2c5364]/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 tracking-wide mb-4 sm:mb-0 text-center sm:text-left">
              Manage Offers
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPopupOpen(true)}
                className="cursor-pointer px-6 py-3 nav-button text-white rounded-full w-full sm:w-auto max-w-[200px] flex items-center justify-center"
              >
                Create Offer
              </motion.button>
              <p className="text-white/90 text-sm font-medium">
                Visible on Main Page: {visibleOffersCount}/4
              </p>
            </div>
          </div>
          <p className="text-white/90 mb-8 text-lg font-light text-center sm:text-left">
            Create and manage exclusive offers (max 4 visible on main page).
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-md text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Offer Grid */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg font-medium"
            >
              Loading...
            </motion.div>
          ) : offers.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg font-medium"
            >
              No offers found
            </motion.p>
          ) : (
            <div className="offer-grid mb-10">
              <AnimatePresence>
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="offer-card relative rounded-xl border border-white/20 overflow-hidden shadow-2xl  shadow-cyan-400  bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-md hover:shadow-cyan-700 flex flex-col"
                  >
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${offer.image || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
                        <h3 className="text-xl font-extrabold text-white/90">{offer.title}</h3>
                        <p className="text-white/70 text-lg font-medium">{offer.description}</p>
                        <div className="flex gap-2 mt-4">
                          <motion.button
                            whileHover={{ scale: canShowMore || offer.showOnMainPage ? 1.05 : 1 }}
                            whileTap={{ scale: canShowMore || offer.showOnMainPage ? 0.95 : 1 }}
                            onClick={() => toggleShowOnMainPage(offer._id, offer.showOnMainPage)}
                            disabled={!canShowMore && !offer.showOnMainPage}
                            className={`px-4 py-2 rounded-full text-white transition-all duration-300 flex items-center justify-center ${
                              canShowMore || offer.showOnMainPage
                                ? "nav-button cursor-pointer"
                                : "nav-button opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {offer.showOnMainPage ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(offer._id)}
                            className="cursor-pointer px-4 py-2 delete-button text-white rounded-full flex items-center justify-center"
                          >
                            <FaTrash className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Popup Form */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-[#0f2027]/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4 text-center">
                Create Offer
              </h3>
              <form onSubmit={handleSubmit} className="form-grid">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Offer Title"
                  className="px-4 py-3 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Offer Description"
                  className="px-4 py-3 textarea-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  required
                  className="px-4 py-3 input-field rounded-md focus:ring-2 focus:ring-cyan-400 text-white/90"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showOnMainPage}
                    onChange={(e) => setFormData({ ...formData, showOnMainPage: e.target.checked })}
                    disabled={!canShowMore}
                    className={`w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400 ${
                      !canShowMore ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <label
                    className={`text-white/90 text-base font-medium ml-2 ${
                      !canShowMore ? "opacity-50" : ""
                    }`}
                  >
                    Show on Main Page ({visibleOffersCount}/4)
                  </label>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: loading || !formData.title || !formData.description || !formData.image ? 1 : 1.05 }}
                    whileTap={{ scale: loading || !formData.title || !formData.description || !formData.image ? 1 : 0.95 }}
                    type="submit"
                    disabled={loading || !formData.title || !formData.description || !formData.image}
                    className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 flex-1 ${
                      loading || !formData.title || !formData.description || !formData.image
                        ? "nav-button opacity-50 cursor-not-allowed"
                        : "nav-button cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating
                      </>
                    ) : (
                      "Create Offer"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="cursor-pointer px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-900 transition-all duration-300 flex-1"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOffers;