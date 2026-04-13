import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
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
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://fundednaira.ng/api/dashboard/index.php?user_id=${userId}`)
      .then((res) => res.text())
      .then((text) => {
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON:", text);
          return;
        }

        if (!data.success) {
          console.error("Navbar fetch failed:", data.message);
          return;
        }

        setUser({
          name: data.user?.name || "User",
          email: data.user?.email || "",
        });

        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch((error) => {
        console.error("Navbar fetch error:", error);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0B0F19] border-b border-gray-800 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-white">
          <span className="text-sky-400">Funded</span>Naira
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-300">
          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link to="/dashboard/acc" className="hover:text-white">
            Accounts
          </Link>
          <Link to="/dashboard/payouts" className="hover:text-white">
            Payouts
          </Link>
          <Link to="/dashboard/affiliate" className="hover:text-white">
            Affiliate
          </Link>

          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.name)}
              </div>
              <span>{user.name}</span>
              <ChevronDown size={16} />
            </button>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-gray-700 rounded-lg shadow-lg">
                <Link
                  to="/dashboard/profile"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0B0F19] border-t border-gray-800 px-4 py-4 space-y-3 text-gray-300">
          <Link to="/dashboard" className="block">
            Dashboard
          </Link>
          <Link to="/dashboard/acc" className="block">
            Accounts
          </Link>
          <Link to="/dashboard/payouts" className="block">
            Payouts
          </Link>
          <Link to="/dashboard/affiliate" className="block">
            Affiliate
          </Link>

          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            <Link to="/dashboard/profile" className="block mt-2">
              Profile
            </Link>
            <button onClick={handleLogout} className="block mt-2 text-red-400">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;