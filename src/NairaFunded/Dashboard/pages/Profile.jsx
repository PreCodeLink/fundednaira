import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";

const Profile = () => {
  const navigate = useNavigate();
  const API_BASE = "https://api.fundednaira.net/api/dashboard";

  const [user, setUser] = useState({
    id: "",
    full_name: "",
    email: "",
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
  });

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });

  const [payment, setPayment] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) return null;

      const parsedUser = JSON.parse(rawUser);

      return parsedUser.id || parsedUser.user_id || null;
    } catch (err) {
      console.error("getUserId error:", err);
      return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const fetchProfile = async () => {
    const userId = getUserId();

    if (!userId) {
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profile.php?user_id=${userId}`);

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON:", text);
        return;
      }

      if (!data.success) {
        console.error("Profile fetch failed:", data.message);
        return;
      }

      const fetchedUser = data.user || {};

      const normalizedUser = {
        ...fetchedUser,
        full_name: fetchedUser.full_name || fetchedUser.name || "",
      };

      setUser(normalizedUser);

      setProfileForm({
        full_name: normalizedUser.full_name,
        email: normalizedUser.email || "",
      });

      setPayment({
        bank_name: normalizedUser.bank_name || "",
        account_number: normalizedUser.account_number || "",
        account_name: normalizedUser.account_name || "",
      });

      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const userId = getUserId();

    try {
      const res = await fetch(`${API_BASE}/update-profile.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          full_name: profileForm.full_name,
          email: profileForm.email,
        }),
      });

      const text = await res.text();

      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      const updatedUser = {
        ...user,
        full_name: profileForm.full_name,
        email: profileForm.email,
      };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage(data.message || "Profile updated successfully.");

      fetchProfile();
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const userId = getUserId();

    try {
      const res = await fetch(`${API_BASE}/change-password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          ...password,
        }),
      });

      const text = await res.text();

      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to update password.");
        return;
      }

      setMessage(data.message);

      setPassword({
        current_password: "",
        new_password: "",
      });
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const userId = getUserId();

    if (
      payment.account_name.trim().toLowerCase() !==
      profileForm.full_name.trim().toLowerCase()
    ) {
      setError("Account name must match your registered name.");

      return;
    }

    try {
      const res = await fetch(`${API_BASE}/save-payment-method.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          ...payment,
        }),
      });

      const text = await res.text();

      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to save payment method.");

        return;
      }

      const updatedUser = {
        ...user,
        bank_name: payment.bank_name,
        account_number: payment.account_number,
        account_name: payment.account_name,
      };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage(data.message || "Payment method updated successfully.");

      fetchProfile();
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30";

  if (loading) {
    return (
      <Layout>
        <div className="flex pt-16">
          <Sidebar />

          <div className="flex flex-1 items-center justify-center bg-[#05070D] text-[#38BDF8]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#38BDF8]/20 border-t-[#38BDF8]" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#5B6B82]">
                Loading profile
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="relative flex min-h-screen pt-16"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.12), transparent), #05070D",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Sidebar />

        <div className="relative z-10 mx-auto w-full flex-1 md:ml-72 space-y-6 p-4 text-[#F3EFE6] md:max-w-4xl md:p-6">
          {(message || error) && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B0F19]/95 p-6 text-center backdrop-blur-xl">
                <div
                  className={`mb-3 text-lg font-semibold ${
                    error ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {error ? "Error" : "Success"}
                </div>

                <p className="mb-5 text-sm text-[#93A0B4]">
                  {error || message}
                </p>

                <button
                  onClick={() => {
                    setMessage("");
                    setError("");
                  }}
                  className="w-full rounded-lg bg-[#38BDF8]/15 py-2 font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition hover:bg-[#38BDF8]/25"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#38BDF8]/70">
              Account
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
              Profile
            </h1>
          </div>

          {/* AVATAR HEADER */}
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#38BDF8]/50 bg-[#0F1A2E] font-serif text-2xl font-semibold text-[#38BDF8]">
              {getInitials(user.full_name)}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-[#F3EFE6]">
                {user.full_name}
              </h2>
              <p className="text-[#93A0B4]">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* EDIT PROFILE */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <h2 className="mb-5 text-lg font-semibold text-[#F3EFE6]">
                Edit Profile
              </h2>

              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <input
                  type="text"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                  className={inputClass}
                />

                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  className={inputClass}
                />

                <button className="w-full rounded-xl bg-[#38BDF8]/15 py-3 font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition-all duration-200 hover:bg-[#38BDF8]/25 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)]">
                  Save Changes
                </button>
              </form>
            </div>

            {/* SECURITY */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <h2 className="mb-5 text-lg font-semibold text-[#F3EFE6]">
                Security
              </h2>

              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  name="current_password"
                  placeholder="Current Password"
                  value={password.current_password}
                  onChange={handlePasswordChange}
                  className={inputClass}
                />

                <input
                  type="password"
                  name="new_password"
                  placeholder="New Password"
                  value={password.new_password}
                  onChange={handlePasswordChange}
                  className={inputClass}
                />

                <button className="w-full rounded-xl bg-[#38BDF8]/15 py-3 font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition-all duration-200 hover:bg-[#38BDF8]/25 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)]">
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* PAYMENT METHOD FORM */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-lg font-semibold text-[#F3EFE6]">
              Payment Method
            </h2>

            <form
              onSubmit={handlePaymentSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <input
                type="text"
                name="bank_name"
                placeholder="Bank Name"
                value={payment.bank_name}
                onChange={handlePaymentChange}
                className={inputClass}
                required
              />

              <input
                type="text"
                name="account_number"
                placeholder="Account Number"
                value={payment.account_number}
                onChange={handlePaymentChange}
                className={inputClass}
                required
              />

              <input
                type="text"
                name="account_name"
                placeholder="Account Name"
                value={payment.account_name}
                onChange={handlePaymentChange}
                className={`${inputClass} md:col-span-2`}
                required
              />

              <p className="text-sm text-amber-300 md:col-span-2">
                ⚠️ Account name must match your registered name
              </p>

              <button className="rounded-xl bg-emerald-400/15 py-3 font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 transition-all duration-200 hover:bg-emerald-400/25 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)] md:col-span-2">
                {user.bank_name || user.account_number || user.account_name
                  ? "Update Payment Method"
                  : "Save Payment Method"}
              </button>
            </form>
          </div>

          {/* SAVED PAYMENT METHOD */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-lg font-semibold text-[#F3EFE6]">
              Saved Payment Method
            </h2>

            {user.bank_name || user.account_number || user.account_name ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 font-mono text-sm">
                <h3 className="mb-2 text-lg font-semibold text-[#F3EFE6]">
                  {payment.bank_name}
                </h3>

                <p className="text-[#93A0B4]">
                  Account No:{" "}
                  <span className="text-[#F3EFE6]">
                    {payment.account_number}
                  </span>
                </p>

                <p className="text-[#93A0B4]">
                  Name:{" "}
                  <span className="text-[#F3EFE6]">
                    {payment.account_name}
                  </span>
                </p>
              </div>
            ) : (
              <p className="font-mono text-sm text-[#5B6B82]">
                No payment method saved yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;