import { Link } from "react-router-dom";
import { Send, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-400 border-t border-gray-800 px-6 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">
            FundedNaira
          </h2>

          <p className="mt-4 text-sm leading-6">
            Nigeria’s leading Naira-funded prop firm helping traders access real capital and earn consistently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/buy-acc"
                className="hover:text-white transition"
              >
                Buy Account
              </Link>
            </li>

            <li>
              <Link
                to="/affiliate"
                className="hover:text-white transition"
              >
                Affiliate
              </Link>
            </li>

            <li>
              <Link
                to="/rules"
                className="hover:text-white transition"
              >
                Rules
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-white transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Resources
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/faq"
                className="hover:text-white transition"
              >
                FAQ
              </Link>
            </li>

            <li>
              <Link
                to="/terms"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link
                to="/privacy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Contact
          </h3>

          <ul className="space-y-3 text-sm">
            <li>Email: fundednaira68@gmail.com</li>

            <li>Telegram: FundedNaira1</li>

            <li>Location: Nigeria</li>
          </ul>

          {/* Telegram Channel Card */}
          <a
            href="https://t.me/FundedNaira"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-4 transition hover:scale-[1.02] hover:border-blue-400"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
              <Send size={28} />
            </div>

            <div>
              <h4 className="text-white text-base font-semibold">
                Join Our Telegram Channel
              </h4>

              <p className="text-xs text-gray-300 mt-1">
                Get trading updates, payouts, signals & announcements instantly.
              </p>
            </div>
          </a>

          {/* Twitter/X Card */}
          <a
            href="https://x.com/FundedNair8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-500/20 bg-gradient-to-r from-gray-700/20 to-gray-900/20 p-4 transition hover:scale-[1.02] hover:border-gray-400"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg">
              <Twitter size={28} />
            </div>

            <div>
              <h4 className="text-white text-base font-semibold">
                Follow Us on X
              </h4>

              <p className="text-xs text-gray-300 mt-1">
                Stay updated with trading news, giveaways & platform updates.
              </p>
            </div>
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
        © {new Date().getFullYear()} FundedNaira. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
