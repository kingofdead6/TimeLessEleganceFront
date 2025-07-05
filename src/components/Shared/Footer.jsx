import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaFacebook, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [currentText, setCurrentText] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const newsletterTexts = [
    'Join the style revolution',
    'Unlock exclusive offers',
    'Stay ahead with fresh updates'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % newsletterTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!email.trim()) {
      setError('Please enter a valid email');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/newsletters`, { email });
      setSuccess('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setError('Subscription failed. Try again.');
    }
  };

  return (
    <footer className="relative bg-gray-900 text-white pt-12 pb-8 overflow-hidden rounded-t-4xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2)_0%,_rgba(59,130,246,0)_70%)] animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Left: Title and Description */}
          <div className="md:col-span-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6 pb-2"
            >
              Timeless Elegance
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white text-xl max-w-sm "
            >
              Empowering your style with cutting-edge designs and exclusive updates. Join us to stay ahead of the curve.
            </motion.p>
          </div>
          {/* Top Right: NewsLetter form*/ }
          <div className="md:col-span-1 mt-10">
            <AnimatePresence mode="wait">
              <motion.h3
                key={newsletterTexts[currentText]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold text-blue-400 mb-4"
              >
                {newsletterTexts[currentText]}
              </motion.h3>
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="relative flex items-center mb-6 ">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-lg px-5 py-3 rounded-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer absolute right-2 p-2 bg-blue-500 rounded-full text-black hover:bg-blue-400 transition-colors"
              >
                <FaArrowRight />
              </motion.button>
            </form>
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 mb-4 text-sm"
              >
                {success}
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 mb-4 text-sm"
              >
                {error}
              </motion.p>
            )}
            
          </div>
        </div>
        {/* Seperating line*/}
        <div className='border-1 my-10 '/>          

        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/*Social Media Links */}
            <div className="md:col-span-1">
                    <h3 className="text-3xl font-semibold text-blue-400 mb-4">Get in Touch</h3>
                    <div className="flex space-x-4 mb-4">
                      {[
                        { icon: FaLinkedin, href: 'https://linkedin.com' },
                        { icon: FaInstagram, href: 'https://instagram.com' },
                        { icon: FaFacebook, href: 'https://facebook.com' },
                      ].map((social, index) => (
                        <motion.a
                          key={social.href}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="text-2xl hover:text-blue-300 transition-colors"
                        >
                          <social.icon />
                        </motion.a>
                      ))}
                    </div>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-sm text-gray-400 "
                    >
                      <a href="mailto:contact@yourbrand.com" className="hover:text-blue-300 transition-colors">
                        contact@yourbrand.com
                      </a>
                    </motion.p>
            </div>
            {/*Pages Links */}
            <div className="flex">
  <ul className="flex flex-row space-x-4 text-sm ml-0 md:ml-70">
    {['Home', 'About Us', 'Contact Us' , 'Service Terms'].map((item, index) => (
      <motion.li
        key={item}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
          to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
          className="hover:text-blue-300 transition-colors"
        >
          {item}
        </Link>
      </motion.li>
    ))}
  </ul>
</div>

        </div>
        {/* Seperating line*/}
        <div className='border-1 mt-10 '/>  
        {/* Bottom: All Rights Reserved */}
        <div className="pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} TimeLess Elegance. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;