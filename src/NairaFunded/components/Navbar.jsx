import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buy Account", path: "/buy-acc" },
    { name: "Affiliate", path: "/affiliate" },
    { name: "Rules", path: "/rules" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50">
        <div
          className={`
            border-b transition-all duration-300
            ${
              scrolled
                ? "bg-[#050816]/90 border-white/10 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(2,132,199,0.25)]"
                : "bg-[#050816]/60 border-white/5 backdrop-blur-lg"
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 sm:h-18 min-h-[64px] flex items-center justify-between">

              {/* Logo */}
              <Link to="/" className="group flex items-center gap-2.5 shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  <span className="text-sky-400">Funded</span>
                  <span className="text-white">Naira</span>
                </h1>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`
                        relative px-3.5 py-2 text-sm font-medium rounded-lg
                        transition-colors duration-200
                        ${active ? "text-white" : "text-gray-300 hover:text-white"}
                      `}
                    >
                      {link.name}
                      <span
                        className={`
                          absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full
                          bg-gradient-to-r from-sky-400 to-sky-500
                          origin-center transition-transform duration-300
                          ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                        `}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Button */}
              <div className="hidden md:block">
                <Link
                  to="/auth"
                  className="
                    group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-sky-500 text-white font-semibold text-sm
                    shadow-lg shadow-sky-500/25
                    transition-all duration-300
                    hover:bg-sky-400 hover:shadow-sky-400/40 hover:-translate-y-0.5
                    active:translate-y-0
                  "
                >
                  Dashboard
                  <ChevronRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Mobile Button */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="
                  md:hidden relative z-10 p-2 rounded-lg text-white
                  hover:bg-white/10 active:scale-95
                  transition
                "
              >
                <span className="relative block h-6 w-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed top-16 sm:top-18 left-0 right-0 z-40
          transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}
        `}
      >
        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-[#0a1024]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="px-3 py-4 space-y-1">
            {navLinks.map((link, i) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl
                    text-[15px] font-medium transition-all duration-300
                    ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                    ${
                      active
                        ? "bg-sky-500/15 text-sky-300"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                  <ChevronRight size={16} className="opacity-40" />
                </Link>
              );
            })}

            <Link
              to="/auth"
              className="
                flex items-center justify-center gap-2 mt-3 px-5 py-3 rounded-xl
                bg-sky-500 hover:bg-sky-400 text-white font-semibold
                shadow-lg shadow-sky-500/20
                transition-all duration-300
              "
            >
              Go to Dashboard
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;