import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../../../api";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.6, 0.01, 0.2, 1] },
    },
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/offers`, {
          params: { limit: 4 },
        });
        setOffers(response.data.offers);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load offers", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Slider settings for carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    centerMode: false,
    slidesPerRow: 1,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          slidesPerRow: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen py-20 px-0 text-white relative overflow-hidden ">
      <ToastContainer />
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhu2uyrwx/image/upload/v1751467890/noise-texture.png')] bg-cover bg-center opacity-12 z-0" />
      <div className="absolute w-8 h-8 bg-cyan-400/40 rounded-full top-[15%] left-[25%] blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute w-8 h-8 bg-purple-400/40 rounded-full top-[75%] left-[65%] blur-xl animate-[pulse_3s_ease-in-out_infinite_0.7s]" />
      <div className="absolute w-8 h-8 bg-pink-400/40 rounded-full top-[55%] left-[35%] blur-xl animate-[pulse_3s_ease-in-out_infinite_1.4s]" />
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.6); }
          }
          .carousel-container {
            width: 100vw;
            margin: 0;
            padding: 0;
          }
          .offer-card {
            height: 500px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.15);
            width: 57vw !important;
            background: rgba(0, 0, 0, 0.7);
            clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
          }
          .offer-card .image-layer {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            z-index: 0;
            transition: transform 0.3s ease;
            transform-origin: center;
            clip-path: inherit;
          }
          .offer-card:hover .image-layer {
            transform: scale(1.05);
          }
          .offer-card .content {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
            padding: 2rem;
            z-index: 10;
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .offer-card .orbit {
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(34, 211, 238, 0.25)' stroke-width='2' d='M0,160 C320,100 640,100 960,160 C1280,220 1440,220 1440,220'/%3E%3Ccircle cx='360' cy='120' r='4' fill='rgba(34, 211, 238, 0.5)'/%3E%3Ccircle cx='720' cy='180' r='4' fill='rgba(139, 92, 246, 0.5)'/%3E%3Ccircle cx='1080' cy='140' r='4' fill='rgba(236, 72, 153, 0.5)'/%3E%3C/svg%3E");
            opacity: 0.4;
            background-size: 200%;
            animation: orbitFlow 8s linear infinite;
            pointer-events: none;
            clip-path: inherit;
          }
          .offer-card .star {
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(34, 211, 238, 0.8);
            border-radius: 50%;
            opacity: 0.6;
            animation: twinkle 3s ease-in-out infinite;
          }
          .offer-card .star:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
          .offer-card .star:nth-child(2) { top: 60%; left: 85%; animation-delay: 0.8s; }
          .offer-card .star:nth-child(3) { top: 40%; left: 30%; animation-delay: 1.6s; }
          @keyframes orbitFlow {
            0% { background-position: 0 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .slick-prev, .slick-next {
            color: #22d3ee !important;
            z-index: 10;
            width: 40px;
            height: 40px;
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
          .slick-list {
            overflow: visible !important;
          }
          .slick-slide {
            margin: 0 !important;
            padding: 0 !important;
          }
          .slick-track {
            display: flex !important;
          }
          @media (max-width: 768px) {
            .offer-card {
              height: 400px;
              width: 100vw !important;
            }
            .offer-card h2 {
              font-size: 1.5rem;
            }
            .offer-card p {
              font-size: 0.95rem;
            }
          }
        `}
      </style>
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.2, 1] }}
          className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 mb-12 tracking-wide"
        >
          Exclusive Offers
        </motion.h1>
        {loading ? (
          <p className="text-white/80 text-center text-lg">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="text-white/80 text-center text-lg">No offers available at the moment.</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="carousel-container"
          >
            <Slider {...sliderSettings}>
              {offers.map((offer, index) => (
                <div key={offer._id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="offer-card"
                  >
                    <motion.div
                      className="image-layer"
                      style={{
                        backgroundImage: `url(${offer.image || "https://res.cloudinary.com/dhu2uyrwx/image/upload/v1234567890/placeholder.jpg"})`,
                      }}
                    />
                    <div className="content flex flex-col justify-end p-8 text-white">
                      <h2 className="text-2xl sm:text-3xl font-semibold mb-3">{offer.title}</h2>
                      <p className="text-base sm:text-lg">{offer.description}</p>
                    </div>
                    <div className="orbit absolute z-0" />
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Offers;