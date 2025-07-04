import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-cyan-900 to-purple-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
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
            padding: 1.5rem;
          }
          h1 {
            font-size: 4rem;
          }
          h2 {
            font-size: 1.75rem;
            text-align: center;
          }
          p {
            font-size: 0.95rem;
            text-align: center;
          }
        }
      `}</style>
      <div className="wave-bg"></div>
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full glass-card p-6 sm:p-8 rounded-2xl shadow-2xl text-center relative z-10"
      >
        <h1 className="text-6xl sm:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4">
          Cosmic Destination Not Found
        </h2>
        <p className="text-white/90 mb-6 text-base sm:text-lg font-light">
          The page you're seeking has drifted into the void. Let's navigate back to reality.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="neon-button px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaHome />
            Go Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="neon-button px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaArrowLeft />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;