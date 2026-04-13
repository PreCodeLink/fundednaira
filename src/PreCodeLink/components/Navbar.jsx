import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-gray-800">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition">
          <img
            src={logo}
            alt="PreCodeLink Logo"
            className="w-9 h-9 md:w-10 md:h-10 object-contain mix-blend-lighten"
          />

          <h1 className="text-2xl font-bold text-white tracking-wide">
            <span className="text-primary">
              Pre<span className="text-sky-400">Code</span>Link
            </span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-base font-medium text-gray-300">
          
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className="relative group">
              
              <span className="transition duration-300 group-hover:text-sky-400">
                {link.name}
              </span>

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* CTA */}
          <Link
            to="/contact"
            className="bg-sky-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-500 transition duration-300 shadow-lg shadow-sky-400/30"
          >
           Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-dark border-t border-gray-800 px-6 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-6 text-base font-medium text-gray-300">
          
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="relative group w-fit"
            >
              <span className="transition duration-300 group-hover:text-sky-400">
                {link.name}
              </span>

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="bg-sky-400 text-white px-6 py-3 rounded-xl text-sm font-semibold mt-2 hover:bg-sky-500 transition duration-300 text-center"
          >
            Get Started
          </Link>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;