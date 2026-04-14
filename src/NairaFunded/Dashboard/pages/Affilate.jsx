import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";

const Affiliate = () => {
  const navigate = useNavigate();
  const API_BASE = "https://api.fundednaira.ng/api/dashboard";

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [claimed, setClaimed] = useState([]);

  const [stats, setStats] = useState({
    invitedUsers: 0,
    accountEarned: 0,
  });

  const rewards = [
    { id: 1, account: "₦200K Account", required: 5 },
    { id: 2, account: "₦400K Account", required: 10 },
    { id: 3, account: "₦600K Account", required: 15 },
    { id: 4, account: "₦800K Account", required: 20 },
  ];

  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      const user = JSON.parse(rawUser);
      return user.id || user.user_id || null;
    } catch (error) {
      console.error("getUserId error:", error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();

    if (!userId) {
      navigate("/auth");
      return;
    }

    fetch(`${API_BASE}/affiliate.php?user_id=${userId}`)
      .then((res) => res.text())
      .then((text) => {
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON:", text);
          return;
        }

        if (!data.success) {
          console.error("Affiliate fetch failed:", data.message);
          return;
        }

        setReferralCode(data.affiliate?.referral_code || "");
        setStats({
          invitedUsers: data.affiliate?.invitedUsers || 0,
          accountEarned: data.affiliate?.accountEarned || 0,
        });
        setClaimed(data.affiliate?.claimedRewards || []);
      })
      .catch((error) => {
        console.error("Affiliate fetch error:", error);
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
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const copyCode = async () => {
    if (!referralCode) {
      setError("Referral code not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralCode);
      setMessage("Referral code copied successfully");
    } catch {
      setError("Failed to copy referral code");
    }
  };

  const handleClaim = async (reward) => {
    const userId = getUserId();

    try {
      const res = await fetch(`${API_BASE}/claim-reward.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          reward_name: reward.account,
          reward_required: reward.required,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to claim reward");
        return;
      }

      setClaimed((prev) => [...prev, reward.account]);
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
          <div className="flex-1 p-6 md:p-10 bg-gray-950 min-h-screen text-white flex items-center justify-center">
            Loading affiliate dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 bg-gray-950 min-h-screen text-white">
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

          <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-10">
            <h2 className="text-gray-400 mb-2">Your Referral Code</h2>

            <div className="flex gap-3">
              <input
                value={referralCode}
                readOnly
                className="flex-1 bg-gray-800 p-3 rounded-lg"
              />
              <button
                onClick={copyCode}
                className="bg-blue-600 px-5 rounded-lg hover:bg-blue-700 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">Invited Users</p>
              <h3 className="text-2xl font-bold">{stats.invitedUsers}</h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">Total Account Earned</p>
              <h3 className="text-2xl font-bold text-green-500">
                {stats.accountEarned}
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {rewards.map((reward) => {
              const isUnlocked = stats.invitedUsers >= reward.required;
              const isClaimed = claimed.includes(reward.account);

              return (
                <div
                  key={reward.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3 className="text-lg font-semibold">{reward.account}</h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Requires {reward.required} referrals
                  </p>

                  <div className="mt-4">
                    {isClaimed ? (
                      <span className="text-green-400 text-sm">✔ Claimed</span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleClaim(reward)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">🔒 Locked</span>
                    )}
                  </div>

                  <div className="mt-4 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (stats.invitedUsers / reward.required) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Affiliate;