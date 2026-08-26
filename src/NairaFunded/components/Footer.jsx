import { Link } from "react-router-dom";
import {
  Send,
  Twitter,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Users,
  Headphones,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#050816] text-white">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-0 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* CTA */}
        <div className="py-20">

          <div className="relative overflow-hidden flex flex-col items-center justify-between gap-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-12 lg:flex-row">

            {/* CTA glow */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative">

              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-sky-300">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                READY TO START?
              </span>

              <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
                Become a
                <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Funded Trader
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Trade with FundedNaira capital, keep up to 100% of your
                profits, and build your trading career without risking
                your personal capital.
              </p>

            </div>

            <Link
              to="/auth"
              className="
                relative group flex shrink-0 items-center gap-3
                rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600
                px-8 py-5 font-semibold
                shadow-xl shadow-sky-500/20
                transition duration-300
                hover:-translate-y-1 hover:shadow-sky-400/40
              "
            >
              Get Funded

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

        {/* Main Footer */}
        <div className="grid gap-14 border-t border-white/10 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>

            <h2 className="text-3xl font-black tracking-tight">
              <span className="text-sky-400">Funded</span>Naira
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Nigeria's modern proprietary trading platform helping
              traders access funded capital, trade confidently and
              receive payouts in Naira.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-green-400/10 bg-green-400/5 px-4 py-3 text-sm text-green-400">
              <ShieldCheck size={18} />
              Secure Trading Platform
            </div>

          </div>

          {/* Company */}
          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>

            <div className="space-y-4">

              {[
                ["/", "Home"],
                ["/buy-acc", "Buy Account"],
                ["/affiliate", "Affiliate"],
                ["/rules", "Trading Rules"],
                ["/contact", "Contact"],
              ].map(([path, label]) => (
                <Link
                  key={label}
                  to={path}
                  className="
                    group flex items-center gap-2
                    text-slate-400 transition
                    hover:text-sky-400
                  "
                >
                  <span>{label}</span>
                  <ArrowRight
                    size={13}
                    className="
                      opacity-0 -translate-x-2
                      transition-all duration-300
                      group-hover:translate-x-0 group-hover:opacity-100
                    "
                  />
                </Link>
              ))}

            </div>

          </div>

          {/* Resources */}
          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Resources
            </h3>

            <div className="space-y-4">

              <Link
                to="/faq"
                className="block text-slate-400 transition hover:text-sky-400"
              >
                Frequently Asked Questions
              </Link>

              <Link
                to="/privacy"
                className="block text-slate-400 transition hover:text-sky-400"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="block text-slate-400 transition hover:text-sky-400"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/rules"
                className="block text-slate-400 transition hover:text-sky-400"
              >
                Trading Rules
              </Link>

            </div>

          </div>

          {/* Contact & Community */}
          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Contact & Community
            </h3>

            <div className="space-y-4">

              {/* Email */}
              <a
                href="mailto:fundednaira678@gmail.com"
                className="
                  group flex items-center gap-3
                  rounded-xl border border-white/5
                  bg-white/[0.03] p-3
                  transition hover:border-sky-500/20 hover:bg-white/[0.06]
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="truncate text-sm text-slate-300 group-hover:text-sky-400">
                    fundednaira678@gmail.com
                  </p>
                </div>
              </a>


              {/* WhatsApp Support */}
              <a
                href="https://wa.me/message/SWX5LTZMHP2AD1"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-3
                  rounded-xl border border-green-400/10
                  bg-green-400/[0.03] p-3
                  transition hover:border-green-400/30
                  hover:bg-green-400/[0.06]
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-400/10 text-green-400">
                  <Headphones size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">
                    WhatsApp Support
                  </p>

                  <p className="text-sm font-medium text-slate-300 group-hover:text-green-400">
                    Chat with our support team
                  </p>
                </div>

                <ExternalLink
                  size={14}
                  className="text-slate-600 transition group-hover:text-green-400"
                />
              </a>


              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029VbDVyJjBlHpebZpR8K47"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-3
                  rounded-xl border border-green-400/10
                  bg-green-400/[0.03] p-3
                  transition hover:border-green-400/30
                  hover:bg-green-400/[0.06]
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-400/10 text-green-400">
                  <Users size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">
                    WhatsApp Channel
                  </p>

                  <p className="text-sm font-medium text-slate-300 group-hover:text-green-400">
                    Follow FundedNaira updates
                  </p>
                </div>

                <ExternalLink
                  size={14}
                  className="text-slate-600 transition group-hover:text-green-400"
                />
              </a>


              {/* Telegram Support */}
              <a
                href="https://t.me/FundedNaira1"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-3
                  rounded-xl border border-[#229ED9]/10
                  bg-[#229ED9]/[0.03] p-3
                  transition hover:border-[#229ED9]/30
                  hover:bg-[#229ED9]/[0.06]
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#229ED9]/10 text-[#229ED9]">
                  <Send size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">
                    Telegram Support
                  </p>

                  <p className="text-sm font-medium text-slate-300 group-hover:text-[#229ED9]">
                    Chat with @FundedNaira1
                  </p>
                </div>

                <ExternalLink
                  size={14}
                  className="text-slate-600 transition group-hover:text-[#229ED9]"
                />
              </a>


              {/* Telegram Channel */}
              <a
                href="https://t.me/FundedNaira"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-3
                  rounded-xl border border-[#229ED9]/10
                  bg-[#229ED9]/[0.03] p-3
                  transition hover:border-[#229ED9]/30
                  hover:bg-[#229ED9]/[0.06]
                "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#229ED9]/10 text-[#229ED9]">
                  <Send size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">
                    Telegram Channel
                  </p>

                  <p className="text-sm font-medium text-slate-300 group-hover:text-[#229ED9]">
                    Follow FundedNaira updates
                  </p>
                </div>

                <ExternalLink
                  size={14}
                  className="text-slate-600 transition group-hover:text-[#229ED9]"
                />
              </a>


              {/* Location */}
              <div className="flex items-center gap-3 pt-2">

                <MapPin
                  size={18}
                  className="shrink-0 text-sky-400"
                />

                <span className="text-sm text-slate-400">
                  Nigeria
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Social Community Bar */}
        <div className="border-t border-white/10 py-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h3 className="font-semibold">
                Stay connected with FundedNaira
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Get announcements, updates and support from our community.
              </p>
            </div>


            <div className="flex flex-wrap gap-3">

              {/* WhatsApp Support */}
              <a
                href="https://wa.me/message/SWX5LTZMHP2AD1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Support"
                className="
                  flex h-12 items-center gap-2 rounded-xl
                  border border-green-400/20
                  bg-green-400/10 px-4
                  text-green-400
                  transition hover:-translate-y-1
                  hover:bg-green-400/20
                "
              >
                <MessageCircle size={19} />
                <span className="text-sm font-medium">
                  WhatsApp
                </span>
              </a>


              {/* WhatsApp Channel */}
              <a
                href="https://whatsapp.com/channel/0029VbDVyJjBlHpebZpR8K47"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                className="
                  flex h-12 items-center gap-2 rounded-xl
                  border border-green-400/20
                  bg-green-400/10 px-4
                  text-green-400
                  transition hover:-translate-y-1
                  hover:bg-green-400/20
                "
              >
                <Users size={19} />
                <span className="text-sm font-medium">
                  WhatsApp Channel
                </span>
              </a>


              {/* Telegram */}
              <a
                href="https://t.me/FundedNaira"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Channel"
                className="
                  flex h-12 items-center gap-2 rounded-xl
                  border border-[#229ED9]/20
                  bg-[#229ED9]/10 px-4
                  text-[#229ED9]
                  transition hover:-translate-y-1
                  hover:bg-[#229ED9]/20
                "
              >
                <Send size={19} />
                <span className="text-sm font-medium">
                  Telegram
                </span>
              </a>


              {/* X */}
              <a
                href="https://x.com/FundedNair8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-xl border border-white/10
                  bg-white/5 text-white
                  transition hover:-translate-y-1
                  hover:bg-white/10
                "
              >
                <Twitter size={19} />
              </a>

            </div>

          </div>

        </div>


        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-8 md:flex-row">

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
