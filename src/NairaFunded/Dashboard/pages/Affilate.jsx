import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import TopSection from "../companent/TopSection";

const Affiliate = () => {
  const navigate = useNavigate();
  const API_BASE = "https://api.fundednaira.ng/api/dashboard";

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [claimed, setClaimed] = useState([]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [withdrawData, setWithdrawData] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    amount: "",
  });

  const [stats, setStats] = useState({
    invitedUsers: 0,
    accountEarned: 0,
    referralBalance: 0,
  });

  const rewards = [
    { id: 1, account: "₦200K Account", required: 5 },
    { id: 2, account: "₦400K Account", required: 10 },
    { id: 3, account: "₦600K Account", required: 15 },
    { id: 4, account: "₦800K Account", required: 20 },
  ];
   const [transactions, setTransactions] = useState([]);
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
          console.error(
            "Affiliate fetch failed:",
            data.message
          );
          return;
        }

        setReferralCode(
          data.affiliate?.referral_code || ""
        );

        setStats({
          invitedUsers:
            data.affiliate?.invitedUsers || 0,

          accountEarned:
            data.affiliate?.accountEarned || 0,

          referralBalance:
            data.affiliate?.referral_balance || 0,  
        });
        setTransactions(
        data.affiliate?.transactions || []
      );
        setClaimed(
          data.affiliate?.claimedRewards || []
        );
      })
      .catch((error) => {
        console.error(
          "Affiliate fetch error:",
          error
        );
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
      await navigator.clipboard.writeText(
        referralCode
      );

      setMessage(
        "Referral code copied successfully"
      );
    } catch {
      setError("Failed to copy referral code");
    }
  };

  const handleClaim = async (reward) => {
    const userId = getUserId();

    try {
      const res = await fetch(
        `${API_BASE}/claim-reward.php`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            reward_name: reward.account,
            reward_required:
              reward.required,
          }),
        }
      );

      const text = await res.text();

      const data = JSON.parse(text);

      if (!data.success) {
        setError(
          data.message ||
            "Failed to claim reward"
        );

        return;
      }

      setClaimed((prev) => [
        ...prev,
        reward.account,
      ]);

      setMessage(data.message);
    } catch {
      setError(
        "Server error. Please try again."
      );
    }
  };

 const handleWithdraw = async () => {
  const userId = getUserId();

  if (
    !withdrawData.account_name ||
    !withdrawData.account_number ||
    !withdrawData.bank_name ||
    !withdrawData.amount
  ) {
    setError("Please fill all fields");
    return;
  }

  if (Number(withdrawData.amount) > Number(stats.referralBalance)) {
    setError("Insufficient balance");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/request-withdrawal.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        account_name: withdrawData.account_name,
        account_number: withdrawData.account_number,
        bank_name: withdrawData.bank_name,
        amount: withdrawData.amount,
      }),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("RAW RESPONSE:", text);
      setError("Server returned invalid response");
      return;
    }

    if (!data.success) {
      setError(data.message || "Withdrawal failed");
      return;
    }

    setMessage("Withdrawal request submitted");

    setStats((prev) => ({
      ...prev,
      referralBalance:
        Number(prev.referralBalance) - Number(withdrawData.amount),
    }));

    setWithdrawData({
      account_name: "",
      account_number: "",
      bank_name: "",
      amount: "",
    });

    setShowWithdrawModal(false);
  } catch (err) {
    console.log(err);
    setError("Network error");
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
          <TopSection />
<<<<<<< HEAD
=======

>>>>>>> d5aea70 (Refaral Feature)
          {(message || error) && (
            <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
              <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">
                <div
                  className={`text-lg font-semibold mb-3 ${
                    error
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {error ? "Error" : "Success"}
                </div>

                <p className="text-gray-300 text-sm mb-5">
                  {error || message}
                </p>

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

          <h1 className="text-3xl font-bold mb-8">
            Affiliate Dashboard
          </h1>

          {/* Referral Code */}

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
            <h2 className="text-gray-400 mb-2">
              Your Referral Code
            </h2>

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

          {/* Stats */}

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">
                Invited Users
              </p>

              <h3 className="text-2xl font-bold">
                {stats.invitedUsers}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">
                Total Account Earned
              </p>

              <h3 className="text-2xl font-bold text-green-500">
                {stats.accountEarned}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">
                Referral Balance
              </p>

              <h3 className="text-2xl font-bold text-yellow-400">
                ₦{stats.referralBalance}
              </h3>

              <button
                onClick={() =>
                  setShowWithdrawModal(true)
                }
                className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
              >
                Request Withdrawal
              </button>
            </div>
          </div>

          {/* Rewards */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {rewards.map((reward) => {
              const isUnlocked =
                stats.invitedUsers >=
                reward.required;

              const isClaimed =
                claimed.includes(
                  reward.account
                );

              return (
                <div
                  key={reward.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3 className="text-lg font-semibold">
                    {reward.account}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Requires {reward.required} referrals
                  </p>

                  <div className="mt-4">
                    {isClaimed ? (
                      <span className="text-green-400 text-sm">
                        ✔ Claimed
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() =>
                          handleClaim(reward)
                        }
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        🔒 Locked
                      </span>
                    )}
                  </div>

                  <div className="mt-4 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (stats.invitedUsers /
                            reward.required) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Referral Transactions */}

<div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-10">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold">
        Referral Transactions
      </h2>

      <p className="text-gray-400 text-sm mt-1">
        All commissions earned from referrals
      </p>
    </div>
  </div>

  {transactions.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-800 text-gray-400">
          <tr>
            <th className="text-left py-3 px-4">
              Ref User
            </th>

            <th className="text-left py-3 px-4">
              Purchase
            </th>

            <th className="text-left py-3 px-4">
              Commission
            </th>

            <th className="text-left py-3 px-4">
              Status
            </th>

            <th className="text-left py-3 px-4">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-800 hover:bg-gray-800/40"
            >
              <td className="py-4 px-4">
                {item.referred_name}
              </td>

              <td className="py-4 px-4 text-blue-400 font-medium">
                ₦
                {Number(
                  item.purchase_amount
                ).toLocaleString()}
              </td>

              <td className="py-4 px-4 text-green-400 font-semibold">
                ₦
                {Number(
                  item.commission
                ).toLocaleString()}
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "paid"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="py-4 px-4 text-gray-400">
                {item.created_at}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-center py-10 text-gray-500">
      No referral transactions found
    </div>
  )}
</div>
        </div>
      </div>

      {/* Withdraw Modal */}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 w-[95%] max-w-md rounded-2xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Withdrawal Request
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Account Name"
                value={
                  withdrawData.account_name
                }
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    account_name:
                      e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Account Number"
                value={
                  withdrawData.account_number
                }
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    account_number:
                      e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Bank Name"
                value={
                  withdrawData.bank_name
                }
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    bank_name:
                      e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Amount"
                value={withdrawData.amount}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    amount: e.target.value,
                  })
                }
                className="w-full bg-gray-800 p-3 rounded-lg"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  setShowWithdrawModal(false)
                }
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleWithdraw}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Affiliate;
