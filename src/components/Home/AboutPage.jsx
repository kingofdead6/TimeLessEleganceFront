import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
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

  return (
    <div className="py-20 px-4 sm:px-8 text-white">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className=" bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl overflow-hidden"
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

          <motion.h1
            variants={textVariants}
            className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-6 tracking-wide"
          >
            Who We Are
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="text-lg sm:text-xl text-white/90 text-center leading-relaxed"
          >
            We’re more than just a clothing store — we’re a movement of self-expression.
            Our mission is to create quality pieces that make you feel confident, comfortable, and effortlessly stylish.
            Every item is hand-picked or designed with intention, inspired by real people and real moments.
          </motion.p>
          <div className="mt-10 flex justify-center">
            <motion.div
              variants={textVariants}
              className="w-24 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 shadow-md"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
