import React from "react";
import { motion } from "framer-motion";

const TestimonialsPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    }),
    hover: {
      scale: 1.04,
      boxShadow: "0 0 40px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 123, 255, 0.4)",
      transition: { duration: 0.3 },
    },
  };

  const testimonials = [
    {
      quote:
        "⭐⭐⭐⭐⭐\nThe quality is amazing, and I always get compliments when I wear your clothes. Fast shipping and great service too!",
      author: "— Sofia R.",
    },
    {
      quote:
        "⭐⭐⭐⭐⭐\nLove the unique designs and how comfortable everything is. It’s my go-to for stylish everyday wear!",
      author: "— Liam K.",
    },
  ];

  return (
    <section
      className=" py-20 px-6 sm:px-10  text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200"
    >
      <div className="max-w-7xl mx-auto ">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-4xl sm:text-5xl font-extrabold text-center mb-16 tracking-tight"
        >
          💫 What Our Customers Say
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-10 grid-cols-1 sm:grid-cols-2 place-items-center"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative w-full max-w-sm p-6 rounded-2xl backdrop-blur-xl border border-cyan-400/10 bg-white/5 shadow-lg overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
            >
              <style>{`
                .card-${index} .wave {
                  position: absolute;
                  inset: 0;
                  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(0, 255, 255, 0.15)' stroke-width='2' d='M0,160 L80,140 C240,100 400,100 560,120 C720,140 880,140 1040,140 C1200,140 1360,140 1440,140 L1440,320 L0,320 Z'/%3E%3C/svg%3E");
                  opacity: 0.5;
                  background-size: 300%;
                  animation: moveWave 10s linear infinite;
                  pointer-events: none;
                }
                .card-${index} .spark {
                  position: absolute;
                  width: 4px;
                  height: 4px;
                  background: #38f6fc;
                  border-radius: 50%;
                  opacity: 0.6;
                  animation: blink 4s ease-in-out infinite;
                }
                .card-${index} .spark:nth-child(1) { top: 20%; left: 25%; animation-delay: 0s; }
                .card-${index} .spark:nth-child(2) { top: 40%; left: 80%; animation-delay: 1s; }
                .card-${index} .spark:nth-child(3) { top: 70%; left: 35%; animation-delay: 2s; }

                @keyframes moveWave {
                  0% { background-position: 0 0; }
                  100% { background-position: 300% 0; }
                }
                @keyframes blink {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.5); }
                }
              `}</style>

              <div className={`card-${index} relative z-10`}>
                <p className="text-lg text-white/90 font-light mb-6 whitespace-pre-line leading-relaxed">
                  {testimonial.quote}
                </p>
                <p className="text-right text-cyan-300 font-medium">{testimonial.author}</p>
                <div className="wave absolute z-0 rounded-2xl"></div>
                <div className="spark"></div>
                <div className="spark"></div>
                <div className="spark"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsPage;
