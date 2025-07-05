import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname, location.search]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950/50 via-cyan-900/50 to-purple-950/50 backdrop-blur-2xl">
      <div className="container mx-auto px-6 sm:px-8 py-12 text-white/90">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-8 text-center">
          Terms of Service
        </h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">1. Acceptance of Terms</h2>
            <p className="text-white/80 text-center">
              By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">2. Eligibility</h2>
            <p className="text-white/80 text-center">
              You must be at least 18 years old or the age of majority in your jurisdiction to make purchases on this site.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">3. Product Information</h2>
            <p className="text-white/80 text-center">
              We strive to ensure all product descriptions, prices, and images are accurate, but we do not warrant that they are error-free, complete, or current.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">4. Orders and Payment</h2>
            <p className="text-white/80 text-center">
              We reserve the right to refuse or cancel any order at any time. All payments must be made through the provided payment gateways.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">5. Shipping and Delivery</h2>
            <p className="text-white/80 text-center">
              Estimated delivery times are provided for convenience and are not guaranteed. We are not responsible for delays caused by carriers or customs.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">6. Returns and Refunds</h2>
            <p className="text-white/80 text-center">
              You may return eligible products within 1 day of delivery. Refunds will be processed to your original method of payment.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">7. User Accounts</h2>
            <p className="text-white/80 text-center">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">8. Intellectual Property</h2>
            <p className="text-white/80 text-center">
              All content on this website—including text, images, logos, and designs—is the property of Timeless Elegance and may not be used without permission.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 text-center">9. Limitation of Liability</h2>
            <p className="text-white/80 text-center">
              We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or products.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 shadow-lg text-center">
            <p className="text-white/80">
              For any questions about these Terms of Service, please{' '}
              <Link to="/contact-us" className="text-cyan-300 hover:text-cyan-400 underline">
                contact us
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
