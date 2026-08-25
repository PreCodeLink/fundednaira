import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Circle,
} from "lucide-react";

const MPLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const staff = JSON.parse(
    localStorage.getItem("staff") || "{}"
  );

  const role = staff?.role || "";

  const roleConfig = {
    mp: {
      title: "Funded Management",
      subtitle: "Manage Funded Accounts",
      badge: "FUNDED",
      dashboard: "/staff/dashboard2",
      requests: "/staff/phase-requests",
    },

    mp2: {
      title: "Phase 2 Management",
      subtitle: "Manage Phase 2 Accounts",
      badge: "PHASE 2 ",
      dashboard: "/staff/dashboard/pr2",
      requests: "/staff/phase2-requests",
    },
  };

  const config =
    roleConfig[role] || roleConfig.mp;

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: config.dashboard,
      description: "Overview & statistics",
    },
    {
      name: "Requests",
      icon: ClipboardCheck,
      path: config.requests,
      description: "Manage account requests",
    },
  ];

  const logout = () => {
    localStorage.removeItem("staff");
    localStorage.removeItem("staff_token");

    navigate("/auth/staff");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getInitial = () => {
    if (!staff?.name) return "M";

    return staff.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-white/5
          bg-[#0D121C]
          shadow-2xl
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                FundedNaira
              </h1>

              <p className="text-[11px] uppercase tracking-wider text-gray-500">
                Staff Portal
              </p>
            </div>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* Staff Profile */}
        <div className="p-5">

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold shadow-lg shadow-blue-600/10">
                {getInitial()}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-white">
                  {staff.name || "Management Staff"}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {staff.email || "Staff Account"}
                </p>

              </div>

              <Circle
                size={9}
                fill="currentColor"
                className="text-green-500"
              />

            </div>

            {/* Role */}
            <div className="mt-4 flex items-center justify-between">

              <span className="text-xs text-gray-500">
                Access Level
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-blue-400">
                {config.badge}
              </span>

            </div>

          </div>

        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
            Management
          </p>

          <nav className="space-y-2">

            {menus.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-3 py-3
                    transition-all duration-200
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >

                  <div
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-lg
                      ${
                        active
                          ? "bg-white/10"
                          : "bg-white/[0.03] group-hover:bg-white/[0.06]"
                      }
                    `}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-medium">
                      {item.name}
                    </p>

                    <p
                      className={`
                        mt-0.5 text-[10px]
                        ${
                          active
                            ? "text-blue-100"
                            : "text-gray-600 group-hover:text-gray-500"
                        }
                      `}
                    >
                      {item.description}
                    </p>

                  </div>

                  {active && (
                    <ChevronRight size={16} />
                  )}

                </Link>
              );
            })}

          </nav>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 p-4">

          <button
            onClick={logout}
            className="
              flex w-full items-center gap-3
              rounded-xl border border-red-500/10
              bg-red-500/5
              px-4 py-3
              text-sm font-medium text-red-400
              transition
              hover:border-red-500/20
              hover:bg-red-500/10
              hover:text-red-300
            "
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut size={17} />
            </div>

            <span>Sign out</span>

          </button>

          <p className="mt-4 text-center text-[10px] text-gray-700">
            FundedNaira Staff Portal
          </p>

        </div>

      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= MAIN ================= */}
      <div className="lg:ml-72">

        {/* Header */}
        <header
          className="
            sticky top-0 z-30
            flex h-20 items-center justify-between
            border-b border-white/5
            bg-[#0D121C]/95
            px-5 backdrop-blur-xl
            lg:px-8
          "
        >

          {/* Left */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setOpen(true)}
              className="
                rounded-xl border border-white/5
                bg-white/[0.03] p-2.5
                text-gray-400
                transition
                hover:bg-white/[0.06]
                hover:text-white
                lg:hidden
              "
            >
              <Menu size={21} />
            </button>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-lg font-semibold text-white">
                  {config.title}
                </h1>

                <span className="hidden rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-400 sm:block">
                  {config.badge}
                </span>

              </div>

              <p className="mt-0.5 text-xs text-gray-500">
                {config.subtitle}
              </p>

            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Online indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-2 sm:flex">

              <Circle
                size={8}
                fill="currentColor"
                className="text-green-500"
              />

              <span className="text-xs text-gray-400">
                Online
              </span>

            </div>

            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold shadow-lg shadow-blue-600/10">
              {getInitial()}
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-80px)] p-5 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MPLayout;