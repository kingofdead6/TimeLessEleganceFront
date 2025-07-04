import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../../../api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
    gender: "",
    age: "",
    season: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

 
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const carouselVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  // Slider settings for carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  // Extract category and subcategory from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    const subcategory = params.get("subcategory") || "";
    setFilters((prev) => ({
      ...prev,
      category,
      subcategory,
    }));
  }, [location.search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/categories`);
        setCategories(["", ...response.data.categories]);
      } catch (err) {
        setError("Failed to load category options");
        toast.error("Failed to load category options", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchCategories();
  }, [navigate]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category) {
        setSubcategories([""]);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/subcategories`, {
          params: { category: filters.category },
        });
        setSubcategories(["", ...response.data.subcategories]);
        if (filters.subcategory && !response.data.subcategories.includes(filters.subcategory)) {
          setFilters((prev) => ({ ...prev, subcategory: "" }));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subcategory options");
        toast.error(err.response?.data?.message || "Failed to load subcategory options", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchSubcategories();
  }, [filters.category, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { ...filters, limit: 100 },
        });
        setProducts(response.data.products);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to fetch products");
          toast.error(err.response?.data?.message || "Failed to fetch products", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, navigate]);

  // Fetch Newest and Trending products
  useEffect(() => {
    const fetchCarouselProducts = async () => {
      setCarouselLoading(true);
      try {
        const [newestResponse, trendingResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`, { params: { newest: true } }),
          axios.get(`${API_BASE_URL}/api/products`, { params: { trending: true } }),
        ]);
        setNewestProducts(newestResponse.data.products);
        setTrendingProducts(trendingResponse.data.products);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load carousel products", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setCarouselLoading(false);
      }
    };
    fetchCarouselProducts();
  }, []);






  // Render carousel section
  const renderCarouselSection = (title, products, sectionId) => (
    <>
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, 0.01, 0.2, 1] }}
        className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 mb-6 tracking-wide pb-2"
      >
        {title}
      </motion.h2>
      {carouselLoading ? (
        <p className="text-white/80 text-center text-lg">Loading {title.toLowerCase()}...</p>
      ) : products.length === 0 ? (
        <p className="text-white/80 text-center text-lg">No {title.toLowerCase()} available at the moment.</p>
      ) : (
        <motion.div variants={carouselVariants} initial="hidden" animate="visible">
          <Slider {...sliderSettings}>
            {products.map((product, index) => (
              <div key={product._id} className="px-2">
                <motion.div
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className={`relative w-full h-64 rounded-xl overflow-hidden cursor-pointer card-${sectionId}-${index}`}
                >
                  <style>{`
                    .card-${sectionId}-${index} {
                      background-image: url(${product.pictures[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"});
                      background-size: cover;
                      background-position: center;
                    }
                    .card-${sectionId}-${index}:hover .overlay {
                      opacity: 1;
                    }
                    .card-${sectionId}-${index} .overlay {
                      opacity: 0;
                      transition: opacity 0.3s ease;
                      background: rgba(0, 0, 0, 0.5);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100%;
                    }
                    .card-${sectionId}-${index} .glow {
                      position: absolute;
                      width: 5px;
                      height: 5px;
                      background: rgba(34, 211, 238, 0.8);
                      border-radius: 50%;
                      animation: twinkle 3s ease-in-out infinite;
                    }
                    .card-${sectionId}-${index} .glow:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
                    .card-${sectionId}-${index} .glow:nth-child(2) { top: 70%; left: 80%; animation-delay: 0.8s; }
                    .card-${sectionId}-${index} .glow:nth-child(3) { top: 40%; left: 30%; animation-delay: 1.6s; }
                    @keyframes twinkle {
                      0%, 100% { opacity: 0.4; transform: scale(1); }
                      50% { opacity: 1; transform: scale(1.5); }
                    }
                  `}</style>
                  <div className="overlay">
                    <p className="text-white text-lg font-semibold">{product.name}</p>
                  </div>
                  <div className="glow" />
                  <div className="glow" />
                  <div className="glow" />
                </motion.div>
              </div>
            ))}
          </Slider>
        </motion.div>
      )}
    </>
  );

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer />
      <style>
        {`
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

          .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, 250px);
            gap: 2rem;
            justify-content: center;
            justify-items: center;
          }

          .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 250px;
            min-height: 350px;
          }

          .product-card:hover {
            transform: scale(0.95);
            box-shadow: 0 10px 20px rgba(0, 255, 255, 0.3);
          }

          .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .header-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .slick-prev, .slick-next {
            color: #22d3ee !important;
            z-index: 10;
          }
          .slick-prev:hover, .slick-next:hover {
            color: #06b6d4 !important;
          }
          .slick-dots li button:before {
            color: #22d3ee !important;
            font-size: 12px;
          }
          .slick-dots li.slick-active button:before {
            color: #06b6d4 !important;
          }

          @media (max-width: 640px) {
            .product-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .product-card {
              width: 90vw;
              max-width: 350px;
              min-height: 320px;
              margin: 0 auto;
            }
            .filter-grid {
              grid-template-columns: 1fr;
              gap: 0.75rem;
            }
            .header-buttons {
              flex-direction: column;
              align-items: center;
              gap: 0.75rem;
            }
            .header-buttons button {
              width: 100%;
              max-width: 200px;
            }
            h2 {
              font-size: 1.75rem;
              text-align: center;
            }
            p {
              font-size: 0.95rem;
              text-align: center;
            }
            .product-card .text-xl {
              font-size: 1.25rem;
            }
            .product-card .text-lg {
              font-size: 1rem;
            }
            .product-card .text-sm {
              font-size: 0.875rem;
            }
          }
        `}
      </style>
      <div className="textured-bg" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-7xl mx-auto relative z-10 my-20">
        {/* Carousels for Newest and Trending Products */}
        {renderCarouselSection("Newest Products", newestProducts, "newest")}
        <div className="mt-12" />
        {renderCarouselSection("Most Trending Products", trendingProducts, "trending")}
        <div className="mt-12" />

      </div>
    </div>
  );
}