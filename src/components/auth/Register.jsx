import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoEye, IoEyeOff, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    wilaya: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const navigate = useNavigate();

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
    "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleWilayaChange = (value) => {
    setFormData({ ...formData, wilaya: value });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Password validation
    if (!isMinLength) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!hasUppercase) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!hasLowercase) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!hasNumber) {
      setError("Password must contain at least one number");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    // Send JSON data instead of FormData
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      wilaya: formData.wilaya,
      password: formData.password,
      user_type: "customer",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  // Password criteria checks
  const isMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== "";

  const isFormComplete =
    Object.values(formData).every((value) => value.trim() !== "") &&
    termsAccepted &&
    isMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center my-30 p-4 sm:p-6">
      {showTermsPopup && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="fixed inset-0  bg-[#00000080] backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            variants={textVariants}
            className="bg-white/10 backdrop-blur-xl bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] border border-white/20 rounded-2xl p-6 max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl relative"
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
              className="text-2xl font-extrabold text-white mb-4"
            >
              Terms of Use
            </motion.h2>
            <motion.div
              variants={textVariants}
              className="text-white/90 space-y-4"
            >
              <p>
                <strong>1. Privacy:</strong> Your personal data will be processed per our privacy policy and applicable laws (e.g., GDPR).
              </p>
              <p>
                <strong>2. Usage:</strong> Use the platform only for legitimate purposes, such as shopping and order tracking.
              </p>
              <p>
                <strong>3. Accuracy:</strong> Provide accurate information. False data may lead to account suspension.
              </p>
              <p>
                <strong>4. Account Security:</strong> Keep your login credentials confidential and report unauthorized access immediately.
              </p>
              <p>
                <strong>5. Respect:</strong> Interact with support and admins respectfully.
              </p>
              <p>
                <strong>6. Service Changes:</strong> We may modify or terminate services with prior notice.
              </p>
            </motion.div>
            <motion.button
              variants={textVariants}
              onClick={() => setShowTermsPopup(false)}
              className="cursor-pointer mt-6 w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-white p-3 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027]"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <motion.button
          variants={textVariants}
          initial="hidden"
          animate="visible"
          onClick={() => navigate("/")}
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
          Create Account
        </motion.h2>

        {error && (
          <motion.div
            variants={textVariants}
            className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm font-medium mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-5">
          <div>
            <motion.label
              variants={textVariants}
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Full Name
            </motion.label>
            <motion.input
              variants={textVariants}
              name="name"
              type="text"
              placeholder="Enter your full name"
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
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Email
            </motion.label>
            <motion.input
              variants={textVariants}
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
              required
              aria-required="true"
            />
          </div>

          <div>
            <motion.label
              variants={textVariants}
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Phone Number
            </motion.label>
            <motion.input
              variants={textVariants}
              name="phone_number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
              required
              pattern="[0-9]{10}"
              maxLength="10"
              aria-required="true"
            />
          </div>

          <div>
            <motion.label
              variants={textVariants}
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Wilaya
            </motion.label>
            <Listbox value={formData.wilaya} onChange={handleWilayaChange}>
              <div className="relative">
                <Listbox.Button
                  className="cursor-pointer w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md text-left text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300"
                >
                  {formData.wilaya || "Select your wilaya"}
                </Listbox.Button>
                <Listbox.Options
                  className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#0f2027] text-white shadow-lg ring-1 ring-white/20 focus:outline-none z-10"
                >
                  {wilayas.map((wilaya) => (
                    <Listbox.Option
                      key={wilaya}
                      value={wilaya}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 ${
                          active ? "bg-cyan-400 text-white" : "text-white"
                        }`
                      }
                    >
                      {wilaya}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div className="relative">
            <motion.label
              variants={textVariants}
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Password
            </motion.label>
            <motion.input
              variants={textVariants}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
              className="cursor-pointer absolute right-3 top-10 text-white/70 hover:text-cyan-400 focus:outline-none transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </motion.button>
            <motion.div
              variants={textVariants}
              className="mt-2 text-sm text-white/90 space-y-1"
            >
              <div className="flex items-center">
                {isMinLength ? (
                  <IoCheckmarkCircle className="text-green-400 mr-2" size={16} />
                ) : (
                  <IoCloseCircle className="text-red-400 mr-2" size={16} />
                )}
                <span className={isMinLength ? "text-green-400" : "text-red-400"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center">
                {hasUppercase ? (
                  <IoCheckmarkCircle className="text-green-400 mr-2" size={16} />
                ) : (
                  <IoCloseCircle className="text-red-400 mr-2" size={16} />
                )}
                <span className={hasUppercase ? "text-green-400" : "text-red-400"}>
                  At least one uppercase letter
                </span>
              </div>
              <div className="flex items-center">
                {hasLowercase ? (
                  <IoCheckmarkCircle className="text-green-400 mr-2" size={16} />
                ) : (
                  <IoCloseCircle className="text-red-400 mr-2" size={16} />
                )}
                <span className={hasLowercase ? "text-green-400" : "text-red-400"}>
                  At least one lowercase letter
                </span>
              </div>
              <div className="flex items-center">
                {hasNumber ? (
                  <IoCheckmarkCircle className="text-green-400 mr-2" size={16} />
                ) : (
                  <IoCloseCircle className="text-red-400 mr-2" size={16} />
                )}
                <span className={hasNumber ? "text-green-400" : "text-red-400"}>
                  At least one number
                </span>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <motion.label
              variants={textVariants}
              className="block text-sm font-medium text-white/90 mb-1"
            >
              Confirm Password
            </motion.label>
            <motion.input
              variants={textVariants}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors duration-300 text-white placeholder-white/50"
              required
              aria-required="true"
            />
            <motion.button
              variants={textVariants}
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-3 top-10 text-white/70 hover:text-cyan-400 focus:outline-none transition-colors duration-200"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </motion.button>
            <motion.div
              variants={textVariants}
              className="mt-2 text-sm text-white/90"
            >
              <div className="flex items-center">
                {passwordsMatch ? (
                  <IoCheckmarkCircle className="text-green-400 mr-2" size={16} />
                ) : (
                  <IoCloseCircle className="text-red-400 mr-2" size={16} />
                )}
                <span className={passwordsMatch ? "text-green-400" : "text-red-400"}>
                  Passwords match
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={textVariants}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={handleTermsChange}
              className="cursor-pointer h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-white/20 rounded bg-white/5 accent-cyan-400"
              aria-checked={termsAccepted}
            />
            <label htmlFor="terms" className="text-sm text-white/90">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTermsPopup(true)}
                className="cursor-pointer text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Terms of Use
              </button>
            </label>
          </motion.div>

          <motion.button
            variants={textVariants}
            type="submit"
            onClick={handleSubmit}
            className={`cursor-pointer w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-white py-3 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027] ${
              isFormComplete ? "" : "opacity-50 cursor-not-allowed bg-gradient-to-r from-cyan-700 to-pink-700"
            }`}
            disabled={!isFormComplete}
            aria-disabled={!isFormComplete}
          >
            Register
          </motion.button>
        </div>

        <motion.p
          variants={textVariants}
          className="text-center mt-6 text-sm text-white/90"
        >
          Already have an account?{" "}
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