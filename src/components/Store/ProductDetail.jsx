import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  // Fetch product and related products
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const productResponse = await axios.get(`${API_BASE_URL}/api/products/${productId}`, { headers });
        setProduct(productResponse.data);

        const relatedResponse = await axios.get(`${API_BASE_URL}/api/products/related`, {
          headers,
          params: { productId, category: productResponse.data.category, subcategory: productResponse.data.subcategory },
        });
        setRelatedProducts(relatedResponse.data.products);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load product details", {
          position: "top-right",
          autoClose: 3000,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product?.pictures?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (product?.pictures?.length || 1)) % (product?.pictures?.length || 1));
  };

  // Handle size change
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    setQuantity(1);
  };

  // Get available sizes and max quantity
  const availableSizes = product?.stock?.filter((s) => s.quantity > 0).map((s) => s.size) || [];
  const maxQuantity = selectedSize
    ? product?.stock?.find((s) => s.size === selectedSize)?.quantity || 0
    : 0;

  // Handle add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (quantity < 1 || quantity > maxQuantity) {
      toast.error(`Please select a quantity between 1 and ${maxQuantity}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        { productId: product._id, quantity, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product to cart", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-cyan-800 to-purple-900 py-8 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer />
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-5xl mx-auto bg-black/60 backdrop-blur-lg rounded-4xl relative shadow-2xl shadow-cyan-900/50 mt-20"
      >
        <style>
          {`
            .textured-bg {
              background-image: url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png');
              background-blend-mode: overlay;
              background-size: cover;
              background-position: center;
              opacity: 0.15;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 0;
            }
            .glow-dot {
              position: absolute;
              width: 12px;
              height: 12px;
              background: rgba(255, 255, 255, 0.5);
              border-radius: 50%;
              filter: blur(4px);
              animation: blink 4s ease-in-out infinite;
            }
            .glow-dot:nth-child(1) { top: 5%; left: 15%; animation-delay: 0s; }
            .glow-dot:nth-child(2) { top: 85%; left: 85%; animation-delay: 1s; }
            .glow-dot:nth-child(3) { top: 50%; left: 30%; animation-delay: 2s; }
            @keyframes blink {
              0%, 100% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.3); }
            }
            .related-grid {
              display: grid;
              grid-template-columns: repeat(4, 180px);
              gap: 1.5rem;
              justify-content: center;
            }
            .related-card {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              width: 180px;
              min-height: 220px;
              border-radius: 12px;
            }
            .related-card:hover {
              transform: scale(0.97);
              box-shadow: 0 12px 24px rgba(0, 255, 255, 0.4);
            }
            .image-container {
              position: relative;
              width: 100%;
              height: 24rem;
            }
            .carousel-buttons {
              display: flex;
              justify-content: space-between;
              position: absolute;
              top: 50%;
              width: 100%;
              transform: translateY(-50%);
              padding: 0 1rem;
            }
            .popup-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.7);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .popup-content {
              background: rgba(0, 0, 0, 0.9);
              backdrop-filter: blur(8px);
              border-radius: 1rem;
              padding: 1.5rem;
              max-width: 90%;
              width: 400px;
              position: relative;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .popup-close {
              position: absolute;
              top: 0.5rem;
              right: 0.5rem;
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 0.5rem;
            }
            .popup-buttons {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 1.5rem;
            }
            @media (max-width: 768px) {
              .related-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
              }
              .related-card {
                width: 90vw;
                max-width: 340px;
                min-height: 240px;
                margin: 0 auto;
              }
              .image-container {
                height: 18rem;
                border-radius: 1rem;
              }
              .carousel-buttons {
                padding: 0 0.5rem;
              }
              .carousel-buttons button {
                padding: 0.5rem;
                background: rgba(0, 0, 0, 0.7);
              }
              .product-details select,
              .product-details input,
              .product-details button {
                width: 100%;
                max-width: 340px;
              }
              .details-container {
                margin-top: 1rem;
              }
              .toggle-details-btn {
                width: 100%;
                max-width: 340px;
                margin: 0 auto;
              }
              .popup-content {
                width: 85vw;
                padding: 1rem;
              }
            }
            @media (max-width: 640px) {
              .related-card .text-base {
                font-size: 1.1rem;
              }
              .related-card .text-sm {
                font-size: 0.9rem;
              }
              h2 {
                font-size: 1.75rem;
              }
              h3 {
                font-size: 1.5rem;
              }
              p, label {
                font-size: 0.95rem;
              }
              .product-details {
                padding: 0 0.5rem;
              }
              .popup-buttons {
                flex-direction: column;
                gap: 0.75rem;
              }
              .popup-buttons button {
                width: 100%;
                max-width: 200px;
              }
            }
          `}
        </style>
        <div className="textured-bg" />
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="relative z-10 p-6 sm:p-10">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Carousel */}
            <div className="lg:w-1/2">
              <div className="image-container">
                <motion.div
                  className="w-full h-full bg-contain bg-no-repeat bg-center rounded-2xl border border-white/20 shadow-lg"
                  style={{
                    backgroundImage: `url(${product.pictures?.[currentImageIndex] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {product.pictures?.length > 1 && (
                  <div className="carousel-buttons">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevImage}
                      className="cursor-pointer p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                    >
                      <FaArrowLeft size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextImage}
                      className="cursor-pointer p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                    >
                      <FaArrowRight size={16} />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 text-white flex flex-col justify-between product-details">
              <div>
                <h2 className="text-4xl font-extrabold tracking-wide mb-3">{product.name || "Product"}</h2>
                <p className="text-2xl font-semibold text-cyan-400 mb-3">${product.price?.toFixed(2) || "0.00"}</p>
                <p className="text-white/80 text-base leading-relaxed mb-4 block lg:hidden">
                  {product.description || "No description available."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetails(!showDetails)}
                  className="cursor-pointer toggle-details-btn px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-indigo-700 shadow-md mb-4"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </motion.button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="details-container space-y-2 mb-4"
                    >
                      <p className="text-white/80 text-base"><span className="font-medium">Category:</span> {product.category || "N/A"}</p>
                      <p className="text-white/80 text-base"><span className="font-medium">Subcategory:</span> {product.subcategory || "N/A"}</p>
                      <p className="text-white/80 text-base"><span className="font-medium">Gender:</span> {product.gender || "N/A"}</p>
                      <p className="text-white/80 text-base"><span className="font-medium">Age:</span> {product.age || "N/A"}</p>
                      <p className="text-white/80 text-base"><span className="font-medium">Season:</span> {product.season || "N/A"}</p>
                      <p className="text-white/80 text-base">
                        <span className="font-medium">Stock:</span>{" "}
                        {product.stock?.some((s) => s.quantity > 0) ? (
                          <span className="text-cyan-400">In Stock</span>
                        ) : (
                          <span className="text-red-400">Out of Stock</span>
                        )}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-white/80 text-base leading-relaxed mb-4 hidden lg:block">
                  {product.description || "No description available."}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-white/80 text-base font-medium block">Size:</label>
                  <select
                    value={selectedSize}
                    onChange={handleSizeChange}
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                  >
                    <option value="">Select Size</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/80 text-base font-medium block">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                    disabled={!selectedSize}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || quantity < 1 || quantity > maxQuantity}
                  className={` w-full px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-cyan-700/50 ${
                    !selectedSize || quantity < 1 || quantity > maxQuantity
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-indigo-700 cursor-pointer"
                  }`}
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>

          {/* Login Popup */}
          <AnimatePresence>
            {showLoginPopup && (
              <motion.div
                className="popup-overlay"
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div className="popup-content">
                  <button
                    className="popup-close"
                    onClick={() => setShowLoginPopup(false)}
                  >
                    <FaTimes size={20} />
                  </button>
                  <p className="text-white text-center text-base mb-4">
                    You need to log in to add items to your cart.
                  </p>
                  <div className="popup-buttons ">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/register")}
                      className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-indigo-700"
                    >
                      Register
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/login")}
                      className="cursor-pointer px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-cyan-600"
                    >
                      Login
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Related Products */}
          <div className="mt-8">
            <h3 className="text-2xl font-extrabold text-white tracking-wide mb-5">You Might Also Like</h3>
            {loading ? (
              <p className="text-white/80 text-left text-base">Loading related products...</p>
            ) : relatedProducts.length === 0 ? (
              <p className="text-white/80 text-left text-base">No related products found.</p>
            ) : (
              <div className="related-grid">
                <AnimatePresence>
                  {relatedProducts.slice(0, 8).map((relatedProduct) => (
                    <motion.div
                      key={relatedProduct._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="related-card relative rounded-lg border border-white/20 overflow-hidden shadow-2xl shadow-transparent hover:shadow-cyan-700 hover:scale-97 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    >
                      <div className="textured-bg" />
                      <div
                        className="w-full h-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${relatedProduct.pictures[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-3">
                          <h4 className="text-base font-extrabold text-white">{relatedProduct.name}</h4>
                          <p className="text-white/80 text-sm">${relatedProduct.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;