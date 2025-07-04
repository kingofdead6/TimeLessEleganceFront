import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../../api";
import { useAuth } from "../auth/authContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 10, user_type: "", wilaya: "", search: "" });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/wilayas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWilayas(["", ...response.data.wilayas]); // Include empty option for "All Wilayas"
      } catch (err) {
        console.error("Failed to fetch wilayas:", err);
        setError("Failed to load wilaya options");
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: filters,
        });
        setUsers(response.data.users);
        setTotalPages(response.data.pages);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.message === "Admin access required") {
          logout();
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to fetch users");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWilayas();
    fetchUsers();
  }, [filters, navigate, logout]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 relative">
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
        .table-container {
          overflow-x: auto;
        }
        .input-field, .select-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }
        .input-field:focus, .select-field:focus {
          border-color: transparent;
          outline: none;
          ring: 2px solid #38f6fc;
          box-shadow: 0 0 10px rgba(56, 246, 252, 0.5);
        }
        .input-field::placeholder {
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
      <div className="wave-bg"></div>
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="bg-gradient-to-br from-[#0f2027]/50 via-[#203a43]/50 to-[#2c5364]/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 min-w-sm -ml-10 md:ml-0" 
        >
          <div className="flex items-center gap-3 mb-6">
            <FaUsers className="h-8 w-8 text-cyan-300" />
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
              Manage Users
            </h2>
          </div>
          <p className="text-white/90 mb-8 text-lg">View, filter, and manage user accounts.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-md text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              name="search"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={handleFilterChange}
              className="flex-1 px-4 py-3 input-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-white/50"
            />
            <select
              name="user_type"
              value={filters.user_type}
              onChange={handleFilterChange}
              className="w-full sm:w-48 px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="wilaya"
              value={filters.wilaya}
              onChange={handleFilterChange}
              className="w-full sm:w-48 px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              {wilayas.map((wilaya) => (
                <option key={wilaya || "none"} value={wilaya}>
                  {wilaya || "All Wilayas"}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg"
            >
              Loading...
            </motion.div>
          ) : users.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg"
            >
              No users found
            </motion.p>
          ) : (
            <div className="table-container">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/90 rounded-tl-md">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                      User Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                      Wilaya
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/90 rounded-tr-md">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05, ease: [0.6, 0.01, 0.05, 0.95] }}
                        whileHover={{ backgroundColor: "rgba(56, 246, 252, 0.1)" }}
                        onClick={() => handleUserClick(user)}
                        className="cursor-pointer border-b border-white/20 last:border-b-0"
                      >
                        <td className="px-4 py-3 text-white/90">{user.name}</td>
                        <td className="px-4 py-3 text-white/70">{user.email}</td>
                        <td className="px-4 py-3 text-white/70">
                          {user.user_type === "customer" ? "Customer" : "Admin"}
                        </td>
                        <td className="px-4 py-3 text-white/70">{user.wilaya || "N/A"}</td>
                        <td className="px-4 py-3 text-white/70">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: filters.page > 1 ? 1.05 : 1 }}
              whileTap={{ scale: filters.page > 1 ? 0.95 : 1 }}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page <= 1}
              className="px-4 py-2 nav-button text-white"
            >
              Previous
            </motion.button>
            <span className="text-white/90 text-lg">
              Page {filters.page} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: filters.page < totalPages ? 1.05 : 1 }}
              whileTap={{ scale: filters.page < totalPages ? 0.95 : 1 }}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page >= totalPages}
              className="px-4 py-2 nav-button text-white"
            >
              Next
            </motion.button>
          </div>
        </motion.div>

        {/* User Details Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0f2027]/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] }}
                className="bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                    User Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-white/70 hover:text-red-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
                    aria-label="Close modal"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4 text-white/90">
                  {selectedUser.profile_image && (
                    <img
                      src={selectedUser.profile_image}
                      alt={selectedUser.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-cyan-400/50"
                    />
                  )}
                  <div>
                    <span className="font-semibold text-white/90">Name:</span> {selectedUser.name}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Email:</span> {selectedUser.email}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">User Type:</span>{" "}
                    {selectedUser.user_type === "customer" ? "Customer" : "Admin"}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Phone:</span>{" "}
                    {selectedUser.phone_number || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Wilaya:</span>{" "}
                    {selectedUser.wilaya || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Joined:</span>{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="cursor-pointer mt-6 w-full px-4 py-2 nav-button text-white"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminUsers;