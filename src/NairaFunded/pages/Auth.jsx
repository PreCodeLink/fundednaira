import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          referral_code: formData.referral_code,
        }),
      });

      const rawText = await response.text();
      console.log("RAW REGISTER RESPONSE:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        setError(rawText || "PHP did not return valid JSON");
        return;
      }

      if (!data.success) {
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/verify-code", {
          state: { email: formData.email },
        });
      }, 1200);
    } catch (err) {
      console.error("REGISTER FETCH ERROR:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] pt-28 text-white min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          <p className="text-gray-400 text-center mt-2">
            Join and start your trading journey
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

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

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

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <input
              type="text"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              placeholder="Referral Code (Optional)"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-400 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Register;