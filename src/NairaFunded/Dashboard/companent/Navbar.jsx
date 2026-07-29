import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Accounts", to: "/dashboard/my-acc" },
  { label: "Buy Account", to: "/dashboard/acc" },
  { label: "Payout", to: "/dashboard/payouts" },
  { label: "Affiliate", to: "/dashboard/affiliate" },
  { label: "My Profile", to: "/dashboard/profile" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdown, setDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Get logged user ID
  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;

      const parsedUser = JSON.parse(rawUser);
      return parsedUser.id || parsedUser.user_id || null;
    } catch (error) {
      console.log("User ID Error:", error);
      return null;
    }
  };

  // Create avatar initials
  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Track scroll to add subtle depth once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdown(false);
  }, [location.pathname]);

  // Fetch latest user data
  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(
      `https://api.fundednaira.net/api/dashboard/index.php?user_id=${userId}`
    )
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (!data.success) return;

          setUser({
            name: data.user?.name || data.user?.full_name || "User",
            email: data.user?.email || "",
            role: data.user?.role || "user",
          });

          localStorage.setItem("user", JSON.stringify(data.user));
        } catch {
          console.log("Invalid JSON:", text);
        }
      })
      .catch((error) => {
        console.log("Navbar Error:", error);
      });
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1220]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "bg-[#0A1220]/80"
      } backdrop-blur-xl`}
    >
      {/* Double hairline — the ledger-rule signature */}
      <div className="border-b border-[#38BDF8]/25">
        <div className="border-b border-white/[0.06]">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
            {/* LOGO */}
            <Link to="/dashboard" className="group flex items-center gap-2.5 shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400" />
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  <span className="text-sky-400">Funded</span>
                  <span className="text-white">Naira</span>
                </h1>
              </Link>

            {/* NAV LINKS — desktop only */}
            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 text-[0.8rem] font-medium uppercase tracking-[0.08em] transition-colors ${
                      active
                        ? "text-[#38BDF8]"
                        : "text-[#93A0B4] hover:text-[#F3EFE6]"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute inset-x-4 -bottom-[1px] h-[1.5px] bg-[#38BDF8]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE — profile + mobile toggle */}
            <div className="flex items-center gap-2">
              {/* PROFILE AREA */}
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-2 transition-all hover:border-[#38BDF8]/30 hover:bg-white/[0.07] sm:gap-3 sm:pr-3"
                >
                  {/* AVATAR */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#38BDF8]/50 bg-[#0F1A2E] text-[0.75rem] font-semibold text-[#38BDF8] sm:h-9 sm:w-9 sm:text-[0.8rem]">
                    {getInitials(user.name)}
                  </div>

                  {/* USER NAME — hidden until larger screens */}
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium leading-tight text-[#F3EFE6]">
                      {user.name || "User"}
                    </p>
                    <p className="max-w-[120px] truncate text-[0.7rem] leading-tight text-[#93A0B4]">
                      {user.email}
                    </p>
                  </div>

                  {/* ARROW */}
                  <ChevronDown
                    size={16}
                    className={`hidden text-[#93A0B4] transition-transform duration-200 sm:block ${
                      dropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN MENU */}
                {dropdown && (
                  <div className="absolute right-0 mt-3 w-[85vw] max-w-64 overflow-hidden rounded-xl border border-[#38BDF8]/20 bg-[#0B1220] shadow-2xl">
                    {/* USER HEADER */}
                    <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#38BDF8]/50 bg-[#0F1A2E] font-serif text-base text-[#38BDF8]">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-serif text-[0.95rem] text-[#F3EFE6]">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs text-[#93A0B4]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PROFILE */}
                    <button
                      onClick={() => {
                        setDropdown(false);
                        navigate("/dashboard/profile");
                      }}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#93A0B4] transition hover:bg-[#38BDF8]/[0.08] hover:text-[#F3EFE6]"
                    >
                      <User size={17} />
                      Manage Profile
                    </button>

                    {/* DASHBOARD */}
                    <button
                      onClick={() => {
                        setDropdown(false);
                        navigate("/dashboard");
                      }}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#93A0B4] transition hover:bg-[#38BDF8]/[0.08] hover:text-[#F3EFE6]"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </button>

                    {/* SETTINGS */}
                    <button
                      onClick={() => {
                        setDropdown(false);
                        navigate("/dashboard/settings");
                      }}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#93A0B4] transition hover:bg-[#38BDF8]/[0.08] hover:text-[#F3EFE6]"
                    >
                      <Settings size={17} />
                      Settings
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-white/10 px-5 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#F3EFE6] transition hover:border-[#38BDF8]/30 hover:bg-white/[0.07] lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* MOBILE NAV PANEL */}
          <div
            className={`overflow-hidden transition-all duration-300 lg:hidden ${
              mobileOpen ? "max-h-80" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-1 border-t border-white/[0.06] px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium uppercase tracking-[0.06em] transition-colors ${
                      active
                        ? "bg-[#38BDF8]/10 text-[#38BDF8]"
                        : "text-[#93A0B4] hover:bg-white/[0.04] hover:text-[#F3EFE6]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;