import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-400 border-t border-gray-800 px-6 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">
            FundedNaira
          </h2>
          <p className="mt-4 text-sm">
            Nigeria’s leading Naira-funded prop firm helping traders access real capital and earn consistently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/buy-acc">Buy Account</Link></li>
            <li><Link to="/affiliate">Affiliate</Link></li>
            <li><Link to="/rules">Rules</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: fundednaira68@gmail.com</li>
            <li>Telegram: FundedNaira1 </li>
            <li>Location: Nigeria</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
        © {new Date().getFullYear()} NairaFunded. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;