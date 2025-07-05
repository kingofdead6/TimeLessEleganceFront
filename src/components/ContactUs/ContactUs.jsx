import React, { useEffect, useState } from "react";
import { motion} from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Check if all required fields are filled
  const isFormValid = formData.name && formData.email && formData.message;

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: "rgba(34, 211, 238, 0.8)", transition: { duration: 0.2 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send message", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ToastContainer />
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-4xl mx-auto bg-black/70 backdrop-blur-xl rounded-3xl relative shadow-2xl shadow-cyan-900/50 mt-14"
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png')] bg-cover bg-center opacity-15 z-0" />
        <div className="absolute w-4 h-4 bg-white/60 rounded-full top-[10%] left-[20%] blur-md animate-[blink_3s_ease-in-out_infinite]" />
        <div className="absolute w-4 h-4 bg-white/60 rounded-full top-[80%] left-[75%] blur-md animate-[blink_3s_ease-in-out_infinite_0.8s]" />
        <div className="absolute w-4 h-4 bg-white/60 rounded-full top-[60%] left-[35%] blur-md animate-[blink_3s_ease-in-out_infinite_1.6s]" />
        <style>
          {`
            @keyframes blink {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.9; transform: scale(1.4); }
            }
          `}
        </style>
        <div className="relative z-10 p-8 sm:p-12">
          {/* Header Content */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wide mb-5 text-left">Let's Connect</h2>
          <p className="text-white/90 text-lg sm:text-xl mb-10 text-left max-w-2xl leading-relaxed">
            Have a question or need assistance? Reach out to us! Our team is dedicated to providing you with the best support. Fill out the form below, and we'll respond as soon as possible.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-white/90 text-base font-medium block mb-2">Name</label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                placeholder="Your Full Name"
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-white/90 text-base font-medium block mb-2">Email</label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                placeholder="Your Email Address"
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-white/90 text-base font-medium block mb-2">Phone Number</label>
              <motion.input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                placeholder="Your Phone Number"
                variants={inputVariants}
                whileFocus="focus"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="text-white/90 text-base font-medium block mb-2">Message</label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                placeholder="Tell us how we can help you..."
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>
            <motion.button
              whileHover={{ scale: isFormValid && !loading ? 1.05 : 1 }}
              whileTap={{ scale: isFormValid && !loading ? 0.95 : 1 }}
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-cyan-700/50 ${!isFormValid || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"}`}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>

          {/* Contact Details */}
          <div className="mt-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mb-6 text-left">Our Contact Information</h3>
            <div className="space-y-5 text-white/90 text-base">
              <p><span className="font-medium">Email:</span> <a href="mailto:support@yourbrand.com" className="hover:text-cyan-400 transition-colors duration-200">support@yourbrand.com</a></p>
              <p><span className="font-medium">Phone:</span> <a href="tel:+1234567890" className="hover:text-cyan-400 transition-colors duration-200">+1 (234) 567-890</a></p>
              <div className="flex gap-6">
                <motion.a
                  href="https://instagram.com/yourbrand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-cyan-400 transition-colors duration-200"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaInstagram size={28} />
                </motion.a>
                <motion.a
                  href="https://facebook.com/yourbrand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-cyan-400 transition-colors duration-200"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaFacebook size={28} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/company/yourbrand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-cyan-400 transition-colors duration-200"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaLinkedin size={28} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;