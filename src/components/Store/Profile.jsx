import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { useAuth } from "../auth/authContext";

// List of Algerian wilayas, matching backend naming (e.g., "Algiers" instead of "Alger")
const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
  "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair",
  "El Meniaa"
];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
    wilaya: user?.wilaya || "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone_number: user.phone_number || "",
        wilaya: user.wilaya === "Alger" ? "Algiers" : user.wilaya || "", // Map "Alger" to "Algiers" for existing data
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Log formData for debugging
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Update Response:", response.data); // Log success response
      if (response.status === 200 && response.data.user) {
        setSuccess("Profile updated successfully.");
        setIsEditing(false);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Update Error:", err.response || err.message); // Log full error response
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/auth/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      console.log("Delete Response:", response.data); // Log success response
      setSuccess("Account deleted successfully.");
      logout();
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Delete Error:", err.response || err.message); // Log full error response
      setError(err.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((value) => value.trim() !== "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <motion.button
          variants={textVariants}
          initial="hidden"
          animate="visible"
          onClick={() => navigate("/store")}
          className="cursor-pointer flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Go back"
        >
          <IoArrowBack size={20} />
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-cyan-700 hover:scale-110 overflow-hidden relative duration-300 transform"
      >
        <style>{`
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

        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />

        <motion.h2
          variants={textVariants}
          className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-6 tracking-wide"
        >
          Profile
        </motion.h2>

        {error && (
          <motion.div
            variants={textVariants}
            className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm font-medium mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            variants={textVariants}
            className="bg-green-500/10 text-green-400 p-3 rounded-md text-sm font-medium mb-6 text-center"
          >
            {success}
          </motion.div>
        )}

        <div className="space-y-5">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <motion.label
                  variants={textVariants}
                  htmlFor="name"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Name
                </motion.label>
                <motion.input
                  variants={textVariants}
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <motion.label
                  variants={textVariants}
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Phone Number
                </motion.label>
                <motion.input
                  variants={textVariants}
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <motion.label
                  variants={textVariants}
                  htmlFor="wilaya"
                  className="block text-sm font-medium text-white/90 mb-1"
                >
                  Wilaya
                </motion.label>
                <motion.select
                  variants={textVariants}
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white"
                  required
                  aria-required="true"
                >
                  <option value="" disabled className="bg-[#0f2027] text-white">
                    Select a Wilaya
                  </option>
                  {wilayas.map((wilaya) => (
                    <option
                      key={wilaya}
                      value={wilaya}
                      className="bg-[#0f2027] text-white"
                    >
                      {wilaya}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  variants={textVariants}
                  onClick={handleEditSubmit}
                  className={`cursor-pointer flex-1 bg-gradient-to-r from-cyan-400 to-pink-400 text-white py-3 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027] ${
                    isFormComplete && !isLoading ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isFormComplete || isLoading}
                  aria-disabled={!isFormComplete || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
                <motion.button
                  variants={textVariants}
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer flex-1 bg-gray-500 text-white py-3 rounded-md font-medium transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0f2027]"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div>
              <motion.p variants={textVariants} className="text-white/90 mb-2">
                <strong>Name:</strong> {user?.name || "N/A"}
              </motion.p>
              <motion.p variants={textVariants} className="text-white/90 mb-2">
                <strong>Email:</strong> {user?.email || "N/A"}
              </motion.p>
              <motion.p variants={textVariants} className="text-white/90 mb-2">
                <strong>Phone Number:</strong> {user?.phone_number || "N/A"}
              </motion.p>
              <motion.p variants={textVariants} className="text-white/90 mb-2">
                <strong>Wilaya:</strong> {user?.wilaya || "N/A"}
              </motion.p>
              <motion.p variants={textVariants} className="text-white/90 mb-4">
                <strong>User Type:</strong> {user?.user_type || "N/A"}
              </motion.p>
              <motion.button
                variants={textVariants}
                onClick={() => setIsEditing(true)}
                className="cursor-pointer w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-white py-3 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027]"
              >
                Edit Profile
              </motion.button>
            </div>
          )}

          <motion.button
            variants={textVariants}
            onClick={handleDeleteAccount}
            className={`cursor-pointer w-full bg-red-500 text-white py-3 rounded-md font-medium transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0f2027] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </div>
            ) : (
              "Delete Account"
            )}
          </motion.button>
        </div>

        <motion.p
          variants={textVariants}
          className="text-center mt-6 text-sm text-white/90"
        >
          Back to{" "}
          <button
            onClick={() => navigate("/store")}
            className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
          >
            Store
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}