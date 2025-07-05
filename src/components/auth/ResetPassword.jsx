import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoArrowBack, IoEye, IoEyeOff } from "react-icons/io5";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token,
        password: formData.password,
      });
      setSuccess("Password reset successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
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
          onClick={() => navigate("/login")}
          className="flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
          Set New Password
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
          <div>
            <motion.label
              variants={textVariants}
              htmlFor="password"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              New Password
            </motion.label>
            <div className="relative">
              <motion.input
                variants={textVariants}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
                required
                aria-required="true"
              />
              <motion.button
                variants={textVariants}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white/70 hover:text-cyan-400 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </motion.button>
            </div>
          </div>

          <div>
            <motion.label
              variants={textVariants}
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Confirm Password
            </motion.label>
            <motion.input
              variants={textVariants}
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
              required
              aria-required="true"
            />
          </div>

          <motion.button
            variants={textVariants}
            type="submit"
            onClick={handleSubmit}
            className={`cursor-pointer w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-white py-3 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027] ${
              isFormComplete && !isLoading ? "" : "opacity-50 cursor-not-allowed bg-gradient-to-r from-cyan-700 to-pink-700"
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
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </div>

        <motion.p
          variants={textVariants}
          className="text-center mt-6 text-sm text-white/90"
        >
          Back to{" "}
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
          >
            Login
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}