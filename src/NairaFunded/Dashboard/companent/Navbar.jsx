import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      const parsedUser = JSON.parse(rawUser);
      return parsedUser.id || parsedUser.user_id || null;
    } catch (error) {
      console.error("getUserId error:", error);
      return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://api.fundednaira.ng/api/dashboard/index.php?user_id=${userId}`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);

          if (!data.success) return;

          setUser({
            name: data.user?.name || "User",
            email: data.user?.email || "",
          });

          localStorage.setItem("user", JSON.stringify(data.user));
        } catch {
          console.error("Invalid JSON:", text);
        }
      })
      .catch((err) => console.error("Navbar fetch error:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0B0F19] border-b border-gray-800 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          <span className="text-sky-400">Funded</span>Naira
        </Link>

        {/* RIGHT SIDE (PROFILE) */}
        <div className="relative">

          <button
            onClick={() => setDropdown(!dropdown)}
            className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {getInitials(user.name)}
            </div>

            {/* Name */}
            <span className="hidden sm:block text-white text-sm">
              {user.name}
            </span>

            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* DROPDOWN */}
          {dropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-gray-700 rounded-lg shadow-lg overflow-hidden">

              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>

              {/* Manage */}
              <button
                onClick={() => {
                  setDropdown(false);
                  navigate("/dashboard/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
              >
                Manage Profile
              </button>

              {/* Dashboard (optional) */}
              <button
                onClick={() => {
                  setDropdown(false);
                  navigate("/dashboard");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
              >
                Dashboard
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 text-sm"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
