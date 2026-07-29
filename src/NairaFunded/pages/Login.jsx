import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  LogIn,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const API_BASE = "https://api.fundednaira.net/api/user";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    resetMessages();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const rawText = await response.text();

      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        setError(rawText || "Invalid server response.");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Request failed.");
        return;
      }

      if (!data.success) {
        if (data.email_not_verified) {
          navigate("/verify-code", {
            state: {
              email: formData.email,
            },
          });

          return;
        }

        setError(data.message || "Login failed.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Login successful.");

      setTimeout(() => {
        if (
          String(data.user?.role || "").toLowerCase() ===
          "admin"
        ) {
          navigate("/auth/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (err) {
      console.log(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6 py-24">

        {/* Background */}

        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[140px]"></div>

        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[120px]"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,.08),transparent_60%)]"></div>

        {/* Card */}

        <div className="relative w-full max-w-lg">

          <div className="absolute inset-0 rounded-[36px] bg-gradient-to-r from-sky-500 to-cyan-500 opacity-20 blur-3xl"></div>

          <div className="relative rounded-[36px] border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">

            {/* Icon */}

            <div className="flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-xl">

                <LogIn
                  size={38}
                  className="text-white"
                />

              </div>

            </div>

            {/* Heading */}

            <div className="mt-8 text-center">

              <h1 className="text-4xl font-black text-white">
                Welcome Back
              </h1>

            </div>

            {/* Success */}

            {message && (
              <div className="mt-8 flex gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">

                <CheckCircle2 className="shrink-0 text-green-400" />

                <p className="text-sm text-green-300">
                  {message}
                </p>

              </div>
            )}

            {/* Error */}

            {error && (
              <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

                <p className="break-words text-sm text-red-300">
                  {error}
                </p>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
                            {/* Email */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-4 text-white placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm text-slate-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-14 text-white placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={18}
                      className="text-sky-400"
                    />

                    <span className="text-sm text-slate-300">
                      Secure encrypted login
                    </span>

                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    Protected
                  </span>

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn
                      size={20}
                      className="transition group-hover:translate-x-1"
                    />
                    Login to Dashboard
                  </>
                )}
              </button>

            </form>

            {/* Divider */}

            <div className="relative my-8">

              <div className="border-t border-white/10"></div>

              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050816] px-4 py-1 text-xs uppercase tracking-widest text-slate-500">
                Secure Access
              </span>

            </div>

            {/* Register */}

            <div className="text-center">

              <p className="text-slate-400">
                Don't have an account?
              </p>

              <Link
                to="/auth"
                className="mt-4 inline-flex items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-3 font-semibold text-sky-400 transition hover:border-sky-400 hover:bg-sky-500/20 hover:text-white"
              >
                Create Free Account
              </Link>

            </div>

            {/* Footer */}

            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="flex items-center justify-center gap-2">

                <ShieldCheck
                  size={18}
                  className="text-green-400"
                />

                <span className="text-sm text-slate-500">
                  Protected with encrypted authentication
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </Layout>
  );
};

export default Login;