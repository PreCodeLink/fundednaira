import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Upload,
  LogOut,
} from "lucide-react";

const StaffLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
      name: "Upload Accounts",
      icon: Upload,
      path: "/staff/upload-account",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-5">
          <h2 className="text-xl font-bold">
            Staff Panel
          </h2>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 rounded-xl bg-gray-800 p-4">
            <p className="text-xs text-gray-400">
              Logged in as
            </p>

            <h3 className="font-semibold">
              Staff
            </h3>
          </div>

          <nav className="space-y-2">
            {menus.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-lg font-semibold">
              Staff Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              S
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;