import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Layout from "../layout/Layout";

import {
  User,
  Mail,
  Lock,
  Gift,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const referralFromUrl = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: referralFromUrl,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const API_BASE = "https://api.fundednaira.net/api/user";

  useEffect(() => {
    if (referralFromUrl) {
      setFormData((prev) => ({
        ...prev,
        referral_code: referralFromUrl,
      }));
    }
  }, [referralFromUrl]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordStrength = () => {
    const pass = formData.password;

    if (pass.length < 6)
      return {
        text: "Weak",
        color: "bg-red-500",
      };

    if (
      pass.length >= 6 &&
      /[A-Z]/.test(pass) &&
      /\d/.test(pass)
    )
      return {
        text: "Strong",
        color: "bg-green-500",
      };

    return {
      text: "Medium",
      color: "bg-yellow-500",
    };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.full_name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/register.php`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            referral_code:
              formData.referral_code,
          }),
        }
      );

      const rawText =
        await response.text();

      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        setError(
          rawText ||
            "Server returned invalid response."
        );
        return;
      }

      if (!data.success) {
        setError(
          data.message ||
            "Registration failed."
        );
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/verify-code", {
          state: {
            email: formData.email,
          },
        });
      }, 1500);
    } catch (err) {
      console.log(err);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center px-6 py-24">

        {/* Background Glow */}

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-sky-500/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,.08),transparent_60%)]"></div>

        {/* Card */}

        <div className="relative w-full max-w-lg">

          <div className="absolute inset-0 rounded-[34px] bg-gradient-to-r from-sky-500 to-cyan-500 blur-2xl opacity-20"></div>

          <div className="relative rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl">

            {/* Logo */}

            <div className="flex justify-center">

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-xl">

                <ShieldCheck
                  size={42}
                  className="text-white"
                />

              </div>

            </div>

            {/* Heading */}

            <div className="text-center mt-8">

              <h1 className="text-3xl font-black text-white">

                Create Account

              </h1>


            </div>

            {/* Success */}

            {message && (
              <div className="mt-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 flex gap-3">

                <CheckCircle2 className="text-green-400 shrink-0" />

                <p className="text-green-300 text-sm">

                  {message}

                </p>

              </div>
            )}

            {/* Error */}

            {error && (
              <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

                <p className="text-red-300 text-sm">

                  {error}

                </p>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
                            {/* Full Name */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0B1220] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
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
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0B1220] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full pl-12 pr-14 py-4 rounded-2xl bg-[#0B1220] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

                {/* Password Strength */}

                <div className="mt-3">

                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

                    <div
                      className={`h-full rounded-full ${strength.color}`}
                      style={{
                        width:
                          strength.text === "Weak"
                            ? "35%"
                            : strength.text === "Medium"
                            ? "65%"
                            : "100%",
                      }}
                    ></div>

                  </div>

                  <p className="mt-2 text-xs text-slate-400">

                    Password Strength:
                    <span className="ml-2 font-semibold text-white">
                      {strength.text}
                    </span>

                  </p>

                </div>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-12 pr-14 py-4 rounded-2xl bg-[#0B1220] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* Referral Code */}

              <div>

                <label className="text-sm text-slate-300 mb-2 block">
                  Referral Code
                </label>

                <div className="relative">

                  <Gift
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    name="referral_code"
                    value={formData.referral_code}
                    onChange={handleChange}
                    readOnly={!!referralFromUrl}
                    placeholder="Optional"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0B1220] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition disabled:opacity-70"
                  />

                </div>

              </div>
                            {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2
                        size={18}
                        className="transition group-hover:translate-x-1"
                      />
                    </>
                  )}
                </span>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-1000 group-hover:translate-x-full"></div>
              </button>

              {/* Divider */}

              <div className="relative py-2">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[#050816] px-4 text-xs uppercase tracking-widest text-slate-500">
                    Already Registered?
                  </span>
                </div>

              </div>

              {/* Login */}

              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-4 font-medium text-white transition hover:border-sky-400 hover:bg-sky-500/10"
              >
                Login Instead
              </Link>

            </form>

          </div>

        </div>

      </section>

    </Layout>
  );
};

export default Register;