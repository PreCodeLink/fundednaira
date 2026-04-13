import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, DollarSign, Users } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Accounts", icon: Wallet, path: "/dashboard/acc" },
    { name: "Payouts", icon: DollarSign, path: "/dashboard/payouts" },
    { name: "Affiliate", icon: Users, path: "/dashboard/affiliate" },
  ];

  return (
    <div className="w-64 bg-[#020617] border-r border-gray-800 hidden md:flex flex-col">
      
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 font-bold text-lg">
        <span className="text-sky-400">Funded</span>Naira
      </div>

      {/* LINKS */}
      <div className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              location.pathname === link.path
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <link.icon size={18} />
            {link.name}
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 text-xs text-gray-500">
        © 2026 FundedNaira
      </div>
    </div>
  );
};

export default Sidebar;