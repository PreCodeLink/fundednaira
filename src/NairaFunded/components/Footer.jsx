import { Link } from "react-router-dom";
import {
  Send,
  Twitter,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#050816] text-white">

      {/* Background Glow */}
      <div className="absolute inset-0">

        <div className="absolute -top-40 left-0 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[150px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* CTA */}

        <div className="py-20">

          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-2 text-sky-300 text-sm">

                READY TO START?

              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-black">

                Become a
                <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">

                  Funded Trader

                </span>

              </h2>

              <p className="mt-5 text-slate-400 max-w-xl">

                Join hundreds of traders using FundedNaira capital to
                grow their trading careers with fast payouts and up to
                90% profit split.

              </p>

            </div>

            <Link
              to="/auth"
              className="
              group
              flex
              items-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-sky-500
              to-blue-600
              px-8
              py-5
              font-semibold
              shadow-xl
              shadow-sky-500/20
              transition
              hover:scale-105
              "
            >

              Get Funded

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

        {/* Main Footer */}

        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <h2 className="text-3xl font-black">

              <span className="text-sky-400">
                Funded
              </span>

              Naira

            </h2>

            <p className="mt-5 text-slate-400 leading-7">

              Nigeria's modern prop firm helping traders access funded
              capital, receive payouts in Naira and build long-term
              trading careers.

            </p>

            <div className="mt-8 flex items-center gap-2 text-green-400">

              <ShieldCheck size={18} />

              Secure Trading Platform

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-lg font-bold mb-6">
              Company
            </h3>

            <div className="space-y-4">

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/">
                Home
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/buy-acc">
                Buy Account
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/affiliate">
                Affiliate
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/rules">
                Rules
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/contact">
                Contact
              </Link>

            </div>

          </div>

          {/* Resources */}

          <div>

            <h3 className="text-lg font-bold mb-6">
              Resources
            </h3>

            <div className="space-y-4">

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/faq">
                FAQ
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/privacy">
                Privacy Policy
              </Link>

              <Link className="block text-slate-400 hover:text-sky-400 transition" to="/terms">
                Terms & Conditions
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-lg font-bold mb-6">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">

                <Mail
                  size={18}
                  className="text-sky-400 mt-1"
                />

                <span className="text-slate-400">
                  fundednaira68@gmail.com
                </span>

              </div>

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="text-sky-400 mt-1"
                />

                <span className="text-slate-400">
                  Nigeria
                </span>

              </div>

            </div>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              <a
                href="https://t.me/FundedNaira"
                target="_blank"
                rel="noreferrer"
                className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#229ED9]/20
                border
                border-[#229ED9]/30
                hover:scale-110
                transition
                "
              >

                <Send />

              </a>

              <a
                href="https://x.com/FundedNair8"
                target="_blank"
                rel="noreferrer"
                className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-white/5
                border
                border-white/10
                hover:scale-110
                transition
                "
              >

                <Twitter />

              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-slate-500 text-sm">

            © {new Date().getFullYear()} FundedNaira. All Rights Reserved.

          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">

            <Link to="/privacy" className="hover:text-sky-400 transition">
              Privacy
            </Link>

            <Link to="/terms" className="hover:text-sky-400 transition">
              Terms
            </Link>

            <Link to="/rules" className="hover:text-sky-400 transition">
              Trading Rules
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;