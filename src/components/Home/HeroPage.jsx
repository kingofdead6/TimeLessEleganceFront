import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import storeImage from "../../assets/HeroPic.png"; 

const HomePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${storeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-transparent to-gray-900/60"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide"
          >
            Welcome to Timeless Elegance
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-100 mb-6 max-w-xl mx-auto"
          >
            Step into a world of refined fashion, where every piece tells a story of craftsmanship and style.
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="cursor-pointer px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </section>


    </div>
  );
};

export default HomePage;