import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const API_BASE = "https://api.fundednaira.net/api/user";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/forgot_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Request failed.");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1200);

    } catch {
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

                <KeyRound
                  size={38}
                  className="text-white"
                />

              </div>

            </div>

            {/* Heading */}

            <div className="mt-8 text-center">

              <h1 className="text-4xl font-black text-white">
                Forgot Password?
              </h1>

              <p className="mt-3 text-slate-400 leading-7">
                Enter your registered email address and we'll send
                you a password reset verification code.
              </p>

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

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

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
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-4 text-white placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                  />

                </div>

              </div>

              {/* Security */}

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-sky-400"
                  />

                  <span className="text-sm text-slate-300">
                    Secure password recovery
                  </span>

                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Protected
                </span>

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition hover:-translate-y-1 hover:shadow-sky-500/40 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Sending Code...
                  </>
                ) : (
                  <>
                    <KeyRound size={20} />
                    Send Reset Code
                  </>
                )}
              </button>

            </form>

            {/* Divider */}

            <div className="relative my-8">

              <div className="border-t border-white/10"></div>

              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050816] px-4 py-1 text-xs uppercase tracking-widest text-slate-500">
                Account Recovery
              </span>

            </div>

            {/* Back */}

            <div className="text-center">

              <p className="text-slate-400">
                Remember your password?
              </p>

              <Link
                to="/login"
                className="mt-4 inline-flex items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-3 font-semibold text-sky-400 transition hover:border-sky-400 hover:bg-sky-500/20 hover:text-white"
              >
                Back to Login
              </Link>

            </div>

          </div>

        </div>

      </section>
    </Layout>
  );
};

export default ForgotPassword;