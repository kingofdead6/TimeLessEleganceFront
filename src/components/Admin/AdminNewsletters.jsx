import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaTrash, FaSearch, FaPaperPlane, FaCheckSquare, FaSquare } from "react-icons/fa";
import { useAuth } from "../auth/authContext";
import { API_BASE_URL } from "../../../api";

const AdminNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchNewsletters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
        logout();
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/newsletters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNewsletters(response.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load subscriptions", {
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
    fetchNewsletters();
  }, [navigate, logout]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNewsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNewsletters.map((newsletter) => newsletter._id));
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/newsletters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsletters(newsletters.filter((newsletter) => newsletter._id !== id));
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      toast.success("Subscription deleted successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete subscription", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) {
      toast.error("No subscriptions selected", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} subscription(s)?`)) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/newsletters`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedIds },
      });
      setNewsletters(newsletters.filter((newsletter) => !selectedIds.includes(newsletter._id)));
      setSelectedIds([]);
      toast.success("Selected subscriptions deleted!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete subscriptions", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      toast.error("Select at least one subscription", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.subject) {
      toast.error("Subject is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.message) {
      toast.error("Message is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
      logout();
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const emails = newsletters
        .filter((newsletter) => selectedIds.includes(newsletter._id))
        .map((newsletter) => newsletter.email);
      await axios.post(
        `${API_BASE_URL}/api/newsletters/send-email`,
        { emails, subject: form.subject, message: form.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Emails sent successfully!", { position: "top-right", autoClose: 3000 });
      setForm({ subject: "", message: "" });
      setShowModal(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send emails", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNewsletters = newsletters.filter((newsletter) =>
    newsletter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen -mt-20 px-4 sm:px-6 lg:px-8 relative ">
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
        .glass-card {
          background: linear-gradient(135deg, rgba(15, 32, 39, 0.8), rgba(32, 58, 67, 0.8), rgba(44, 83, 100, 0.8));
          backdrop-filter: blur(14px);
          border: 1px solid rgba(34, 211, 238, 0.5);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: scale(1.03);
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.7), 0 0 50px rgba(139, 92, 246, 0.3);
          border-color: rgba(34, 211, 238, 0.9);
        }
        .neon-button {
          background: linear-gradient(45deg, #38f6fc, #007bff);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.5), 0 0 30px rgba(34, 211, 238, 0.3);
          transition: all 0.3s ease;
        }
        .neon-button:hover {
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.8), 0 0 50px rgba(34, 211, 238, 0.5);
          transform: scale(1.05);
        }
        .neon-button:disabled {
          background: linear-gradient(45deg, #4b5e6e, #3b4b5a);
          box-shadow: none;
          cursor: not-allowed;
        }
        .delete-button {
          background: linear-gradient(45deg, #ff3b3b, #b91c1c);
          box-shadow: 0 0 15px rgba(255, 99, 99, 0.5), 0 0 30px rgba(255, 99, 99, 0.3);
        }
        .delete-button:hover {
          box-shadow: 0 0 25px rgba(255, 99, 99, 0.8), 0 0 50px rgba(255, 99, 99, 0.5);
          transform: scale(1.05);
        }
        .input-field, .textarea-field {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.4);
          color: white;
          transition: all 0.3s ease;
        }
        .input-field:focus, .textarea-field:focus {
          outline: none;
          border-color: rgba(34, 211, 238, 0.9);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
        }
        .input-field::placeholder, .textarea-field::placeholder {
          color: rgba(255, 255, 255, 0.5);
          opacity: 0;
          animation: placeholderFade 4s infinite;
        }
        @keyframes placeholderFade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .modal-overlay {
          background: rgba(15, 32, 39, 0.9);
          backdrop-filter: blur(10px);
        }
        .glow-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          filter: blur(4px);
          animation: pulse 3s ease-in-out infinite, float 10s ease-in-out infinite;
        }
        .glow-dot:nth-child(1) { top: 15%; left: 25%; animation-delay: 0s; }
        .glow-dot:nth-child(2) { top: 65%; left: 75%; animation-delay: 1s; }
        .glow-dot:nth-child(3) { top: 45%; left: 35%; animation-delay: 2s; }
        .glow-dot:nth-child(4) { top: 25%; left: 85%; animation-delay: 0.5s; }
        .glow-dot:nth-child(5) { top: 75%; left: 15%; animation-delay: 1.5s; }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .glass-card {
            padding: 0.75rem;
          }
          h2 {
            font-size: 1.75rem;
            text-align: center;
          }
          p {
            font-size: 0.95rem;
            text-align: center;
          }
          .modal-overlay .glass-card {
            width: 90vw;
            max-width: 350px;
          }
        }
      `}</style>
      <div className="wave-bg"></div>
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-7xl min-w-sm -ml-10 md:ml-0 mx-auto relative z-10 my-20">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-[#0f2027]/50 via-[#203a43]/50 to-[#2c5364]/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 tracking-wide mb-4 text-center sm:text-left">
            Newsletter Control Hub
          </h2>
          <p className="text-white/90 mb-8 text-lg font-light text-center sm:text-left">
            Orchestrate your audience engagement with precision. Curate subscriptions and craft stellar communications.
          </p>

          {/* Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/80" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-3 rounded-full text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <motion.button
                whileHover={{ scale: selectedIds.length === 0 ? 1 : 1.05 }}
                whileTap={{ scale: selectedIds.length === 0 ? 1 : 0.95 }}
                onClick={handleDeleteMultiple}
                disabled={selectedIds.length === 0}
                className={`cursor-pointer neon-button px-6 py-3 rounded-full text-white font-medium flex items-center gap-2 text-sm sm:text-base ${
                  selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaTrash />
                Delete Selected
              </motion.button>
              <motion.button
                whileHover={{ scale: selectedIds.length === 0 ? 1 : 1.05 }}
                whileTap={{ scale: selectedIds.length === 0 ? 1 : 0.95 }}
                onClick={() => setShowModal(true)}
                disabled={selectedIds.length === 0}
                className={`cursor-pointer neon-button px-6 py-3 rounded-full text-white font-medium flex items-center gap-2 text-sm sm:text-base ${
                  selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaPaperPlane />
                Send Email
              </motion.button>
            </div>
          </div>

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-white/90 text-lg font-medium flex items-center justify-center gap-2"
              >
                <svg
                  className="animate-spin h-5 w-5 text-cyan-400"
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
                Loading subscriptions...
              </motion.div>
            ) : filteredNewsletters.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-white/90 text-lg font-medium"
              >
                No subscriptions found
              </motion.p>
            ) : (
              <>
                <div className="flex items-center mb-2 col-span-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSelectAll}
                    className="cursor-pointer neon-button p-2 rounded-full"
                    title={selectedIds.length === filteredNewsletters.length ? "Deselect All" : "Select All"}
                  >
                    {selectedIds.length === filteredNewsletters.length ? (
                      <FaCheckSquare size={20} />
                    ) : (
                      <FaSquare size={20} />
                    )}
                  </motion.button>
                  <span className="text-white/70 ml-3 text-sm sm:text-base">
                    {selectedIds.length} of {filteredNewsletters.length} selected
                  </span>
                </div>
                <AnimatePresence>
                  {filteredNewsletters.map((newsletter, index) => (
                    <motion.div
                      key={newsletter._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-4 sm:p-5 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-grow">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(newsletter._id)}
                          onChange={() => handleSelect(newsletter._id)}
                          className="w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400"
                        />
                        <FaEnvelope className="text-cyan-400" />
                        <span className="text-sm sm:text-base text-white/90 truncate">
                          {newsletter.email}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(newsletter._id)}
                        className="cursor-pointer delete-button px-3 py-2 rounded-full text-white"
                      >
                        <FaTrash className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Email Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="glass-card p-6 sm:p-8 rounded-2xl w-full max-w-lg"
            >
              <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4 text-center">
                Craft Cosmic Message
              </h3>
              <p className="text-white/70 mb-6 text-sm sm:text-base text-center">
                Send a tailored message to your selected subscribers.
              </p>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-white/90 mb-1 text-sm sm:text-base">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    placeholder="Enter email subject"
                    className="input-field w-full px-4 py-3 rounded-lg text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-1 text-sm sm:text-base">
                    Message (HTML supported)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows="6"
                    placeholder="Compose your message..."
                    className="textarea-field w-full px-4 py-3 rounded-lg text-sm sm:text-base"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    type="submit"
                    disabled={loading}
                    className={`cursor-pointer neon-button w-full px-4 py-3 text-white font-medium rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        Sending
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Email
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setForm({ subject: "", message: "" });
                    }}
                    className="cursor-pointer delete-button w-full px-4 py-3 text-white font-medium rounded-lg text-sm sm:text-base"
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

export default AdminNewsletters;