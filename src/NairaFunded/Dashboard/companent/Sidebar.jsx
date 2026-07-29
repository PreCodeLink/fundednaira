import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  DollarSign,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Buy Accounts", icon: Wallet, path: "/dashboard/acc" },
    { name: "My Accounts", icon: Wallet, path: "/dashboard/my-acc" },
    { name: "Payouts", icon: DollarSign, path: "/dashboard/payouts" },
    { name: "Affiliate", icon: Users, path: "/dashboard/affiliate" },
  ];

  return (
   <aside
  className="
    hidden
    md:flex
    fixed
    left-0
    top-16
    h-[calc(100vh-4rem)]
    w-72
    flex-col
    border-r
    border-[#38BDF8]/15
    bg-[#0A1220]/95
    backdrop-blur-xl
    z-40
  "
>

      {/* MENU TITLE */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#5B6B82]">
          Menu
        </p>
      </div>

      {/* LINKS */}
      <nav className="flex-1 space-y-1 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`group relative flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#38BDF8]/10 text-[#F3EFE6]"
                  : "text-[#93A0B4] hover:bg-white/[0.04] hover:text-[#F3EFE6]"
              }`}
            >
              {/* active rail — matches the navbar's hairline signature */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[#38BDF8]" />
              )}

              <Icon
                size={19}
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  active ? "text-[#38BDF8]" : "text-[#5B6B82] group-hover:text-[#38BDF8]"
                }`}
              />

              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM MENU */}
      <div className="space-y-1 border-t border-white/[0.06] p-4">
        {/* SETTINGS */}
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-[#93A0B4] transition hover:bg-white/[0.04] hover:text-[#F3EFE6]"
        >
          <Settings size={19} />
          Settings
        </Link>

        {/* LOGOUT */}
        <button className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10">
          <LogOut size={19} />
          Logout
        </button>
      </div>

      {/* FOOTER */}
      <div className="border-t border-[#38BDF8]/15 px-6 py-4">
        <p className="font-serif text-xs text-[#93A0B4]">© 2026 FundedNaira</p>
        <p className="mt-1 text-[0.7rem] text-[#5B6B82]">All rights reserved</p>
      </div>
    </aside>
  );
};

export default Sidebar;