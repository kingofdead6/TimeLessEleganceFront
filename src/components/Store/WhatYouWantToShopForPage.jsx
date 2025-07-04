import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function WhatYouWantToShopForPage() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  // Background images for categories
  const categoryImages = {
    Clothing: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751459442/download_5_vmppdb.jpg",
    Footwear: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751459441/Men_s_Casual_Slip-On_Loafers_Leather_Shoes_British_Style_Business_Dress_Shoes_Please_Order_1_Size_Up_d4c8ns.jpg",
    Accessories: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751459440/Men_Solid_Trucker_Hat_kfswqf.jpg",
    Outerwear: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751459440/Onno_-_Wasserdichte_Outdoor-Jacke_-_Schwarz___3XL_z46csx.jpg",
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  // Animation variants for card flip
  const cardVariants = {
    front: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    back: {
      rotateY: 180,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    hidden: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Fetch categories with products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data.categories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for a selected category
  const handleCategoryClick = async (category) => {
    setFlippedCards((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));

    if (!subcategories[category]) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/products/subcategories?category=${category}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubcategories((prev) => ({
          ...prev,
          [category]: response.data.subcategories,
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subcategories");
      }
    }
  };

  // Navigate to subcategories page with category filter
  const handleDiscoverClick = (category) => {
    navigate(`/subcategories?category=${category}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 my-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative"
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

          .perspective-1000 {
            perspective: 1000px;
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }

          .textured-bg {
            background-image: url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751460328/download_6_drrcn6.jpg');
            background-blend-mode: overlay;
            background-size: cover;
            background-position: center;
            opacity: 0.2;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
          }
        `}</style>

        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />

        <motion.h1
          variants={cardVariants}
          className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-12 tracking-wide"
        >
          What Do You Want to Shop For?
        </motion.h1>

        {loading && (
          <motion.p
            variants={cardVariants}
            className="text-center text-white/90 text-lg"
          >
            Loading categories...
          </motion.p>
        )}

        {error && (
          <motion.div
            variants={cardVariants}
            className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm font-medium mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {!loading && categories.length === 0 && (
          <motion.p
            variants={cardVariants}
            className="text-center text-white/90 text-lg"
          >
            No categories with products available.
          </motion.p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category}
              className="relative perspective-1000 w-full h-80"
              onClick={() => handleCategoryClick(category)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d"
                animate={flippedCards[category] ? "back" : "front"}
                variants={cardVariants}
              >
                {/* Front Face */}
                <motion.div
                  className="absolute w-full h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-700 hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${categoryImages[category] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <h2 className="text-3xl font-bold text-white mb-6">
                        {category}
                      </h2>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscoverClick(category);
                        }}
                        className="cursor-pointer bg-gradient-to-r from-cyan-400 to-pink-400 text-white py-2 px-6 rounded-md font-medium transition-all duration-300 hover:from-cyan-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f2027]"
                        aria-label={`Discover ${category} subcategories`}
                      >
                        Discover This
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Back Face */}
                <motion.div
                  className="w-full h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:shadow-cyan-700 hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative "
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="textured-bg" />
                  <div className="glow-dot" />
                  <div className="glow-dot" />
                  <div className="glow-dot" />
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                    {category} Subcategories
                  </h3>
                  {subcategories[category]?.length > 0 ? (
                   <ul className="text-white/90 text-lg flex flex-row flex-wrap justify-center space-x-8 relative z-10 max-w-md">
                     {subcategories[category].map((subcategory) => (
                       <li key={subcategory} className="font-medium">
                         {subcategory}
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-white/90 text-lg relative z-10">No subcategories available.</p>
                 )}

                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}