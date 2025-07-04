import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.3, duration: 0.7, ease: [0.6, 0.01, 0.2, 1] },
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 0 40px rgba(34, 211, 238, 0.5), 0 0 60px rgba(139, 92, 246, 0.4)",
      transition: { duration: 0.3 },
    },
  };

  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.4 } },
  };

  const faqs = [
    {
      question: "What makes Timeless Elegance’s clothing unique?",
      answer:
        "Our clothing is crafted with premium materials and timeless designs that blend sophistication with modern style. Each piece is curated to ensure you feel confident and elegant, with a focus on quality and durability that transcends trends.",
    },
    {
      question: "How do I choose the right size?",
      answer:
        "We provide detailed size charts for each product on our website. You can also contact our support team at support@timelesselegance.com for personalized sizing assistance to ensure the perfect fit.",
    },
    {
      question: "What are your shipping and return policies?",
      answer:
        "We offer fast, reliable shipping worldwide. Standard shipping typically takes 5-7 business days. Returns are accepted within 30 days for unworn items in original condition. Visit our Shipping & Returns page for full details.",
    },
    {
      question: "Are your products sustainable?",
      answer:
        "Yes, we are committed to sustainability. We use eco-friendly materials and ethical production practices to minimize our environmental impact, ensuring our elegance doesn’t come at the planet’s expense.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Our support team is available via email at support@timelesselegance.com or by phone at +1 (234) 567-890. You can also reach us through our Contact Us page or social media channels for quick assistance.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 sm:px-10 text-white  relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.2, 1] }}
          className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 mb-12 tracking-wide"
        >
          Frequently Asked Questions
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`relative w-full max-w-2xl mx-auto p-6 rounded-2xl backdrop-blur-xl border border-white/15 bg-black/70 shadow-lg overflow-hidden card-${index}`}
            >
              <style>{`
                .card-${index} .cascade {
                  position: absolute;
                  inset: 0;
                  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 144 blind: 0 0 10px rgba(34, 211, 238, 0.2); stroke-width: 2; stroke: rgba(34, 211, 238, 0.2); d: M0,160 C320,100 640,100 960,160 C1280,220 1440,220 1440,220'/%3E%3C/svg%3E");
                  opacity: 0.3;
                  background-size: 150%;
                  animation: cascadeFlow 7s linear infinite;
                  pointer-events: none;
                }
                .card-${index} .star {
                  position: absolute;
                  width: 5px;
                  height: 5px;
                  background: rgba(34, 211, 238, 0.8);
                  border-radius: 50%;
                  opacity: 0.6;
                  animation: twinkle 3s ease-in-out infinite;
                }
                .card-${index} .star:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
                .card-${index} .star:nth-child(2) { top: 60%; left: 85%; animation-delay: 0.8s; }
                .card-${index} .star:nth-child(3) { top: 40%; left: 30%; animation-delay: 1.6s; }
                @keyframes cascadeFlow {
                  0% { background-position: 0 100%; }
                  100% { background-position: 150% 0; }
                }
                @keyframes twinkle {
                  0%, 100% { opacity: 0.4; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.5); }
                }
                @media (max-width: 640px) {
                  .card-${index} {
                    max-width: 340px;
                    margin: 0 auto;
                  }
                  .card-${index} p, .card-${index} h3 {
                    font-size: 0.95rem;
                  }
                }
              `}</style>

              <div className={`card-${index} relative z-10`}>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-white/95">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 360 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeIndex === index ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                  </motion.div>
                </div>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      variants={answerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="mt-4 text-white/90 text-base leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="cascade absolute z-0 rounded-2xl" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;