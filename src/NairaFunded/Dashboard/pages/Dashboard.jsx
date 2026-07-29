import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import TopSection from "../companent/TopSection";
import { TrendingUp, CheckCircle2, AlertCircle, X } from "lucide-react";

// Scale-up ladder: challenge accounts move up a tier after enough payouts
const SIZE_LADDER = [100000, 200000, 400000, 800000];
const PAYOUTS_REQUIRED_FOR_UPGRADE = 3;

const parseSize = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const clean = String(value).replace(/[^0-9.]/g, "");
  const number = Number(clean);
  return Number.isNaN(number) ? 0 : number;
};

const getNextSize = (currentSize) => {
  const index = SIZE_LADDER.findIndex((size) => size === currentSize);
  if (index === -1 || index === SIZE_LADDER.length - 1) return null;
  return SIZE_LADDER[index + 1];
};

const formatSize = (value) => `₦${Number(value || 0).toLocaleString()}`;

// 3-step payout tracker for a single challenge account
const PayoutTracker = ({ completed }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: PAYOUTS_REQUIRED_FOR_UPGRADE }).map((_, i) => {
      const done = i < completed;
      return (
        <div key={i} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              done
                ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/40"
                : "bg-white/[0.05] text-[#5B6B82] ring-1 ring-inset ring-white/10"
            }`}
          >
            {done ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          {i < PAYOUTS_REQUIRED_FOR_UPGRADE - 1 && (
            <div
              className={`h-[2px] flex-1 rounded-full ${
                i < completed - 1 ? "bg-emerald-400/50" : "bg-white/[0.08]"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_accounts: 0,
    total_payout: "₦0",
    total_referrals: 0,
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradingId, setUpgradingId] = useState(null);
  const [message, setMessage] = useState({ show: false, type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text });
    setTimeout(() => setMessage({ show: false, type: "", text: "" }), 3000);
  };

  const formatMoney = (value) => {
    const number = Number(value || 0);
    return `₦${number.toLocaleString()}`;
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!rawUser || !token) {
      navigate("/auth");
      return;
    }

    let savedUser = null;

    try {
      savedUser = JSON.parse(rawUser);
    } catch (error) {
      console.error("Invalid user in localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    if (!savedUser?.id) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    setUser(savedUser);

    fetch(
      `https://api.fundednaira.net/api/dashboard/dashboard.php?user_id=${savedUser.id}`
    )
      .then((res) => res.text())
      .then((text) => {
        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON:", text);
          setLoading(false); // changed: do not redirect
          return;
        }

        if (!data.success) {
          console.error("Dashboard error:", data.message);
          setLoading(false); // changed: do not redirect
          return;
        }

        setStats({
          total_accounts: data.stats?.total_accounts || 0,
          total_payout: formatMoney(data.stats?.total_payout || 0),
          total_referrals: data.stats?.total_referrals || 0,
        });
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard fetch error:", error);
        setLoading(false); // changed: do not redirect
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  // Request a size upgrade for a challenge account that hit its payout target
  const requestUpgrade = async (acc) => {
    if (!user?.id) {
      showMessage("error", "User not logged in");

      return;
    }

    const currentSize = parseSize(acc.size);
    const nextSize = getNextSize(currentSize);

    if (!nextSize) {
      showMessage("error", "This account has no further upgrade tier");
      return;
    }

    try {
      setUpgradingId(acc.id);

      const res = await fetch(
        "https://api.fundednaira.net/api/dashboard/request-account-upgrade.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            account_id: acc.id,
            current_size: currentSize,
            requested_size: nextSize,
          }),
        }
      );

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid upgrade response:", text);
        showMessage("error", "Invalid server response");
        return;
      }

      if (!data.success) {
        showMessage("error", data.message || "Failed to request upgrade");
        return;
      }

      showMessage("success", data.message || "Upgrade request submitted");
      setAccounts((prev) =>
  prev.map((item) =>
    item.id === acc.id
      ? {
          ...item,
          upgrade_request_id: data.request_id,
          upgrade_status: "Pending",
          requested_size: nextSize,
        }
      : item
  )
);
    } catch (error) {
      console.error("requestUpgrade error:", error);
      showMessage("error", "Server error while requesting upgrade");
    } finally {
      setUpgradingId(null);
    }
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-[#05070D] text-[#38BDF8]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#38BDF8]/20 border-t-[#38BDF8]" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#5B6B82]">
              Loading dashboard
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const statusStyles = {
    active: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
    pending: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
  };

  // Only challenge-type accounts get scaled up via payouts and active
const challengeAccounts = accounts.filter((acc) => {
  const type = String(acc.type || "").toLowerCase();
  const status = String(acc.status || "").toLowerCase();

  return type === "challenge" && status === "active";
});
  return (
    <Layout>
      <div
        className="relative flex min-h-screen pt-16"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.12), transparent), #05070D",
        }}
      >
        {/* faint grid mesh backdrop */}
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

          {/* TOAST */}
          {message.show && (
            <div className="fixed right-5 top-5 z-[100]">
              <div
                className={`flex min-w-[300px] max-w-[420px] items-start gap-3 rounded-2xl border px-4 py-4 backdrop-blur-xl ${
                  message.type === "success"
                    ? "border-emerald-400/30 bg-[#0B0F19]/95 text-emerald-200"
                    : "border-red-400/30 bg-[#0B0F19]/95 text-red-200"
                }`}
              >
                <div className="mt-0.5">
                  {message.type === "success" ? (
                    <CheckCircle2 size={20} className="text-emerald-300" />
                  ) : (
                    <AlertCircle size={20} className="text-red-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold">
                    {message.type === "success" ? "Success" : "Error"}
                  </h4>
                  <p className="text-sm text-[#93A0B4]">{message.text}</p>
                </div>
                <button
                  onClick={() =>
                    setMessage({ show: false, type: "", text: "" })
                  }
                  className="text-[#5B6B82] transition hover:text-[#F3EFE6]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#38BDF8]/70">
                Overview
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                Dashboard
              </h1>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:border-[#38BDF8]/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.12)] md:p-5">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#38BDF8]/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Total Accounts
              </p>
              <h2 className="relative mt-2 font-mono text-2xl font-semibold text-[#F3EFE6] md:text-3xl">
                {stats.total_accounts}
              </h2>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(52,211,153,0.12)] md:p-5">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
              <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Total Payout
              </p>
              <h2 className="relative mt-2 font-mono text-2xl font-semibold text-emerald-300 md:text-3xl">
                {stats.total_payout}
              </h2>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.12)] md:p-5">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />
              <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                Total Referrals
              </p>
              <h2 className="relative mt-2 font-mono text-2xl font-semibold text-violet-300 md:text-3xl">
                {stats.total_referrals}
              </h2>
            </div>
          </div>

          {/* CHALLENGE ACCOUNT PAYOUT TRACK + UPGRADE */}
          {challengeAccounts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F3EFE6]">
                Challenge Account Scale-Up
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {challengeAccounts.map((acc) => {
                  const completed = Math.min(
                    Number(acc.payouts_completed || 0),
                    PAYOUTS_REQUIRED_FOR_UPGRADE
                  );
                  const currentSize = parseSize(acc.size);
                  const nextSize = getNextSize(currentSize);
                  const eligible =
                    completed >= PAYOUTS_REQUIRED_FOR_UPGRADE && nextSize;
                  const isUpgrading = Number(upgradingId) === Number(acc.id);
                  const hasRequest = !!acc.upgrade_request_id;

                    const requestStatus = String(
                    acc.upgrade_status || ""
                    ).toLowerCase();

                    const isPending = requestStatus === "pending";
                    const isApproved = requestStatus === "approved";
                    const isRejected = requestStatus === "rejected";

                  return (
                    <div
                      key={acc.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-[#38BDF8]" />
                          <p className="text-sm font-semibold text-[#F3EFE6]">
                            Account #{acc.id}
                          </p>
                        </div>
                        <p className="font-mono text-xs text-[#5B6B82]">
                          {currentSize ? formatSize(currentSize) : "N/A"}
                          {nextSize && (
                            <>
                              {" "}
                              <span className="text-[#38BDF8]">
                                → {formatSize(nextSize)}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                        Payouts {completed}/{PAYOUTS_REQUIRED_FOR_UPGRADE}
                      </p>

                      <PayoutTracker completed={completed} />
                      {hasRequest && (
  <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
    <p className="text-xs text-[#93A0B4]">
      Upgrade Status
    </p>

    <p
      className={`mt-1 font-semibold ${
        isPending
          ? "text-amber-300"
          : isApproved
          ? "text-emerald-300"
          : isRejected
          ? "text-red-300"
          : "text-[#F3EFE6]"
      }`}
    >
      {acc.upgrade_status}
    </p>

    {acc.requested_size && (
      <p className="mt-1 text-xs text-[#5B6B82]">
        Requested Size: {formatSize(acc.requested_size)}
      </p>
    )}
  </div>
)}

                      <button
                        onClick={() => requestUpgrade(acc)}
                        disabled={
    !eligible ||
    isUpgrading ||
    isPending ||
    isApproved
}
                        className={`mt-4 w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                          isPending
? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30 cursor-not-allowed"

: isApproved
? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 cursor-not-allowed"

: eligible
? "bg-[#38BDF8]/15 text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 hover:bg-[#38BDF8]/25"

: "cursor-not-allowed bg-white/[0.03] text-[#5B6B82] ring-1 ring-inset ring-white/10"
                        }`}
                      >
                        {
isUpgrading
? "Requesting..."

: isPending
? "Upgrade Request Pending"

: isApproved
? "Upgrade Approved"

: nextSize
? `Request Upgrade to ${formatSize(nextSize)}`
: "Maximum Tier Reached"
}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACCOUNTS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 md:px-6">
              <h2 className="text-sm font-semibold text-[#F3EFE6] md:text-base">
                My Trading Accounts
              </h2>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                {accounts.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                    <th className="px-4 py-3 md:px-6">Account ID</th>
                    <th className="px-4 py-3">Login</th>
                    <th className="px-4 py-3">Server</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {accounts.length > 0 ? (
                    accounts.map((acc, i) => {
                      const statusKey = String(acc.status).toLowerCase();
                      const isActive = statusKey === "active";
                      return (
                        <tr
                          key={i}
                          className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3 font-mono text-[#F3EFE6] md:px-6">
                            {acc.id}
                          </td>
                          <td className="px-4 py-3 font-mono text-[#93A0B4]">
                            {acc.login || "Not Assigned"}
                          </td>
                          <td className="px-4 py-3 text-[#93A0B4]">
                            {acc.server || "Not Assigned"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${
                                statusStyles[statusKey] ||
                                "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/30"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive
                                    ? "animate-pulse bg-emerald-400"
                                    : statusKey === "pending"
                                    ? "bg-amber-400"
                                    : "bg-red-400"
                                }`}
                              />
                              {acc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center font-mono text-xs text-[#5B6B82]"
                      >
                        No accounts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
