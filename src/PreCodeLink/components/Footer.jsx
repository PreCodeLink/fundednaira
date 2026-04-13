import logo from "../assests/images/logo.png";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020617] border-t border-gray-800 pt-16 pb-8 px-6">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-1  mb-4">
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            <h2 className="text-xl font-bold text-white">
              Pre<span className="text-sky-400">Code</span>Link
            </h2>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            Building modern digital solutions for businesses, students, and startups.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 hover:scale-110 transition duration-300"
            >
              <FaFacebookF className="text-white text-sm" />
            </a>

            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 hover:scale-110 transition duration-300"
            >
              <FaInstagram className="text-white text-sm" />
            </a>

            <a
              href="#"
              className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 hover:scale-110 transition duration-300"
            >
              <FaLinkedinIn className="text-white text-sm" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2349040980156" // 🔁 replace with your number
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-600 rounded-lg hover:bg-green-500 hover:scale-110 transition duration-300 shadow-lg shadow-green-500/30"
            >
              <FaWhatsapp className="text-white text-sm" />
            </a>

          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-sky-400 cursor-pointer transition">Home</li>
            <li className="hover:text-sky-400 cursor-pointer transition">Services</li>
            <li className="hover:text-sky-400 cursor-pointer transition">Projects</li>
            <li className="hover:text-sky-400 cursor-pointer transition">Contact</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Web Development</li>
            <li>Logo Design</li>
            <li>School Projects</li>
            <li>Flyer Design</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Email: precodelink@gmail.com</li>
            <li>Phone: +234 904 098 0156</li>
            <li>Kano, Nigeria</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PreCodeLink. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;