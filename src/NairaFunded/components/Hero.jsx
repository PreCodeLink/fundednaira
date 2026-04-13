import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className=" pt-16 relative min-h-screen flex items-center justify-center bg-dark text-white px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="relative max-w-5xl text-center">

        {/* Badge */}
        <div className="inline-block px-4 py-2 mb-6 text-sm bg-gray-800 rounded-full border border-gray-700">
          Trusted by Traders Worldwide
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Get Funded Up to{" "}
          <span className="text-primary">N800,000</span>
        </h1>

        {/* Subtext */}
                <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
        Nigeria’s leading Naira-funded prop firm empowering traders to access up to N800,000 in capital. Trade with confidence, get paid in Naira, and keep up to 90% of your profits — no personal risk required.
        </p>
        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          
          <button className="bg-primary px-8 py-3 rounded-xl text-white font-medium hover:opacity-90 transition">
            <Link to='/auth'>
            Buy Account
            </Link>
          </button>

          <button className="border border-gray-600 px-8 py-3 rounded-xl hover:bg-gray-800 transition">
            <Link to='/rules'>
            View Rules
            </Link>
          </button>

        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div>
            <h2 className="text-2xl font-bold">N5M+</h2>
            <p className="text-gray-400 text-sm">Paid Out</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">1K+</h2>
            <p className="text-gray-400 text-sm">Traders</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">80%</h2>
            <p className="text-gray-400 text-sm">Profit Split</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">24/7</h2>
            <p className="text-gray-400 text-sm">Support</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;