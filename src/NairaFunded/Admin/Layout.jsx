import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  MessageSquare,
  Settings,
  Menu,
  ShoppingCart,
  ArrowUpRight,
  ArrowBigRight,
  Mail,
  ArrowBigUpIcon
} from "lucide-react";

const AdminLayout = ({children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 w-64 bg-gray-900 p-5 border-r border-gray-800 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

        <nav className="space-y-2">
      <NavItem to="/auth/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
      <NavItem to="/auth/admin/users" icon={<Users />} label="Manage Users" />
      <NavItem to="/auth/admin/account/purchased" icon={<Wallet />} label="Purchased Accounts" />
      <NavItem to="/auth/admin/accounts" icon={<ArrowUpRight />} label=" Account Plans" />
      <NavItem to="/auth/admin/payouts" icon={<ShoppingCart />} label="Payouts" />
      <NavItem to="/auth/admin/phase" icon={<ArrowBigRight />} label="Phase Request" />
      <NavItem to="/auth/admin/payments" icon={<CreditCard />} label="Payments" />
      <NavItem to="/auth/admin/referrals" icon={<Users />} label="Manage Referrals" />
      <NavItem to="/auth/admin/feedback" icon={<MessageSquare />} label="Feedback" />
      <NavItem to="/auth/admin/upload-acc" icon={<ArrowBigUpIcon />} label="Upload Account" />
      <NavItem to="/auth/admin/notifications" icon={<Mail />} label="Send Email" />
      <NavItem to="/auth/admin/settings" icon={<Settings />} label="Settings" />
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu />
          </button>
          <h2 className="text-lg font-semibold"><span className="text-sky-400">Funded</span>Naira</h2>
          <div className="text-sm">Admin</div>
        </header>

         {children}
      </div>
    </div>
  );
};
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-white text-black"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default AdminLayout;
