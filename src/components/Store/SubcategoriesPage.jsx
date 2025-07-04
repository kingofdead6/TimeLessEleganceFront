import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
  >
    <FaArrowLeft className="h-5 w-5" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
  >
    <FaArrowRight className="h-5 w-5" />
  </button>
);

export default function SubcategoriesPage() {
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Subcategory images
  const subcategoryImages = {
    // Clothing
    Shirt: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470873/Women_s_Men_s_Clothing_Shop_Online_Fashion_sqzpvu.jpg",
    Pants: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470870/download_8_jynpzo.jpg",
    Dress: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470870/1950s_blue_cape_collar_dress_rtnrce.jpg",
    Skirt: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470870/download_9_dsogmd.jpg",
    Sweater: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470871/Autumn_Winter_Vintage_Striped_Sweater_Men_Clothes_Pullover_Men_Sweater_Jumper_Men_s_Sweater_Knit_kbjkwf.jpg",
    "T-Shirt": "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470868/download_7_wmkiau.jpg",
    Shorts: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470868/Pantaloncini_Cargo_moda_uomo_estate_ins_pantaloni_casual_casual_studenti_trend_port_wind_pants_vkvi3o.jpg",
    Thobe: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751473166/download_11_i2l9e0.jpg",
    Hoddies: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751470869/download_10_mzsge3.jpg",
    // Footwear
    Sneakers: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751477655/download_12_dovmfv.jpg",
    Boots: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751477655/Amazon_com__WIDEWAY_Men_s_8_Inches_Military_Tactical_Work_Boots_Side_Zipper_Lightweight_Army_Combat_Boots_Durable_Outdoor_Work_Boots_Desert_Boots___Clothing_Shoes_Jewelry_wz9arl.jpg",
    Sandals: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751477654/Lightweight_Summer_Trekking_Sandals_-_Light_Green___39_xyljwu.jpg",
    "Dress Shoes": "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751477653/Mens_Business_Style_Formal_Lace_Up_British_Style_Patent_Leather_Casual_Shoes_HOT___eBay_pzk95d.jpg",
    Slippers: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751477654/Comfortable_Non-slip_Home_Slippers_For_Indoor_Use_byg2j3.jpg",
    // Accessories
    Hat: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479547/The_North_Face_Logo_Box_Cuffed_Beanie_gc3vj4.jpg",
    Belt: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479328/Double-sided_Genuine_Leather_Alloy_Grain_Reverse_Pull_Simple_Business_Casual_Pants_Belt_-_Twill_Brown___115cm_k5y9ua.jpg",
    Scarf: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479325/Luxury_Divas_Navy_Blue_Classic_Softer_Than_Cashmere_Scarf_--_For_more_information_visit_image_link__rved8u.jpg",
    Gloves: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479325/SHORT_FINGER_QUEEN_BEE_GLOVES_-_Black___M_bupusv.jpg",
    Sunglasses: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479323/Reading_Bifocal_Sunglasses_Fashionable_Pilot_Style_Men_yhy57e.jpg",
    Bag: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479324/Men_s_Leather_Bags_Accessories_rkwcuj.jpg",
    Watch: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479324/Luxury_Casual_Leather_Quartz_Men_s_Watch_-_All_Black_cutw6b.jpg",
    cap: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479328/Porsche_Motorsports_mi0qfq.jpg",
    // Outerwear
    Coat: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479806/Red_Smoke_Blade_Runner_2049_Ryan_Gosling_Officer_K_Shearling_Black_Trench_Leather_Coat_Costume_jvtwae.jpg",
    Parka: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479805/Thick_Puffer_Jacket_Parkas_Overcoat_Men_s_Winter_Parka_Men_White_Duck_Down_Removable_Cap_Mens_High_jvckdl.jpg",
    "Trench Coat": "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479803/Mordenmiss_Men_s_French_Woolen_Coat_Business_Down_Jacket_Trench_Topcoat_-_Large_qm5xjk.jpg",
    "Bomber Jacket": "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479801/Streetwear_Warm_Bomber_Jacket_faczxi.jpg",
    Jacket: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479802/M%C4%99ska_kurtka_z_kapturem_i_zamkiem_b%C5%82yskawicznym_wychodz%C4%85ca_czarna_kurtka_z_kapturem_i_d%C5%82ugim_r%C4%99kawem_dla_przyjaci%C3%B3%C5%82_m%C4%99%C5%BCa_ch%C5%82opaka_ojojvy.jpg",
    Raincoat: "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751479547/The_North_Face_Logo_Box_Cuffed_Beanie_gc3vj4.jpg",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: subcategories.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: "10px",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: subcategories.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: subcategories.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: subcategories.length > 1,
        },
      },
    ],
  };

  // Extract category from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedCategory = params.get("category");
    setCategory(selectedCategory);
  }, [location.search]);

  // Fetch subcategories for the selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/products/subcategories?category=${category}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setSubcategories(response.data.subcategories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subcategories");
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [category]);

  // Navigate to products page with filters
  const handleSubcategoryClick = (subcategory) => {
    navigate(`/products?category=${category}&subcategory=${subcategory}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-8xl w-full mx-auto relative "
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

          .textured-bg {
            background-image: url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png');
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

          .slick-slide > div {
            display: flex;
            justify-content: center;
          }

          .slick-list {
            padding: 0 !important;
          }

          .subcategory-card {
            margin: 0 15px;
          }
        `}</style>

        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />

        <motion.h1
          variants={cardVariants}
          className="text-2xl sm:text-5xl font-extrabold text-center text-white mb-12 tracking-wide"
        >
          {category ? `${category} Subcategories` : "Explore Subcategories"}
        </motion.h1>

        {loading && (
          <motion.p
            variants={cardVariants}
            className="text-center text-white/90 text-xl"
          >
            Loading subcategories...
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

        {!loading && !category && (
          <motion.p
            variants={cardVariants}
            className="text-center text-white/90 text-lg"
          >
            Please select a category to view subcategories.
          </motion.p>
        )}

        {!loading && category && subcategories.length === 0 && (
          <motion.p
            variants={cardVariants}
            className="text-center text-white/90 text-lg"
          >
            No subcategories available for {category}.
          </motion.p>
        )}
        
        {category && subcategories.length > 0 && (
          <Slider {...sliderSettings}>
            {subcategories.map((subcategory) => (
              <motion.div
                key={subcategory}
                variants={cardVariants}
                className="subcategory-card  relative w-50 h-85 rounded-full border border-white/20 overflow-hidden shadow-2xl shadow-transparent hover:shadow-cyan-700 hover:scale-90 transition-all duration-300 cursor-pointer"
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <div className="textured-bg" />
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${subcategoryImages[subcategory] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-white text-center relative z-10">
                      {subcategory}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </Slider>
        )}
      </motion.div>
    </div>
  );
}