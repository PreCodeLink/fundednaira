import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";

const StaffLayoutPR = ({ children }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const staff = JSON.parse(
    localStorage.getItem("staff") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("staff");
    localStorage.removeItem("staff_token");
    navigate("/auth/staff");
  };

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/staff/dashboard/prw",
    },
    {
      name: "Payout Requests",
      icon: Wallet,
      path: "/staff/payout-requests",
    },
    {
      name: "Referral Withdrawals",
      icon: Users,
      path: "/staff/referral-withdrawals",
    },
  ];

  const currentMenu =
    menus.find((item) => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-gray-800 bg-gray-900 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-5">
          <div>
            <h2 className="text-lg font-bold">
              Staff Panel
            </h2>

            <p className="text-[11px] text-gray-500">
              Payment Management
            </p>
          </div>

          <button
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">

          {/* Staff Profile */}
          <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-800/60 p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold">
                {staff.name
                  ? staff.name.charAt(0).toUpperCase()
                  : "S"}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-gray-500">
                  Logged in as
                </p>

                <h3 className="truncate text-sm font-semibold text-white">
                  {staff.name || "Payment Staff"}
                </h3>

                <p className="mt-0.5 text-xs text-blue-400">
                  Payout Management
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <div className="mb-3 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Management
            </p>
          </div>

          <nav className="space-y-1.5">
            {menus.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />

                    <span>{item.name}</span>
                  </div>

                  {active && (
                    <ChevronRight size={16} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-8 border-t border-gray-800 pt-5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl border border-red-500/10 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/95 px-4 backdrop-blur-md sm:px-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <h1 className="text-base font-semibold sm:text-lg">
                {currentMenu?.name || "Payment Management"}
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Manage payouts and referral withdrawals
              </p>
            </div>

          </div>

          {/* Staff Avatar */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-gray-300">
                {staff.name || "Staff"}
              </p>

              <p className="text-[11px] text-gray-500">
                Payment Staff
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold shadow-lg shadow-blue-600/20">
              {staff.name
                ? staff.name.charAt(0).toUpperCase()
                : "S"}
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default StaffLayoutPR;