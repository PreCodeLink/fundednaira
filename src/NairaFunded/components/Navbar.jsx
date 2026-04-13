import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buy Account", path: "/buy-acc" },
    { name: "Affiliate", path: "/affiliate" },
    { name: "Rules", path: "/rules" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-white tracking-wide">
          <Link to='/'><span className="text-sky-400">Funded</span>Naira</Link>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="hover:text-white transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Dashboard Button */}
        <div className="hidden md:block">
          <Link
            to="/auth"
            className="bg-primary px-5 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 bg-dark border-t border-gray-800">
          <div className="flex flex-col gap-4 text-gray-300 mt-4">
            
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/auth"
              className="mt-4 bg-primary px-5 py-3 rounded-lg text-center text-white font-medium"
            >
              Go to Dashboard
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;