import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  Banknote,
  UsersRound,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Circle,
} from "lucide-react";

const StaffLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const staff = JSON.parse(localStorage.getItem("staff") || "null");

  const staffName = staff?.name || staff?.full_name || "Staff";
  const staffRole = staff?.role || "Staff";

  const getInitials = (name) => {
    if (!name) return "S";

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleName = (role) => {
    switch (role) {
      case "ua":
        return "Upload Account Staff";

      case "mp":
        return "Management Staff";

      case "mp2":
        return "Phase 2 Manager";

      case "pr":
        return "Payout Staff";
      case "ps":
        return "Pending Staff";

      default:
        return "Staff Member";
    }
  };

  const logout = () => {
    localStorage.removeItem("staff");
    localStorage.removeItem("staff_token");

    navigate("/auth/staff");
  };

 const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/staff/dashboard",
  },
  {
    name: "Pending Purchased Accounts",
    icon: ShoppingCart,
    path: "/staff/ppa",
  },
  {
    name: "Pending Payouts",
    icon: Banknote,
    path: "/staff/ppt",
  },
  {
    name: "Pending Referral Withdrawals",
    icon: UsersRound,
    path: "/staff/prwl",
  },
];

  const currentMenu =
    menus.find((item) => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-[#05070D] text-white">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72
          bg-[#0B0F19]
          border-r border-white/[0.07]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="h-20 flex items-center justify-between px-6 border-b border-white/[0.07]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">

              <ShieldCheck
                size={21}
                className="text-blue-400"
              />

            </div>

            <div>

              <h1 className="font-bold text-lg tracking-tight">
                FundedNaira
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Staff Portal
              </p>

            </div>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-white"
          >
            <X size={21} />
          </button>

        </div>


        {/* Staff Profile */}

        <div className="p-5">

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-400/10 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300">

                {getInitials(staffName)}

              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-white truncate">
                  {staffName}
                </p>

                <p className="text-[11px] text-gray-500 truncate">
                  {getRoleName(staffRole)}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 mt-4">

              <Circle
                size={8}
                className="fill-emerald-400 text-emerald-400"
              />

              <span className="text-[11px] text-emerald-400">
                Online
              </span>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <div className="px-4">

          <p className="px-3 mb-3 text-[10px] uppercase tracking-widest text-gray-600 font-semibold">
            Workspace
          </p>

          <nav className="space-y-1.5">

            {menus.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center justify-between
                    rounded-xl px-4 py-3
                    transition-all duration-200
                    ${
                      active
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400"
                        : "border border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    <Icon size={18} />

                    <span className="text-sm font-medium">
                      {item.name}
                    </span>

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

        <div className="absolute bottom-0 left-0 right-0 p-4">

          <div className="border-t border-white/[0.07] pt-4">

            <button
              onClick={logout}
              className="
                group flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-gray-400
                hover:bg-red-500/10
                hover:text-red-400
                transition
              "
            >

              <LogOut
                size={18}
                className="group-hover:text-red-400"
              />

              <span className="text-sm font-medium">
                Sign out
              </span>

            </button>

          </div>

        </div>

      </aside>


      {/* ================= MOBILE OVERLAY ================= */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/70 backdrop-blur-sm
            lg:hidden
          "
        />
      )}


      {/* ================= MAIN ================= */}

      <div className="lg:ml-72 min-h-screen">

        {/* Header */}

        <header
          className="
            sticky top-0 z-30
            h-20
            border-b border-white/[0.07]
            bg-[#05070D]/90
            backdrop-blur-xl
            flex items-center justify-between
            px-5 sm:px-8
          "
        >

          <div className="flex items-center gap-4">

            {/* Mobile Menu */}

            <button
              onClick={() => setOpen(true)}
              className="
                lg:hidden
                w-10 h-10
                rounded-xl
                border border-white/10
                bg-white/[0.03]
                flex items-center justify-center
                text-gray-400
                hover:text-white
              "
            >
              <Menu size={20} />
            </button>


            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-lg sm:text-xl font-semibold">
                  {currentMenu?.name || "Staff Portal"}
                </h1>

              </div>

              <div className="hidden sm:flex items-center gap-2 mt-1">

                <span className="text-[11px] text-gray-600">
                  Staff Portal
                </span>

                <ChevronRight
                  size={12}
                  className="text-gray-700"
                />

                <span className="text-[11px] text-gray-500">
                  {currentMenu?.name || "Dashboard"}
                </span>

              </div>

            </div>

          </div>


          {/* Header Staff */}

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">

              <p className="text-sm font-medium text-white">
                {staffName}
              </p>

              <p className="text-[10px] text-gray-500">
                {getRoleName(staffRole)}
              </p>

            </div>

            <div className="
              w-10 h-10
              rounded-xl
              bg-gradient-to-br
              from-blue-600/30
              to-blue-400/10
              border border-blue-500/20
              flex items-center justify-center
              text-sm font-bold
              text-blue-300
            ">
              {getInitials(staffName)}
            </div>

          </div>

        </header>


        {/* Page Content */}

        <main className="p-4 sm:p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>
  );
};

export default StaffLayout;