import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBox, FaTimes, FaTrash, FaArrowLeft, FaArrowRight, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../../../api";
import Slider from "react-slick";
import { useAuth } from "../auth/authContext";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formCategories, setFormCategories] = useState([]);
  const [formSubcategories, setFormSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: "createdAt",
    order: "desc",
    search: "",
    category: "",
    subcategory: "",
    gender: "",
    age: "",
    season: "",
  });
  const [visibleCount, setVisibleCount] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    gender: "Men",
    age: "Adult",
    pictures: [],
    category: "",
    subcategory: "",
    season: "Both",
    stock: [{ size: "", quantity: 0 }],
    isNewest: false,
    isTrending: false,
  });
  const [editData, setEditData] = useState(null);
  const [removePictures, setRemovePictures] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const newestCount = products.filter((p) => p.isNewest).length;
  const trendingCount = products.filter((p) => p.isTrending).length;

  const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] } },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategories(["", ...response.data.categories]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load category options");
        toast.error("Failed to load category options", { position: "top-right", autoClose: 3000 });
      }
    };

    fetchCategories();
  }, []);
 useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category) {
        setSubcategories([""]);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/subcategories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { category: filters.category },
        });
        setSubcategories(["", ...response.data.subcategories]);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError(err.response?.data?.message || "Failed to load subcategory options");
        toast.error(err.response?.data?.message || "Failed to load subcategory options", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchSubcategories();
  }, [filters.category]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/all-categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormCategories(response.data.categories);
      } catch (err) {
        console.error("Failed to fetch all categories:", err);
        setError("Failed to load form category options");
        toast.error("Failed to load form category options", { position: "top-right", autoClose: 3000 });
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => {
    const fetchFormSubcategories = async () => {
      if (!formData.category) {
        setFormSubcategories([]);
        setFormData((prev) => ({ ...prev, subcategory: "", stock: [{ size: "", quantity: 0 }] }));
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/all-subcategories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { category: formData.category },
        });
        setFormSubcategories(response.data.subcategories);
        setFormData((prev) => ({
          ...prev,
          subcategory: "",
          stock: [{ size: formData.category === "Footwear" ? "" : "XS", quantity: 0 }],
        }));
      } catch (err) {
        console.error("Failed to fetch form subcategories:", err);
        setError(err.response?.data?.message || "Failed to load form subcategory options");
        toast.error(err.response?.data?.message || "Failed to load form subcategory options", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    if (showForm) {
      fetchFormSubcategories();
    }
  }, [formData.category, showForm]);

  useEffect(() => {
    const fetchEditSubcategories = async () => {
      if (!editData?.category) {
        setFormSubcategories([]);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/all-subcategories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { category: editData.category },
        });
        setFormSubcategories(response.data.subcategories);
      } catch (err) {
        console.error("Failed to fetch edit subcategories:", err);
        setError(err.response?.data?.message || "Failed to load edit subcategory options");
        toast.error(err.response?.data?.message || "Failed to load edit subcategory options", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    if (isEditing) {
      fetchEditSubcategories();
    }
  }, [editData?.category, isEditing]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: filters,
        });
        setProducts(response.data.products);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.message === "Admin access required") {
          logout();
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
  }, [filters, navigate, logout]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
    setVisibleCount(10);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subcategory: "", stock: [{ size: value === "Footwear" ? "" : "XS", quantity: 0 }] } : {}),
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subcategory: "", stock: [{ size: value === "Footwear" ? "" : "XS", quantity: 0 }] } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, pictures: files }));
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditData((prev) => ({ ...prev, newPictures: files }));
  };

  const handleStockChange = (index, field, value) => {
    const newStock = [...formData.stock];
    newStock[index][field] = value;
    setFormData((prev) => ({ ...prev, stock: newStock }));
  };

  const handleEditStockChange = (index, field, value) => {
    const newStock = [...editData.stock];
    newStock[index][field] = value;
    setEditData((prev) => ({ ...prev, stock: newStock }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append("season", formData.season);
      formDataToSend.append("stock", JSON.stringify(formData.stock));
      formDataToSend.append("isNewest", formData.isNewest);
      formDataToSend.append("isTrending", formData.isTrending);
      formData.pictures.forEach((file) => formDataToSend.append("pictures", file));

      await axios.post(`${API_BASE_URL}/api/products`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowForm(false);
      setFormData({
        name: "",
        price: "",
        description: "",
        gender: "Men",
        age: "Adult",
        pictures: [],
        category: "",
        subcategory: "",
        season: "Both",
        stock: [{ size: "", quantity: 0 }],
        isNewest: false,
        isTrending: false,
      });
      setFilters((prev) => ({ ...prev }));
      toast.success("Product created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
      toast.error(err.response?.data?.message || "Failed to create product", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", editData.name);
      formDataToSend.append("price", editData.price);
      formDataToSend.append("description", editData.description);
      formDataToSend.append("gender", editData.gender);
      formDataToSend.append("age", editData.age);
      formDataToSend.append("category", editData.category);
      formDataToSend.append("subcategory", editData.subcategory);
      formDataToSend.append("season", editData.season);
      formDataToSend.append("stock", JSON.stringify(editData.stock));
      formDataToSend.append("existingPictures", JSON.stringify(editData.pictures));
      formDataToSend.append("removePictures", JSON.stringify(removePictures));
      formDataToSend.append("isNewest", editData.isNewest);
      formDataToSend.append("isTrending", editData.isTrending);
      if (editData.newPictures) {
        editData.newPictures.forEach((file) => formDataToSend.append("pictures", file));
      }

      await axios.put(`${API_BASE_URL}/api/products/${editData._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditing(false);
      setSelectedProduct(null);
      setRemovePictures([]);
      setFilters((prev) => ({ ...prev }));
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
      toast.error(err.response?.data?.message || "Failed to update product", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleNewest = async (id, currentStatus) => {
    try {
      const product = products.find((p) => p._id === id);
      const formDataToSend = new FormData();
      formDataToSend.append("name", product.name);
      formDataToSend.append("price", product.price);
      formDataToSend.append("description", product.description);
      formDataToSend.append("gender", product.gender);
      formDataToSend.append("age", product.age);
      formDataToSend.append("category", product.category);
      formDataToSend.append("subcategory", product.subcategory);
      formDataToSend.append("season", product.season);
      formDataToSend.append("stock", JSON.stringify(product.stock));
      formDataToSend.append("existingPictures", JSON.stringify(product.pictures));
      formDataToSend.append("isNewest", !currentStatus);
      formDataToSend.append("isTrending", product.isTrending);

      await axios.put(`${API_BASE_URL}/api/products/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts(products.map((p) => (p._id === id ? { ...p, isNewest: !currentStatus } : p)));
      toast.success(`Product ${!currentStatus ? "marked" : "unmarked"} as Newest!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const toggleTrending = async (id, currentStatus) => {
    try {
      const product = products.find((p) => p._id === id);
      const formDataToSend = new FormData();
      formDataToSend.append("name", product.name);
      formDataToSend.append("price", product.price);
      formDataToSend.append("description", product.description);
      formDataToSend.append("gender", product.gender);
      formDataToSend.append("age", product.age);
      formDataToSend.append("category", product.category);
      formDataToSend.append("subcategory", product.subcategory);
      formDataToSend.append("season", product.season);
      formDataToSend.append("stock", JSON.stringify(product.stock));
      formDataToSend.append("existingPictures", JSON.stringify(product.pictures));
      formDataToSend.append("isNewest", product.isNewest);
      formDataToSend.append("isTrending", !currentStatus);

      await axios.put(`${API_BASE_URL}/api/products/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts(products.map((p) => (p._id === id ? { ...p, isTrending: !currentStatus } : p)));
      toast.success(`Product ${!currentStatus ? "marked" : "unmarked"} as Most Trending!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (selectedProducts.length === 0 && !selectedProduct) {
      toast.error("No products selected for deletion", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (selectedProducts.length > 0 && !window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected product(s)?`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      if (selectedProducts.length > 0) {
        const deletePromises = selectedProducts.map((id) =>
          axios.delete(`${API_BASE_URL}/api/products/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
        );
        await Promise.all(deletePromises);
        setSelectedProducts([]);
        setFilters((prev) => ({ ...prev }));
        toast.success("Selected products deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (selectedProduct) {
        await axios.delete(`${API_BASE_URL}/api/products/${selectedProduct._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSelectedProduct(null);
        setSelectedIndex(null);
        setFilters((prev) => ({ ...prev }));
        toast.success("Product deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product(s)");
      toast.error(err.response?.data?.message || "Failed to delete product(s)", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleProductClick = (product, index) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
    setEditData({ ...product, newPictures: [] });
    setRemovePictures([]);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handlePrevProduct = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedProduct(products[newIndex]);
      setSelectedIndex(newIndex);
      setEditData({ ...products[newIndex], newPictures: [] });
      setRemovePictures([]);
    }
  };

  const handleNextProduct = () => {
    if (selectedIndex < products.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedProduct(products[newIndex]);
      setSelectedIndex(newIndex);
      setEditData({ ...products[newIndex], newPictures: [] });
      setRemovePictures([]);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedIndex(null);
    setIsEditing(false);
    setRemovePictures([]);
  };

  const showMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const showLess = () => {
    setVisibleCount((prev) => Math.max(10, prev - 10));
  };

  const addStockField = () => {
    setFormData((prev) => ({
      ...prev,
      stock: [...prev.stock, { size: formData.category === "Footwear" ? "" : "XS", quantity: 0 }],
    }));
  };

  const addEditStockField = () => {
    setEditData((prev) => ({
      ...prev,
      stock: [...prev.stock, { size: editData.category === "Footwear" ? "" : "XS", quantity: 0 }],
    }));
  };

  const removeStockField = (index) => {
    setFormData((prev) => ({
      ...prev,
      stock: prev.stock.filter((_, i) => i !== index),
    }));
  };

  const removeEditStockField = (index) => {
    setEditData((prev) => ({
      ...prev,
      stock: prev.stock.filter((_, i) => i !== index),
    }));
  };

  const toggleRemovePicture = (picture) => {
    setRemovePictures((prev) =>
      prev.includes(picture) ? prev.filter((p) => p !== picture) : [...prev, picture]
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: selectedProduct?.pictures.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="min-h-screen  px-4 sm:px-6 lg:px-8 relative min-w-sm -ml-6 sm:ml-0">
      <ToastContainer />
      <style>{`
        .wave-bg {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(34, 211, 238, 0.2)' stroke-width='2' d='M0,160 C320,100 640,100 960,160 C1280,220 1440,220 1440,220'/%3E%3Ccircle cx='360' cy='120' r='4' fill='rgba(34, 211, 238, 0.5)'/%3E%3Ccircle cx='720' cy='180' r='4' fill='rgba(139, 92, 246, 0.5)'/%3E%3Ccircle cx='1080' cy='140' r='4' fill='rgba(236, 72, 153, 0.5)'/%3E%3C/svg%3E");
          opacity: 0.3;
          background-size: 200%;
          animation: moveWave 8s linear infinite;
          pointer-events: none;
        }
        @keyframes moveWave {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
        .form-container {
          max-height: 80vh;
          overflow-y: auto;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }
        .product-card {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: scale(1.05);
        }
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        .input-field, .select-field {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
          .input-field {
          color: #000000 ;
          }
          .select-field {
          color: #000000
          }
        .input-field:focus, .select-field:focus {
          border-color: transparent;
          outline: none;
          ring: 2px solid #38f6fc;
          box-shadow: 0 0 10px rgba(56, 246, 252, 0.5);
        }
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .nav-button {
          background: linear-gradient(45deg, #38f6fc, #007bff);
          border: 1px solid rgba(56, 246, 252, 0.5);
          box-shadow: 0 0 15px rgba(56, 246, 252, 0.4);
          transition: all 0.3s ease;
          border-radius: 9999px;
        }
        .nav-button:hover {
          box-shadow: 0 0 25px rgba(56, 246, 252, 0.7);
          transform: scale(1.05);
        }
        .nav-button:disabled {
          background: linear-gradient(45deg, #4b5e6e, #3b4b5a);
          cursor: not-allowed;
          box-shadow: none;
        }
        .delete-button {
          background: linear-gradient(45deg, #ff3b3b, #b91c1c);
          border: 1px solid rgba(255, 99, 99, 0.5);
          box-shadow: 0 0 15px rgba(255, 99, 99, 0.4);
        }
        .delete-button:hover {
          box-shadow: 0 0 25px rgba(255, 99, 99, 0.7);
          transform: scale(1.05);
        }
        .delete-button:disabled {
          background: linear-gradient(45deg, #4b5e6e, #3b4b5a);
          cursor: not-allowed;
          box-shadow: none;
        }
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
        .slick-prev, .slick-next {
          color: #38f6fc !important;
          z-index: 10;
        }
        .slick-prev:hover, .slick-next:hover {
          color: #00b7eb !important;
        }
        .slick-prev::before, .slick-next::before {
          color: #38f6fc !important;
          font-size: 24px;
        }
        .slick-prev:hover::before, .slick-next:hover::before {
          color: #00b7eb !important;
        }
        .slick-dots li button:before {
          color: #38f6fc !important;
        }
        .slick-dots li.slick-active button:before {
          color: #00b7eb !important;
        }
      `}</style>
      <div className="wave-bg"></div>
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="glow-dot" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-[#0f2027]/50 via-[#203a43]/50 to-[#2c5364]/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <FaBox className="h-8 w-8 text-cyan-300" />
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                Manage Products
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <p className="text-white/90 text-sm font-medium">Newest: {newestCount} | Trending: {trendingCount}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="cursor-pointer px-4 py-2 nav-button text-white rounded-full flex items-center gap-2"
              >
                <FaPlus /> Add Product
              </motion.button>
              <motion.button
                whileHover={{ scale: selectedProducts.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: selectedProducts.length > 0 ? 0.95 : 1 }}
                onClick={handleDelete}
                disabled={selectedProducts.length === 0 || deleteLoading}
                className={`px-4 py-2 rounded-full text-white transition-all duration-300 flex items-center gap-2 ${
                  selectedProducts.length === 0 || deleteLoading
                    ? "nav-button opacity-50 cursor-not-allowed"
                    : "delete-button cursor-pointer"
                }`}
              >
                {deleteLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting
                  </>
                ) : (
                  <>
                    <FaTrash /> Delete Selected ({selectedProducts.length})
                  </>
                )}
              </motion.button>
            </div>
          </div>
          <p className="text-white/90 mb-8 text-lg">Create, view, and manage products.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-md text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Filters */}
          <div className="filter-grid mb-8">
            <input
              type="text"
              name="search"
              placeholder="Search by product name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 input-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-white/50"
            />
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
            <select
              name="order"
              value={filters.order}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="desc">Newest/High to Low</option>
              <option value="asc">Oldest/Low to High</option>
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category || "none"} value={category}>
                  {category || "All Categories"}
                </option>
              ))}
            </select>
            <select
              name="subcategory"
              value={filters.subcategory}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory || "none"} value={subcategory}>
                  {subcategory || "All Subcategories"}
                </option>
              ))}
            </select>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
            <select
              name="age"
              value={filters.age}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="">All Ages</option>
              <option value="Child">Child</option>
              <option value="Teen">Teen</option>
              <option value="Adult">Adult</option>
            </select>
            <select
              name="season"
              value={filters.season}
              onChange={handleFilterChange}
              className="cursor-pointer px-4 py-3 select-field rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="">All Seasons</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Product Creation Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-[#0f2027]/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] }}
                  className="bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg form-container"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                      Add Product
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="cursor-pointer text-white/70 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
                      aria-label="Close form"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-4 text-white/90">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 text-white input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Age</label>
                      <select
                        name="age"
                        value={formData.age}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Child">Child</option>
                        <option value="Teen">Teen</option>
                        <option value="Adult">Adult</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {formCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Subcategory</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                        required
                      >
                        <option value="" disabled>Select a subcategory</option>
                        {formSubcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Season</label>
                      <select
                        name="season"
                        value={formData.season}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Winter">Winter</option>
                        <option value="Summer">Summer</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Pictures</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 text-white/90"
                      />
                      {formData.pictures.length > 0 && (
                        <div className="mt-2 text-sm text-white/70">
                          Selected: {formData.pictures.length} image(s)
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isNewest"
                        checked={formData.isNewest}
                        onChange={handleFormChange}
                        className="w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400"
                      />
                      <label className="ml-2 text-sm font-medium">Mark as Newest ({newestCount})</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleFormChange}
                        className="w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400"
                      />
                      <label className="ml-2 text-sm font-medium">Mark as Most Trending ({trendingCount})</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Stock</label>
                      {formData.stock.map((stock, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                          {formData.category === "Footwear" ? (
                            <input
                              type="text"
                              value={stock.size}
                              onChange={(e) => handleStockChange(index, "size", e.target.value)}
                              placeholder="Enter size (e.g., 7.5, EU 42)"
                              className="w-1/3 px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                              required
                            />
                          ) : (
                            <select
                              value={stock.size}
                              onChange={(e) => handleStockChange(index, "size", e.target.value)}
                              className="w-1/3 px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                            >
                              {clothingSizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="number"
                            value={stock.quantity}
                            onChange={(e) => handleStockChange(index, "quantity", e.target.value)}
                            className="w-1/3 px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                            min="0"
                            required
                          />
                          <button
                            onClick={() => removeStockField(index)}
                            className="cursor-pointer w-1/3 px-2 py-2 delete-button text-white rounded-full"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addStockField}
                        className="cursor-pointer mt-2 px-4 py-2 nav-button text-white rounded-full"
                      >
                        Add Size
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`mt-6 w-full px-4 py-2 nav-button text-white rounded-full flex items-center justify-center ${
                        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating
                        </>
                      ) : (
                        "Create Product"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Cards */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg"
            >
              Loading...
            </motion.div>
          ) : products.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/90 text-lg"
            >
              No products found
            </motion.p>
          ) : (
            <div className="product-grid mb-10">
              <AnimatePresence>
                {products.slice(0, visibleCount).map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="product-card bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg shadow-cyan-400 hover:shadow-2xl hover:shadow-blue-400  transform duration-300 p-4 relative"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="absolute top-2 right-2 h-5 w-5 cursor-pointer text-cyan-400 border-white/20 focus:ring-cyan-400"
                    />
                    <img
                      src={product.pictures[0] || "https://via.placeholder.com/200"}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-4 border-2 border-cyan-400/50"
                      onClick={() => handleProductClick(product, index)}
                    />
                    <h3 className="text-lg font-semibold text-white/90">{product.name}</h3>
                    <p className="text-white/70">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleNewest(product._id, product.isNewest)}
                        className={`px-2 py-1 rounded-md text-sm transition-all duration-300 cursor-pointer ${
                          product.isNewest
                            ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {product.isNewest ? "Newest" : "Mark Newest"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTrending(product._id, product.isTrending)}
                        className={`px-2 py-1 rounded-md text-sm transition-all duration-300 cursor-pointer ${
                          product.isTrending
                            ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {product.isTrending ? "Trending" : "Mark Trending"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Show More/Less Buttons */}
          <div className="flex justify-center gap-4">
            {visibleCount < products.length && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showMore}
                className="cursor-pointer px-4 py-2 nav-button text-white rounded-full"
              >
                Show More
              </motion.button>
            )}
            {visibleCount > 10 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showLess}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-900"
              >
                Show Less
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Product Details Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0f2027]/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] }}
                className="bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-2xl form-container relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                    {isEditing ? "Edit Product" : "Product Details"}
                  </h3>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer px-4 py-2 nav-button text-white rounded-full"
                      >
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className={`px-4 py-2 rounded-full text-white transition-all duration-300 ${
                        deleteLoading
                          ? "nav-button opacity-50 cursor-not-allowed"
                          : "delete-button cursor-pointer"
                      }`}
                    >
                      {deleteLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting
                        </>
                      ) : (
                        "Delete"
                      )}
                    </motion.button>
                    <button
                      onClick={closeModal}
                      className="cursor-pointer text-white/70 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
                      aria-label="Close modal"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4 text-white/90">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Description</label>
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Gender</label>
                      <select
                        name="gender"
                        value={editData.gender}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Age</label>
                      <select
                        name="age"
                        value={editData.age}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Child">Child</option>
                        <option value="Teen">Teen</option>
                        <option value="Adult">Adult</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Category</label>
                      <select
                        name="category"
                        value={editData.category}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {formCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Subcategory</label>
                      <select
                        name="subcategory"
                        value={editData.subcategory}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                        required
                      >
                        <option value="" disabled>Select a subcategory</option>
                        {formSubcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Season</label>
                      <select
                        name="season"
                        value={editData.season}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="Winter">Winter</option>
                        <option value="Summer">Summer</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Existing Pictures</label>
                      <div className="grid grid-cols-2 gap-2">
                        {editData.pictures.map((picture, index) => (
                          <div key={index} className="relative">
                            <img
                              src={picture}
                              alt={`Product ${index}`}
                              className="w-full h-24 object-cover rounded-md border-2 border-cyan-400/50"
                            />
                            <button
                              onClick={() => toggleRemovePicture(picture)}
                              className={`absolute top-1 right-1 p-1 rounded-full ${
                                removePictures.includes(picture)
                                  ? "bg-red-600 text-white"
                                  : "bg-white/10 text-white/70"
                              }`}
                            >
                              {removePictures.includes(picture) ? (
                                <FaEyeSlash className="h-4 w-4" />
                              ) : (
                                <FaEye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Add New Pictures</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="w-full px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 text-white/90"
                      />
                      {editData.newPictures?.length > 0 && (
                        <div className="mt-2 text-sm text-white/70">
                          Selected: {editData.newPictures.length} new image(s)
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isNewest"
                        checked={editData.isNewest}
                        onChange={handleEditChange}
                        className="w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400"
                      />
                      <label className="ml-2 text-sm font-medium">Mark as Newest ({newestCount})</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isTrending"
                        checked={editData.isTrending}
                        onChange={handleEditChange}
                        className="w-5 h-5 text-cyan-400 border-white/20 rounded focus:ring-cyan-400"
                      />
                      <label className="ml-2 text-sm font-medium">Mark as Most Trending ({trendingCount})</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Stock</label>
                      {editData.stock.map((stock, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                          {editData.category === "Footwear" ? (
                            <input
                              type="text"
                              value={stock.size}
                              onChange={(e) => handleEditStockChange(index, "size", e.target.value)}
                              placeholder="Enter size (e.g., 7.5, EU 42)"
                              className="w-1/3 px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                              required
                            />
                          ) : (
                            <select
                              value={stock.size}
                              onChange={(e) => handleEditStockChange(index, "size", e.target.value)}
                              className="w-1/3 px-4 py-2 select-field rounded-md focus:ring-2 focus:ring-cyan-400"
                            >
                              {clothingSizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="number"
                            value={stock.quantity}
                            onChange={(e) => handleEditStockChange(index, "quantity", e.target.value)}
                            className="w-1/3 px-4 py-2 input-field rounded-md focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
                            min="0"
                            required
                          />
                          <button
                            onClick={() => removeEditStockField(index)}
                            className="cursor-pointer w-1/3 px-2 py-2 delete-button text-white rounded-full"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addEditStockField}
                        className="cursor-pointer mt-2 px-4 py-2 nav-button text-white rounded-full"
                      >
                        Add Size
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                      onClick={handleUpdate}
                      disabled={loading}
                      className={`mt-6 w-full px-4 py-2 nav-button text-white rounded-full flex items-center justify-center ${
                        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating
                        </>
                      ) : (
                        "Update Product"
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4 text-white/90">
                    <Slider {...sliderSettings}>
                      {selectedProduct.pictures.map((picture, index) => (
                        <div key={index}>
                          <img
                            src={picture}
                            alt={`Product ${index}`}
                            className="w-full h-64 object-cover rounded-md border-2 border-cyan-400/50"
                          />
                        </div>
                      ))}
                    </Slider>
                    <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                    <p>Price: ${selectedProduct.price.toFixed(2)}</p>
                    <p>Description: {selectedProduct.description || "N/A"}</p>
                    <p>Gender: {selectedProduct.gender}</p>
                    <p>Age: {selectedProduct.age}</p>
                    <p>Category: {selectedProduct.category}</p>
                    <p>Subcategory: {selectedProduct.subcategory}</p>
                    <p>Season: {selectedProduct.season}</p>
                    <p>Newest: {selectedProduct.isNewest ? "Yes" : "No"}</p>
                    <p>Trending: {selectedProduct.isTrending ? "Yes" : "No"}</p>
                    <p>Stock:</p>
                    <ul className="list-disc pl-5">
                      {selectedProduct.stock.map((stock, index) => (
                        <li key={index}>
                          Size: {stock.size}, Quantity: {stock.quantity}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between mt-4">
                      <motion.button
                        whileHover={{ scale: selectedIndex > 0 ? 1.05 : 1 }}
                        whileTap={{ scale: selectedIndex > 0 ? 0.95 : 1 }}
                        onClick={handlePrevProduct}
                        disabled={selectedIndex === 0}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          selectedIndex === 0
                            ? "nav-button opacity-50 cursor-not-allowed"
                            : "nav-button cursor-pointer"
                        }`}
                      >
                        <FaArrowLeft />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: selectedIndex < products.length - 1 ? 1.05 : 1 }}
                        whileTap={{ scale: selectedIndex < products.length - 1 ? 0.95 : 1 }}
                        onClick={handleNextProduct}
                        disabled={selectedIndex === products.length - 1}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          selectedIndex === products.length - 1
                            ? "nav-button opacity-50 cursor-not-allowed"
                            : "nav-button cursor-pointer"
                        }`}
                      >
                        <FaArrowRight />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminProducts;