import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "https://fundednaira.ng/api/user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim() || !code.trim() || !newPassword.trim()) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/reset_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Reset failed.");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] pt-28 text-white min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-gray-400 text-center mt-2">
            Enter the reset code and your new password
          </p>

          {message && (
            <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              placeholder="Reset Code"
              maxLength={6}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none tracking-[0.3em] text-center"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Back to{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;