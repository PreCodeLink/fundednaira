import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import TopSection from "../companent/TopSection";

const Affiliate = () => {
  const navigate = useNavigate();
  const API_BASE = "https://api.fundednaira.net/api/dashboard";

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [claimed, setClaimed] = useState([]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const referralLink = `https://www.fundednaira.net/auth?ref=${referralCode}`;

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
    { id: 1, account: "₦200K Account", size: "200000", required: 5 },
    { id: 2, account: "₦400K Account", size: "400000", required: 10 },
    { id: 3, account: "₦600K Account", size: "600000", required: 15 },
    { id: 4, account: "₦800K Account", size: "800000", required: 20 },
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
          console.error("Affiliate fetch failed:", data.message);
          return;
        }

        setReferralCode(data.affiliate?.referral_code || "");

        setStats({
          invitedUsers: data.affiliate?.invitedUsers || 0,
          accountEarned: data.affiliate?.accountEarned || 0,
          referralBalance: data.affiliate?.referral_balance || 0,
        });
        setTransactions(data.affiliate?.transactions || []);
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
      await navigator.clipboard.writeText(
        `https://www.fundednaira.net/auth?ref=${referralCode}`
      );

      setMessage("Referral link copied successfully");
    } catch {
      setError("Failed to copy referral link");
    }
  };

  const handleClaim = async (reward) => {
    const userId = getUserId();

    try {
      const res = await fetch(`${API_BASE}/claim-affiliate-account.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          size: reward.size,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setClaimed((prev) => [...prev, reward.account]);

      setMessage(data.message);

      if (data.status === "claimed") {
        setMessage(`Account claimed successfully.`);
      }
    } catch (err) {
      console.log(err);
      setError("Server error. Please try again.");
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

          <div className="flex flex-1 items-center justify-center bg-[#05070D] text-[#38BDF8]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#38BDF8]/20 border-t-[#38BDF8]" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#5B6B82]">
                Loading affiliate dashboard
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
          <TopSection />

          {/* ALERT MODAL */}
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
              Growth
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
              Affiliate Dashboard
            </h1>
          </div>

          {/* REFERRAL LINK */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
            <h2 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Your Referral Link
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={`https://www.fundednaira.net/auth?ref=${referralCode}`}
                readOnly
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-3 font-mono text-sm text-[#93A0B4] outline-none"
              />

              <button
                onClick={copyCode}
                className="rounded-lg bg-[#38BDF8]/15 px-5 py-3 text-sm font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition hover:bg-[#38BDF8]/25"
              >
                Copy
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Invited Users
              </p>
              <h3 className="mt-2 font-mono text-2xl font-semibold text-[#F3EFE6]">
                {stats.invitedUsers}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Total Account Earned
              </p>
              <h3 className="mt-2 font-mono text-2xl font-semibold text-emerald-300">
                {stats.accountEarned}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Referral Balance
              </p>
              <h3 className="mt-2 font-mono text-2xl font-semibold text-amber-300">
                ₦{stats.referralBalance}
              </h3>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="mt-4 rounded-lg bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 transition hover:bg-emerald-400/25"
              >
                Request Withdrawal
              </button>
            </div>
          </div>

          {/* REWARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rewards.map((reward) => {
              const isUnlocked = stats.invitedUsers >= reward.required;
              const isClaimed = claimed.includes(reward.account);

              return (
                <div
                  key={reward.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
                >
                  <h3 className="text-base font-semibold text-[#F3EFE6]">
                    {reward.account}
                  </h3>

                  <p className="mt-2 text-xs text-[#93A0B4]">
                    Requires {reward.required} referrals
                  </p>

                  <div className="mt-4">
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                        ✔ Claimed
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleClaim(reward)}
                        className="rounded-lg bg-emerald-400/15 px-4 py-2 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 transition hover:bg-emerald-400/25"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-xs text-[#5B6B82]">🔒 Locked</span>
                    )}
                  </div>

                  <div className="mt-4 h-1.5 rounded-full bg-white/[0.06]">
                    <div
                      className="h-1.5 rounded-full bg-[#38BDF8] transition-all"
                      style={{
                        width: `${Math.min(
                          (stats.invitedUsers / reward.required) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* TRANSACTIONS */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="border-b border-white/[0.06] px-5 py-4 md:px-6">
              <h2 className="text-lg font-semibold text-[#F3EFE6]">
                Referral Transactions
              </h2>
              <p className="mt-1 text-sm text-[#93A0B4]">
                All commissions earned from referrals
              </p>
            </div>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                      <th className="px-4 py-3 md:px-6">Ref User</th>
                      <th className="px-4 py-3">Purchase</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-4 text-[#F3EFE6] md:px-6">
                          {item.referred_name}
                        </td>

                        <td className="px-4 py-4 font-mono font-medium text-[#38BDF8]">
                          ₦{Number(item.purchase_amount).toLocaleString()}
                        </td>

                        <td className="px-4 py-4 font-mono font-semibold text-emerald-300">
                          ₦{Number(item.commission).toLocaleString()}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              item.status === "paid"
                                ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                                : "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-mono text-[#93A0B4]">
                          {item.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center font-mono text-xs text-[#5B6B82]">
                No referral transactions found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19]/95 p-6 text-[#F3EFE6] backdrop-blur-xl">
            <h2 className="mb-6 font-serif text-xl font-semibold tracking-tight">
              Withdrawal Request
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Account Name"
                value={withdrawData.account_name}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    account_name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30"
              />

              <input
                type="number"
                placeholder="Account Number"
                value={withdrawData.account_number}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    account_number: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30"
              />

              <input
                type="text"
                placeholder="Bank Name"
                value={withdrawData.bank_name}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    bank_name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30"
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
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-[#93A0B4] transition hover:bg-white/[0.06] hover:text-[#F3EFE6]"
              >
                Cancel
              </button>

              <button
                onClick={handleWithdraw}
                className="flex-1 rounded-xl bg-emerald-400/15 py-3 font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 transition hover:bg-emerald-400/25"
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