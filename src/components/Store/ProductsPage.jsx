import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
    gender: "",
    age: "",
    season: "",
  });
  const [visibleCount, setVisibleCount] = useState(20);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

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
          setIsAuthenticated(false);
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
    setVisibleCount(20);
    const params = new URLSearchParams();
    Object.entries({ ...filters, [name]: value }).forEach(([key, val]) => {
      if (val && (key !== "subcategory" || filters.category)) {
        params.set(key, val);
      }
    });
    navigate(`?${params.toString()}`, { replace: true });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      subcategory: "",
      gender: "",
      age: "",
      season: "",
    });
    setVisibleCount(20);
    navigate("?", { replace: true });
  };

  // Show more/less products
  const showMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const showLess = () => {
    setVisibleCount((prev) => Math.max(20, prev - 8));
  };

  // Filter products based on stock and search
  const filteredProducts = products.filter((product) => {
    const isInStock = product.stock.some((s) => s.quantity > 0);
    const searchTerm = filters.search.trim().toLowerCase();
    
    // If there's a search term, show products that include the search term in their name, regardless of stock
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm);
    }
    
    // Otherwise, only show in-stock products
    return isInStock;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative">
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-black/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-4xl font-extrabold text-white tracking-wide mb-4 sm:mb-0">Explore Our Collection</h2>
            <div className="flex flex-col gap-3">
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/cart")}
                  className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                >
                  View Cart
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>
          <p className="text-white/90 mb-8 text-lg font-light">Discover the perfect style for you.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-lg text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Filters */}
          <div className="filter-grid mb-10">
            <input
              type="text"
              name="search"
              placeholder="Search by any part of product name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white placeholder-white/50"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white"
            >
              {categories.map((category) => (
                <option key={category || "none"} value={category} className="bg-black/80 text-white">
                  {category || "All Categories"}
                </option>
              ))}
            </select>
            <select
              name="subcategory"
              value={filters.subcategory}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white"
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory || "none"} value={subcategory} className="bg-black/80 text-white">
                  {subcategory || "All Subcategories"}
                </option>
              ))}
            </select>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white"
            >
              <option value="" className="bg-black/80 text-white">All Genders</option>
              <option value="Men" className="bg-black/80 text-white">Men</option>
              <option value="Women" className="bg-black/80 text-white">Women</option>
            </select>
            <select
              name="age"
              value={filters.age}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white"
            >
              <option value="" className="bg-black/80 text-white">All Ages</option>
              <option value="Child" className="bg-black/80 text-white">Child</option>
              <option value="Teen" className="bg-black/80 text-white">Teen</option>
              <option value="Adult" className="bg-black/80 text-white">Adult</option>
            </select>
            <select
              name="season"
              value={filters.season}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-white"
            >
              <option value="" className="bg-black/80 text-white">All Seasons</option>
              <option value="Winter" className="bg-black/80 text-white">Winter</option>
              <option value="Summer" className="bg-black/80 text-white">Summer</option>
              <option value="Both" className="bg-black/80 text-white">Both</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg font-medium"
            >
              Loading...
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg font-medium"
            >
              No products found
            </motion.p>
          ) : (
            <div className="product-grid mb-10">
              <AnimatePresence>
                {filteredProducts.slice(0, visibleCount).map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="product-card relative rounded-xl border border-white/20 overflow-hidden shadow-2xl shadow-transparent hover:shadow-cyan-700 hover:scale-95 transition-all duration-300 cursor-pointer flex flex-col"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="textured-bg" />
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${product.pictures[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
                        <h3 className="text-xl font-extrabold text-white">{product.name}</h3>
                        <p className="text-white/90 text-lg font-medium">${product.price.toFixed(2)}</p>
                        <p className="text-white/70 text-sm mt-2">{product.category} • {product.subcategory}</p>
                        <p className="text-white/70 text-sm">
                          {product.stock.some((s) => s.quantity > 0) ? (
                            <span className="text-cyan-400">In Stock</span>
                          ) : (
                            <span className="text-red-400">Out of Stock</span>
                          )}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Show More/Less Buttons */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <motion.button
                whileHover={{ scale: visibleCount < filteredProducts.length ? 1.05 : 1 }}
                whileTap={{ scale: visibleCount < filteredProducts.length ? 0.95 : 1 }}
                onClick={showMore}
                disabled={visibleCount >= filteredProducts.length}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 w-full sm:w-auto max-w-[200px] ${
                  visibleCount >= filteredProducts.length
                    ? "bg-gray-400/50 cursor-not-allowed opacity-50"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Show More
              </motion.button>
              <motion.button
                whileHover={{ scale: visibleCount > 20 ? 1.05 : 1 }}
                whileTap={{ scale: visibleCount > 20 ? 0.95 : 1 }}
                onClick={showLess}
                disabled={visibleCount <= 20}
                className={`cursor-pointer px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 w-full sm:w-auto max-w-[200px] ${
                  visibleCount <= 20
                    ? "bg-gray-400/50 cursor-not-allowed opacity-50"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Show Less
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}