import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white px-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="text-center relative z-10 max-w-xl">
        
        {/* 404 Big Text */}
        <h1 className="text-[120px] md:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 leading-none">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn’t exist or has been moved.  
          Let’s get you back to something useful.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold"
          >
            Go Home
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 border border-gray-700 hover:border-blue-500 rounded-lg transition"
          >
            Contact Support
          </Link>

        </div>

      </div>
    </section>
  );
};

export default NotFound;