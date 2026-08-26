import { Link } from "react-router-dom";
import {
  Send,
  Twitter,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#050816] text-white">

      {/* Background Glow */}
      <div className="absolute inset-0">

        <div className="absolute -top-40 left-0 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[150px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* CTA */}
        <div className="py-20">

          <div className="flex flex-col items-center justify-between gap-10 rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:p-14 lg:flex-row">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
                READY TO START?
              </span>

              <h2 className="mt-6 text-4xl font-black md:text-5xl">

                Become a

                <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Funded Trader
                </span>

              </h2>

              <p className="mt-5 max-w-xl text-slate-400">

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

            <p className="mt-5 leading-7 text-slate-400">

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

            <h3 className="mb-6 text-lg font-bold">
              Company
            </h3>

            <div className="space-y-4">

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/"
              >
                Home
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/buy-acc"
              >
                Buy Account
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/affiliate"
              >
                Affiliate
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/rules"
              >
                Rules
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/contact"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* Resources */}
          <div>

            <h3 className="mb-6 text-lg font-bold">
              Resources
            </h3>

            <div className="space-y-4">

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/faq"
              >
                FAQ
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/privacy"
              >
                Privacy Policy
              </Link>

              <Link
                className="block text-slate-400 transition hover:text-sky-400"
                to="/terms"
              >
                Terms & Conditions
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h3 className="mb-6 text-lg font-bold">
              Contact & Support
            </h3>

            <div className="space-y-5">

              {/* Email */}
              <a
                href="mailto:fundednaira68@gmail.com"
                className="group flex items-start gap-3"
              >

                <Mail
                  size={18}
                  className="mt-1 shrink-0 text-sky-400"
                />

                <span className="text-slate-400 transition group-hover:text-sky-400">
                  fundednaira68@gmail.com
                </span>

              </a>

              {/* WhatsApp Support */}
              <a
                href="https://wa.me/2348133507159"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >

                <MessageCircle
                  size={18}
                  className="mt-1 shrink-0 text-green-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    WhatsApp Support
                  </p>

                  <span className="text-slate-400 transition group-hover:text-green-400">
                    +234 813 350 7159
                  </span>
                </div>

              </a>

              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029VbDVyJjBIHpebZpR8K47"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >

                <MessageCircle
                  size={18}
                  className="mt-1 shrink-0 text-green-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    WhatsApp Channel
                  </p>

                  <span className="text-slate-400 transition group-hover:text-green-400">
                    Join our channel
                  </span>
                </div>

              </a>

              {/* Telegram Support */}
              <a
                href="https://t.me/FundedNaira1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >

                <Send
                  size={18}
                  className="mt-1 shrink-0 text-[#229ED9]"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Telegram Support
                  </p>

                  <span className="text-slate-400 transition group-hover:text-[#229ED9]">
                    @FundedNaira1
                  </span>
                </div>

              </a>

              {/* Location */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-1 shrink-0 text-sky-400"
                />

                <span className="text-slate-400">
                  Nigeria
                </span>

              </div>

            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">

              {/* Telegram */}
              <a
                href="https://t.me/FundedNaira1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#229ED9]/30
                  bg-[#229ED9]/20
                  transition
                  hover:scale-110
                "
              >

                <Send size={22} />

              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/2348133507159"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-green-400/30
                  bg-green-400/10
                  text-green-400
                  transition
                  hover:scale-110
                "
              >

                <MessageCircle size={22} />

              </a>

              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029VbDVyJjBIHpebZpR8K47"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-green-400/30
                  bg-green-400/10
                  text-green-400
                  transition
                  hover:scale-110
                "
              >

                <MessageCircle size={22} />

              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/FundedNair8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  transition
                  hover:scale-110
                "
              >

                <Twitter size={22} />

              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">

          <p className="text-sm text-slate-500">

            © {new Date().getFullYear()} FundedNaira. All Rights Reserved.

          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">

            <Link
              to="/privacy"
              className="transition hover:text-sky-400"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-sky-400"
            >
              Terms
            </Link>

            <Link
              to="/rules"
              className="transition hover:text-sky-400"
            >
              Trading Rules
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;