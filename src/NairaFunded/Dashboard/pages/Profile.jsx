import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";

const Profile = () => {
  const navigate = useNavigate();
  const API_BASE = "https://fundednaira.ng/api/dashboard";

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
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      navigate("/auth");
      return;
    }

    fetch(`${API_BASE}/profile.php?user_id=${userId}`)
      .then((res) => res.text())
      .then((text) => {
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON:", text);
          setLoading(false);
          return;
        }

        if (!data.success) {
          console.error("Profile fetch failed:", data.message);
          setLoading(false);
          return;
        }

        const fetchedUser = data.user || {};

        setUser(fetchedUser);
        setProfileForm({
          full_name: fetchedUser.full_name || "",
          email: fetchedUser.email || "",
        });
        setPayment({
          bank_name: fetchedUser.bank_name || "",
          account_number: fetchedUser.account_number || "",
          account_name: fetchedUser.account_name || "",
        });

        localStorage.setItem("user", JSON.stringify(fetchedUser));
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

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
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
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
          ...profileForm,
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
      setMessage(data.message);
    } catch {
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
    } catch {
      setError("Server error. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const userId = getUserId();

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
      setMessage(data.message);
    } catch {
      setError("Server error. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex pt-16">
          <Sidebar />
          <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen text-white">
          {(message || error) && (
            <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
              <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">
                <div
                  className={`text-lg font-semibold mb-3 ${
                    error ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {error ? "Error" : "Success"}
                </div>

                <p className="text-gray-300 text-sm mb-5">{error || message}</p>

                <button
                  onClick={() => {
                    setMessage("");
                    setError("");
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-400 py-2 rounded-lg text-white font-medium hover:opacity-90"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold mb-10">Profile</h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
              {getInitials(user.name)}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <h2 className="text-lg font-semibold mb-5">Edit Profile</h2>

              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <input
                  type="text"
                  name="full_name"
                  value={user.name}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                  className="w-full bg-gray-800/60 p-3 rounded-xl"
                />

                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  className="w-full bg-gray-800/60 p-3 rounded-xl"
                />

                <button className="w-full bg-gradient-to-r from-blue-600 to-sky-400 py-3 rounded-xl">
                  Save Changes
                </button>
              </form>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <h2 className="text-lg font-semibold mb-5">Security</h2>

              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  name="current_password"
                  placeholder="Current Password"
                  value={password.current_password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-800/60 p-3 rounded-xl"
                />

                <input
                  type="password"
                  name="new_password"
                  placeholder="New Password"
                  value={password.new_password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-800/60 p-3 rounded-xl"
                />

                <button className="w-full bg-gradient-to-r from-blue-500 to-sky-400 py-3 rounded-xl">
                  Update Password
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-10">
            <h2 className="text-lg font-semibold mb-5">Payment Method</h2>

            <form onSubmit={handlePaymentSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bank_name"
                placeholder="Bank Name"
                value={payment.bank_name}
                onChange={handlePaymentChange}
                className="bg-gray-800/60 p-3 rounded-xl"
                required
              />

              <input
                type="text"
                name="account_number"
                placeholder="Account Number"
                value={payment.account_number}
                onChange={handlePaymentChange}
                className="bg-gray-800/60 p-3 rounded-xl"
                required
              />

              <input
                type="text"
                name="account_name"
                placeholder="Account Name"
                value={payment.account_name}
                onChange={handlePaymentChange}
                className="bg-gray-800/60 p-3 rounded-xl md:col-span-2"
                required
              />

              <p className="text-yellow-400 text-sm md:col-span-2">
                ⚠️ Account name must match your registered name
              </p>

              <button className="bg-gradient-to-r from-blue-500 to-sky-400 py-3 rounded-xl md:col-span-2">
                {user.bank_name || user.account_number || user.account_name
                  ? "Update Payment Method"
                  : "Save Payment Method"}
              </button>
            </form>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
            <h2 className="text-lg font-semibold mb-5">Saved Payment Method</h2>

            {user.bank_name || user.account_number || user.account_name ? (
              <div className="bg-gray-800/60 p-5 rounded-2xl border border-gray-700">
                <h3 className="font-semibold text-lg mb-2">{payment.bank_name}</h3>

                <p className="text-gray-400 text-sm">
                  Account No: <span className="text-white">{payment.account_number}</span>
                </p>

                <p className="text-gray-400 text-sm">
                  Name: <span className="text-white">{payment.account_name}</span>
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No payment method saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;