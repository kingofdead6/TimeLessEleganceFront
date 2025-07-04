import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaSearch, FaCalendar, FaFilter, FaDownload } from "react-icons/fa";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryPrices, setDeliveryPrices] = useState({ desk: {}, address: {} });
  const [isPricePopupOpen, setIsPricePopupOpen] = useState(false);
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPrices, setNewPrices] = useState({ desk: {}, address: {} });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", 
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", 
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", 
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", 
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", 
    "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", 
    "Relizane"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as admin", { position: "top-right", autoClose: 3000 });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const [ordersResponse, pricesResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/orders/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/delivery-prices`),
          axios.get(`${API_BASE_URL}/api/products/categories`)
        ]);
        setOrders(ordersResponse.data.orders);
        setFilteredOrders(ordersResponse.data.orders);
        setDeliveryPrices(pricesResponse.data.prices);
        setNewPrices(pricesResponse.data.prices);
        setCategories(categoriesResponse.data.categories);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load data", {
          position: "top-right",
          autoClose: 3000,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryFilter) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/products/subcategories?category=${categoryFilter}`);
          setSubcategories(response.data.subcategories);
        } catch (err) {
          toast.error("Failed to load subcategories", { position: "top-right", autoClose: 3000 });
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [categoryFilter]);

  useEffect(() => {
    let filtered = [...orders];

    // Search by customer name
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.user_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === "today") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter((order) => new Date(order.createdAt) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter((order) => new Date(order.createdAt) >= monthAgo);
    }

    // Filter by category and subcategory
    if (categoryFilter) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.product_id?.category === categoryFilter)
      );
    }
    if (subcategoryFilter) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.product_id?.subcategory === subcategoryFilter)
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, dateFilter, categoryFilter, subcategoryFilter, orders]);

  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");
    try {
  const response = await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map((order) => 
        order._id === orderId ? { ...order, status } : order
      ));
      setFilteredOrders(filteredOrders.map((order) => 
        order._id === orderId ? { ...order, status } : order
      ));
      toast.success(`Order ${status} successfully!`, { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateDeliveryPrices = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/api/delivery-prices`,
        { prices: newPrices },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeliveryPrices(newPrices);
      setIsPricePopupOpen(false);
      toast.success("Delivery prices updated successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update delivery prices", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const downloadOrdersExcel = (period) => {
    let filtered = [...orders];
    const now = new Date();

    if (period === "today") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (period === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter((order) => new Date(order.createdAt) >= weekAgo);
    } else if (period === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter((order) => new Date(order.createdAt) >= monthAgo);
    }

    const data = filtered.map((order) => ({
      "Order ID": order._id,
      "Customer Name": order.user_id ? order.user_id.name : "Deleted User", // Display "Deleted User" if user_id is null
      "Customer Email": order.user_id ? order.user_id.email : "Deleted User", // Display "Deleted User" if user_id is null
      "Customer Phone": order.user_id ? order.user_id.phone_number : "Deleted User", // Display "Deleted User" if user_id is null
      "Wilaya": order.wilaya,
      "Address": order.address || "N/A",
      "Status": order.charset="UTF-8".status,
      "Subtotal": `$${order.subtotal}`,
      "Delivery Cost": `$${(order.total - order.subtotal).toFixed(2)}`,
      "Total": `$${order.total}`,
      "Delivery Method": order.deliveryMethod,
      "Items": order.items
        .map((item) => `${item.product_id?.name} (Qty: ${item.quantity}, Size: ${item.size}, Category: ${item.product_id?.category}, Subcategory: ${item.product_id?.subcategory})`)
        .join("; "),
      "Order Date": new Date(order.createdAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Orders_${period}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const openOrderPopup = (order) => {
    setSelectedOrder(order);
    setIsOrderPopupOpen(true);
  };

  return (
    <div className="min-h-screen -mt-10 py-6 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer />
      <style>{`
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
        .search-input {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
ly: 0.875rem;
        }
        .filter-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          width: 100%;
          font-size: 0.875rem;
        }
        @media (max-width: 640px) {
          .search-input, .filter-select {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
          .popup-content {
            width: 95%;
            padding: 1rem;
          }
          .order-card {
            padding: 0.75rem;
          }
          .order-card h3 {
            font-size: 1.125rem;
          }
          .order-card p {
            font-size: 0.75rem;
          }
          .action-button {
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
          }
          .download-button {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
          .popup-content h3 {
            font-size: 1.25rem;
          }
          .popup-content h4 {
            font-size: 1rem;
          }
          .popup-content p {
            font-size: 0.75rem;
          }
        }
      `}</style>
      <div className="textured-bg" />
      <div className="max-w-7xl mx-auto relative z-10 min-w-sm -ml-10 md:ml-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-black/50 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide">Manage Orders</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPricePopupOpen(true)}
                className="action-button cursor-pointer px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
              >
                Set Delivery Prices
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadOrdersExcel("all")}
                className="action-button cursor-pointer px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm sm:text-base"
              >
                <FaDownload /> Download All
              </motion.button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by customer name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-10"
              />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter("");
              }}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="filter-select"
              disabled={!categoryFilter}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadOrdersExcel("today")}
              className="download-button cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
            >
              <FaDownload /> Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadOrdersExcel("week")}
              className="download-button cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
            >
              <FaDownload /> This Week
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadOrdersExcel("month")}
              className="download-button cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
            >
              <FaDownload /> This Month
            </motion.button>
          </div>

          {loading ? (
            <p className="text-white/80 text-center text-base sm:text-lg">Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-white/80 text-center text-base sm:text-lg">No orders found.</p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="order-card bg-black/30 border border-white/20 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-black/40"
                    onClick={() => openOrderPopup(order)}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white">Order #{order._id}</h3>
                    <p className="text-white/80 text-sm sm:text-base">Customer: {order.user_id ? order.user_id.name : "Deleted User"}</p> {/* Display "Deleted User" if user_id is null */}
                    <p className="text-white/80 text-sm sm:text-base">Status: {order.status}</p>
                    <p className="text-white/80 text-sm sm:text-base">Total: ${order.total}</p>
                    <p className="text-white/80 text-sm sm:text-base">Wilaya: {order.wilaya}</p>
                    <p className="text-white/80 text-sm sm:text-base">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                      {order.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order._id, "confirmed");
                          }}
                          className="action-button cursor-pointer px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                        >
                          Confirm
                        </motion.button>
                      )}
                      {order.status === "confirmed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order._id, "completed");
                          }}
                          className="action-button cursor-pointer px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
                        >
                          Mark as Completed
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Popup */}
      <AnimatePresence>
        {isOrderPopupOpen && selectedOrder && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-0"
          >
            <div className="popup-content bg-black/80 p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Order #{selectedOrder._id}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">Customer Details</h4>
                  <p className="text-white/80 text-sm sm:text-base">Name: {selectedOrder.user_id ? selectedOrder.user_id.name : "Deleted User"}</p> {/* Display "Deleted User" if user_id is null */}
                  <p className="text-white/80 text-sm sm:text-base">Email: {selectedOrder.user_id ? selectedOrder.user_id.email : "Deleted User"}</p> {/* Display "Deleted User" if user_id is null */}
                  <p className="text-white/80 text-sm sm:text-base">Phone: {selectedOrder.user_id ? selectedOrder.user_id.phone_number : "Deleted User"}</p> {/* Display "Deleted User" if user_id is null */}
                  <p className="text-white/80 text-sm sm:text-base">Wilaya: {selectedOrder.wilaya}</p>
                  {selectedOrder.address && <p className="text-white/80 text-sm sm:text-base">Address: {selectedOrder.address}</p>}
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">Order Details</h4>
                  <p className="text-white/80 text-sm sm:text-base">Status: {selectedOrder.status}</p>
                  <p className="text-white/80 text-sm sm:text-base">Subtotal: ${selectedOrder.subtotal}</p>
                  <p className="text-white/80 text-sm sm:text-base">Delivery Cost: ${(selectedOrder.total - selectedOrder.subtotal).toFixed(2)}</p>
                  <p className="text-white/80 text-sm sm:text-base">Total: ${selectedOrder.total}</p>
                  <p className="text-white/80 text-sm sm:text-base">Delivery Method: {selectedOrder.deliveryMethod}</p>
                  <p className="text-white/80 text-sm sm:text-base">Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">Items</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-2 mb-2">
                      <img
                        src={item.product_id?.pictures?.[0] || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"}
                        alt={item.product_id?.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-white/80 text-sm sm:text-base">{item.product_id?.name}</p>
                        <p className="text-white/80 text-sm sm:text-base">Category: {item.product_id?.category}</p>
                        <p className="text-white/80 text-sm sm:text-base">Subcategory: {item.product_id?.subcategory}</p>
                        <p className="text-white/80 text-sm sm:text-base">Qty: {item.quantity}, Size: {item.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOrderPopupOpen(false)}
                  className="action-button cursor-pointer px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delivery Prices Popup */}
      <AnimatePresence>
        {isPricePopupOpen && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-0"
          >
            <div className="popup-content bg-black/80 p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Set Delivery Prices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Desk Delivery</h4>
                  {wilayas.map((wilaya) => (
                    <div key={`desk-${wilaya}`} className="mb-2">
                      <label className="text-white/80 block text-sm sm:text-base">{wilaya}</label>
                      <input
                        type="number"
                        value={newPrices.desk[wilaya] || newPrices.desk.default || ""}
                        onChange={(e) => setNewPrices({
                          ...newPrices,
                          desk: { ...newPrices.desk, [wilaya]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm sm:text-base"
                        placeholder="Enter price"
                      />
                    </div>
                  ))}
                  <div className="mb-2">
                    <label className="text-white/80 block text-sm sm:text-base">Default</label>
                    <input
                      type="number"
                      value={newPrices.desk.default || ""}
                      onChange={(e) => setNewPrices({
                        ...newPrices,
                        desk: { ...newPrices.desk, default: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm sm:text-base"
                      placeholder="Enter default price"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Address Delivery</h4>
                  {wilayas.map((wilaya) => (
                    <div key={`address-${wilaya}`} className="mb-2">
                      <label className="text-white/80 block text-sm sm:text-base">{wilaya}</label>
                      <input
                        type="number"
                        value={newPrices.address[wilaya] || newPrices.address.default || ""}
                        onChange={(e) => setNewPrices({
                          ...newPrices,
                          address: { ...newPrices.address, [wilaya]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm sm:text-base"
                        placeholder="Enter price"
                      />
                    </div>
                  ))}
                  <div className="mb-2">
                    <label className="text-white/80 block text-sm sm:text-base">Default</label>
                    <input
                      type="number"
                      value={newPrices.address.default || ""}
                      onChange={(e) => setNewPrices({
                        ...newPrices,
                        address: { ...newPrices.address, default: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm sm:text-base"
                      placeholder="Enter default price"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateDeliveryPrices}
                  className="action-button cursor-pointer px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                >
                  Save Prices
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPricePopupOpen(false)}
                  className="action-button cursor-pointer px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersPage;