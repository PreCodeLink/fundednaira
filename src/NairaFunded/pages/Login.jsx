import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "https://api.fundednaira.ng/api/user";

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
        setError(rawText || "PHP did not return valid JSON");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Request failed.");
        return;
      }

      if (!data.success) {
        if (data.email_not_verified) {
          navigate("/verify-code", {
            state: { email: formData.email },
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
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Login successful.");

      setTimeout(() => {
        if (String(data.user?.role || "").toLowerCase() === "admin") {
          navigate("/auth/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 800);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] pt-28 text-white min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-primary opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

        <div className="relative w-full max-w-md bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

          <p className="text-gray-400 text-center mt-2">
            Login to access your dashboard
          </p>

          {message && (
            <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm break-words">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/auth" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Login;