import React, { useEffect } from "react";
import { motion } from "framer-motion";

const AdminMain = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative ">
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
      <div className="max-w-7xl mx-auto relative z-10 my-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-[#0f2027]/50 via-[#203a43]/50 to-[#2c5364]/50 backdrop-blur-xl  shadow-cyan-400 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 tracking-wide mb-4 text-center">
            Welcome to the Cosmic Control Center
          </h2>
          <p className="text-white/90 mb-6 text-lg font-light text-center">
            Step into the heart of your digital universe. Here, you wield the power to shape experiences, craft opportunities, and illuminate the future. Your vision transforms the cosmos of this platform, guiding every star in its orbit with elegance and precision.
          </p>
          <p className="text-white/70 text-base font-light text-center">
            From this command hub, orchestrate the symphony of content that captivates and inspires. Let your creativity soar across the galaxy, forging connections that resonate through time and space. The universe awaits your command.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMain;