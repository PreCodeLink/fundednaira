import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, LockKeyhole, Mail } from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "https://api.fundednaira.net/api/admin/login.php";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/auth/admin/dashboard");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-sky-500/10 blur-[120px] rounded-full" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-[#0B0F19]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* Logo / Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">

              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 rounded-2xl" />

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-lg">
                <ShieldCheck size={32} strokeWidth={2.2} />
              </div>

            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              FundedNaira
            </h1>

            <p className="text-blue-400 text-sm font-medium mt-1">
              ADMIN PORTAL
            </p>

            <p className="text-gray-500 text-sm mt-3">
              Securely access your administration dashboard
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="admin@fundednaira.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#070A11] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-[#070A11] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-500 hover:to-sky-300 transition-all duration-200 font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                "Sign In"
              )}

            </button>

          </form>

          {/* Security Notice */}
          <div className="mt-7 pt-6 border-t border-white/10">

            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
              <LockKeyhole size={14} />
              <span>Protected admin environment</span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} FundedNaira. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default AdminAuth;