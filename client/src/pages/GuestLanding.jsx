import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // For smooth animations

const GuestLanding = () => {
  // Animation variants for a more dynamic entrance
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-232 flex flex-col items-center justify-center px-6 py-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans relative overflow-hidden"

      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background blobs/shapes for modern feel */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>


      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 text-center leading-tight tracking-tight text-blue-800 drop-shadow-sm"
        variants={itemVariants}
      >
        Unlock Your Potential with AI Interview Pro
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-center mb-10 max-w-2xl text-gray-600 leading-relaxed"
        variants={itemVariants}
      >
        Revolutionize your interview preparation. Practice in **real-time** with advanced AI, receive **instant, personalized feedback**, and master your communication skills to ace your next opportunity.
      </motion.p>

      <motion.div className="flex flex-col sm:flex-row gap-5" variants={itemVariants}>
        <Link
          to="/login"
          className="px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        >
          Get Started
        </Link>
        <Link
          to="/signup"
          className="px-8 py-3 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 ease-in-out shadow-md transform hover:scale-105 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        >
          Learn More
        </Link>
      </motion.div>

      <motion.div
        className="mt-20 text-sm text-gray-500 flex items-center space-x-1"
        variants={itemVariants}
      >
        <span>Built with</span>
        <span className="text-red-500 text-xl animate-pulse">❤️</span>
        <span>for aspiring professionals.</span>
      </motion.div>
    </motion.div>
  );
};

export default GuestLanding;