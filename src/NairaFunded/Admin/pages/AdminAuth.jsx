import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "https://fundednaira.ng/api/admin/login.php";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // 🔥 store admin token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/auth/admin/dashboard");
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white px-4">

      {/* Center Modal */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">

        <h2 className="text-2xl font-bold text-center mb-2">
          Admin Login
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Access admin dashboard
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-400 py-3 rounded-lg font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminAuth;