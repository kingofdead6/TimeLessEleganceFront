import React from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ShopLocation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const storeLocation = {
    lat: 40.7128,
    lng: -74.0060,
    name: "Timeless Elegance Boutique",
    address: "123 Elegance Street, New York, NY 10001",
    hours: "Sat-Thu: 10 AM - 8 PM, Fridat: 4 PM - 8 PM",
  };

  return (
    <section className="py-20 px-6 sm:px-10 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative bg-black/75 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-cyan-900/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png')] bg-cover bg-center opacity-12 z-0" />
          <div className="absolute w-6 h-6 bg-cyan-400/40 rounded-full top-[12%] left-[22%] blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
          <div className="absolute w-6 h-6 bg-purple-400/40 rounded-full top-[78%] left-[68%] blur-xl animate-[pulse_3s_ease-in-out_infinite_0.7s]" />
          <div className="absolute w-6 h-6 bg-pink-400/40 rounded-full top-[58%] left-[38%] blur-xl animate-[pulse_3s_ease-in-out_infinite_1.4s]" />
          <style>
            {`
              .constellation {
                position: absolute;
                inset: 0;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(34, 211, 238, 0.25)' stroke-width='2' d='M0,160 L360,120 L720,180 L1080,140 L1440,160'/%3E%3Ccircle cx='360' cy='120' r='4' fill='rgba(34, 211, 238, 0.5)'/%3E%3Ccircle cx='720' cy='180' r='4' fill='rgba(139, 92, 246, 0.5)'/%3E%3Ccircle cx='1080' cy='140' r='4' fill='rgba(236, 72, 153, 0.5)'/%3E%3C/svg%3E");
                opacity: 0.4;
                background-size: 200%;
                animation: constellationGlow 10s linear infinite;
                pointer-events: none;
              }
              @keyframes constellationGlow {
                0% { background-position: 0 0; }
                100% { background-position: 200% 0; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.6); }
              }
              @media (max-width: 640px) {
                .leaflet-container {
                  height: 300px;
                }
                p, h1, h2 {
                  font-size: 0.95rem;
                }
                .text-4xl {
                  font-size: 2rem;
                }
              }
            `}
          </style>

          <motion.h1
            variants={contentVariants}
            className="text-4xl sm:text-5xl font-extrabold text-left pb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 mb-6 tracking-wide"
          >
            Visit Timeless Elegance
          </motion.h1>
          <motion.p
            variants={contentVariants}
            className="text-lg sm:text-xl text-white/95 text-left leading-relaxed max-w-2xl mb-10"
          >
            Discover the essence of luxury at our flagship boutique. Step into a world of elegance and explore our curated collections in person.
          </motion.p>

          <motion.div variants={contentVariants} className="relative rounded-2xl overflow-hidden shadow-lg">
            <div className="constellation absolute z-0 rounded-2xl" />
            <MapContainer
              center={[storeLocation.lat, storeLocation.lng]}
              zoom={15}
              style={{ height: "400px", width: "100%", borderRadius: "1rem" }}
              className="z-10"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[storeLocation.lat, storeLocation.lng]}>
                <Popup>
                  <div className="text-gray-800">
                    <h3 className="font-semibold">{storeLocation.name}</h3>
                    <p>{storeLocation.address}</p>
                    <p>{storeLocation.hours}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default ShopLocation;