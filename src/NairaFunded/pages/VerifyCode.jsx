import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "https://api.fundednaira.ng/api/user";

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim() || !code.trim()) {
      setError("Email and verification code are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/verify_code.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Verification failed.");
        return;
      }

      setMessage(data.message || "Email verified successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch(`${API_BASE}/resend-verification.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Could not resend code.");
        return;
      }

      setMessage(data.message || "Verification code sent.");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] pt-28 text-white min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
          <p className="text-gray-400 text-center mt-2">
            Enter the 6-digit code sent to your email
          </p>

          {message && <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm">{message}</div>}
          {error && <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={handleVerify}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full p-3  rounded-lg bg-gray-900 border border-gray-800 focus:outline-none tracking-[0.3em] text-center"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary bg-sky-400 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Verify Code"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full mt-3 border border-white/10 py-3 rounded-lg font-medium hover:bg-white/5 transition disabled:opacity-60"
          >
            {resendLoading ? "Please wait..." : "Resend Code"}
          </button>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already verified? <Link to="/login" className="text-primary">Login</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default VerifyCode;