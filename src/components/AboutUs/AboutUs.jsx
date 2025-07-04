import React from "react";
import { motion } from "framer-motion";

const AboutUsHeader = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.5, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const auroraVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: { duration: 12, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="py-20 px-4 sm:px-8 text-white relative overflow-hidden  mt-10">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative bg-black/75 backdrop-blur-2xl border border-white/15 rounded-3xl p-10 sm:p-14 shadow-2xl shadow-cyan-900/50 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 opacity-25"
            variants={auroraVariants}
            animate="animate"
          />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png')] bg-cover bg-center opacity-12 z-0" />
          <div className="absolute w-6 h-6 bg-cyan-400/40 rounded-full top-[12%] left-[22%] blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
          <div className="absolute w-6 h-6 bg-purple-400/40 rounded-full top-[78%] left-[68%] blur-xl animate-[pulse_3s_ease-in-out_infinite_0.7s]" />
          <div className="absolute w-6 h-6 bg-pink-400/40 rounded-full top-[58%] left-[38%] blur-xl animate-[pulse_3s_ease-in-out_infinite_1.4s]" />
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.6); }
              }
            `}
          </style>

          <motion.h1
            variants={textVariants}
            className="text-4xl sm:text-6xl font-extrabold text-left text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 mb-6 tracking-wide pb-2"
          >
            Timeless Elegance
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="text-lg sm:text-2xl text-white/95 text-left leading-relaxed max-w-2xl"
          >
            Timeless Elegance is a sanctuary of style, where luxury meets legacy. Our meticulously crafted collections are designed to inspire confidence and grace, offering you pieces that are as enduring as they are exquisite.
          </motion.p>
          <motion.div
            variants={textVariants}
            className="mt-10 flex justify-start"
          >
            <div className="w-48 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-lg shadow-cyan-500/40 animate-[glow_4s_ease-in-out_infinite]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsHeader;