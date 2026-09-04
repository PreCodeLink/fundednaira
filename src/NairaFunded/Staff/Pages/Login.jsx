import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Activity,
} from "lucide-react";

const StaffLogin = () => {
  const navigate = useNavigate();

  const API_BASE = "https://api.fundednaira.net/api/Staff";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/staff_login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Server request failed");
      }

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token || !data.staff) {
        setError("Invalid server response. Please contact support.");
        return;
      }

      localStorage.setItem("staff_token", data.token);

      localStorage.setItem(
        "staff",
        JSON.stringify(data.staff)
      );

      const role = String(
        data.staff.role || ""
      ).toLowerCase();

      switch (role) {
        case "ua":
          navigate("/staff/dashboard");
          break;

        case "mp":
          navigate("/staff/dashboard2");
          break;

        case "mp2":
          navigate("/staff/dashboard/pr2");
          break;

        case "pr":
          navigate("/staff/dashboard/prw");
          break;
        case "ps":
          navigate("/staff/dashboard/ps");
          break;

        default:
          localStorage.removeItem("staff_token");
          localStorage.removeItem("staff");
          setError("Your staff account has no valid role.");
      }
    } catch (error) {
      console.error("Staff login error:", error);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background effects */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      </div>


      {/* Login Card */}

      <div className="relative w-full max-w-md">

        {/* Brand */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5 shadow-lg shadow-blue-500/5">

            <Activity
              size={27}
              className="text-blue-400"
            />

          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            FundedNaira
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2">

            <span className="h-px w-6 bg-gray-700" />

            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Staff Portal
            </span>

            <span className="h-px w-6 bg-gray-700" />

          </div>

        </div>


        {/* Card */}

        <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">

          {/* Top security banner */}

          <div className="px-6 sm:px-8 py-4 border-b border-white/[0.06] bg-white/[0.015]">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">

                <ShieldCheck
                  size={17}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-xs font-medium text-white">
                  Secure Staff Access
                </p>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  Authorized personnel only
                </p>

              </div>

              <div className="ml-auto flex items-center gap-1.5">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-[10px] text-gray-600">
                  Secure
                </span>

              </div>

            </div>

          </div>


          <div className="p-6 sm:p-8">

            <div className="mb-7">

              <h2 className="text-xl font-semibold">
                Welcome back
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Sign in to manage your staff workspace.
              </p>

            </div>


            {/* Error */}

            {error && (

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5">

                <div className="mt-0.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />

                <p className="text-xs leading-5 text-red-300">
                  {error}
                </p>

              </div>

            )}


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="staff@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 text-sm text-white placeholder:text-gray-700 outline-none transition focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/[0.06] disabled:opacity-50"
                  />

                </div>

              </div>


              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-gray-400">
                    Password
                  </label>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-12 text-sm text-white placeholder:text-gray-700 outline-none transition focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/[0.06] disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition disabled:opacity-40"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* Login button */}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Staff Portal

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </form>


            {/* Footer security */}

            <div className="mt-7 pt-5 border-t border-white/[0.06]">

              <div className="flex items-center justify-center gap-2">

                <LockKeyhole
                  size={12}
                  className="text-gray-700"
                />

                <p className="text-[10px] text-gray-600 text-center">
                  Your credentials are protected by secure authentication.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Bottom */}

        <p className="text-center text-[11px] text-gray-700 mt-6">
          © {new Date().getFullYear()} FundedNaira. Staff access only.
        </p>

      </div>

    </div>
  );
};

export default StaffLogin;