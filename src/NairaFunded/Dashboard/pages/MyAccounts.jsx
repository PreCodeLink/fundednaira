import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Activity,
  TrendingUp,
} from "lucide-react";
import TopSection from "../companent/TopSection";

const statusStyles = {
  active: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
  pending: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
};

const PHASE_STEPS = ["1", "2", "funded"];

const parseNumeric = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const clean = String(value).replace(/[^0-9.-]/g, "");
  const number = Number(clean);
  return Number.isNaN(number) ? 0 : number;
};

// Step indicator for Challenge accounts — Phase 1 -> Phase 2 -> Funded
const PhaseProgress = ({ phase }) => {
  const currentIndex = PHASE_STEPS.indexOf(String(phase).toLowerCase());

  return (
    <div className="flex items-center gap-1.5">
      {PHASE_STEPS.map((step, i) => {
        const reached = currentIndex >= 0 && i <= currentIndex;
        return (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              reached
                ? step === "funded"
                  ? "bg-emerald-400"
                  : "bg-[#38BDF8]"
                : "bg-white/[0.08]"
            }`}
          />
        );
      })}
    </div>
  );
};

// Equity-vs-balance performance bar — shows current standing, not history
const PerformanceBar = ({ balance, equity }) => {
  const balanceNum = parseNumeric(balance);
  const equityNum = parseNumeric(equity);
  const pnl = equityNum - balanceNum;
  const pnlPercent = balanceNum > 0 ? (pnl / balanceNum) * 100 : 0;
  const isProfit = pnl >= 0;
  const fillWidth = Math.min(100, Math.max(4, 50 + pnlPercent));

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
          Performance
        </p>
        <span
          className={`font-mono text-[0.7rem] font-semibold ${
            isProfit ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {isProfit ? "▲" : "▼"} {Math.abs(pnlPercent).toFixed(1)}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={`h-1.5 rounded-full transition-all ${
            isProfit ? "bg-emerald-400" : "bg-red-400"
          }`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
    </div>
  );
};

const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const currentPhase = String(account.phase || "").toLowerCase();

  const canRequestPhase =
    String(account.status || "").toLowerCase() === "active" &&
    currentPhase !== "funded";

  const nextPhase =
    String(account.phase) === "1"
      ? "2"
      : String(account.phase) === "2"
      ? "funded"
      : "";

  const statusKey = String(account.status).toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F19]/95 p-6 text-[#F3EFE6] backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#5B6B82] transition hover:bg-white/[0.06] hover:text-[#F3EFE6]"
        >
          <X size={20} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
            <Wallet size={20} />
          </div>
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Account Details
            </p>
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              {account.type || "Account"}
            </h2>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Balance
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-[#F3EFE6]">
              {account.balance || "₦0"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Equity
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-emerald-300">
              {account.equity || "₦0"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Phase
            </p>
            <p className="mt-1 text-sm capitalize text-[#F3EFE6]">
              {account.type === "Challenge" ? account.phase : account.type}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
              Status
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                statusStyles[statusKey] ||
                "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/30"
              }`}
            >
              {account.status}
            </span>
          </div>
        </div>

        {String(account.type).toLowerCase() === "challenge" && (
          <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                Challenge Progress
              </p>
              <p className="font-mono text-[0.65rem] capitalize text-[#38BDF8]">
                {currentPhase === "funded" ? "Funded" : `Phase ${account.phase}`}
              </p>
            </div>
            <PhaseProgress phase={account.phase} />
          </div>
        )}

        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <PerformanceBar balance={account.balance} equity={account.equity} />
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
            MT5 Login Details
          </h3>

          <div className="space-y-1.5 font-mono text-sm">
            <p className="text-[#93A0B4]">
              Login:{" "}
              <span className="text-[#38BDF8]">
                {account.login || "Not assigned"}
              </span>
            </p>
            <p className="text-[#93A0B4]">
              Password:{" "}
              <span className="text-[#38BDF8]">
                {account.password || "Not assigned"}
              </span>
            </p>
            <p className="text-[#93A0B4]">
              Server:{" "}
              <span className="text-[#38BDF8]">
                {account.server || "Not assigned"}
              </span>
            </p>
          </div>
        </div>

        {canRequestPhase ? (
          String(account.type).toLowerCase() === "challenge" ? (
            <button
              onClick={() => requestPhase(account, nextPhase)}
              disabled={loadingRequest}
              className="w-full rounded-lg bg-[#38BDF8]/15 py-3 font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition-all duration-200 hover:bg-[#38BDF8]/25 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {loadingRequest ? "Submitting..." : `Request Phase ${nextPhase}`}
            </button>
          ) : (
            <div className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center text-sm text-[#5B6B82]">
              Phase requests are only available for Challenge accounts
            </div>
          )
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-[#5B6B82]">
            {currentPhase === "funded"
              ? "This account is already funded."
              : "Only active accounts can request the next phase."}
          </div>
        )}
      </div>
    </div>
  );
};

const MyAccounts = () => {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text });
    setTimeout(() => {
      setMessage({ show: false, type: "", text: "" });
    }, 3000);
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";
    const clean = String(value).replace(/[^0-9.]/g, "");
    const number = Number(clean);
    if (Number.isNaN(number)) return `₦${value}`;
    return `₦${number.toLocaleString()}`;
  };

  const getUser = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      return JSON.parse(rawUser);
    } catch (error) {
      console.error("getUser error:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?.user_id || null;
  };

  const fetchAccounts = async () => {
    const userId = getUserId();

    if (!userId) {
      setAccounts([]);
      setLoadingAccounts(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.fundednaira.net/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const text = await res.text();
      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("fetchAccounts error:", error);
      showMessage("error", "Server error while loading accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleViewDetails = (acc) => {
    setSelectedAccount(acc);
    setOpenModal(true);
  };

  const requestPhase = async (account, requestedPhase) => {
    const userId = getUserId();
    if (!userId) {
      showMessage("error", "User not logged in");
      return;
    }

    const currentPhase = account?.phase || "";

    if (!account?.id) {
      showMessage("error", "Missing account id");
      return;
    }

    if (!currentPhase) {
      showMessage("error", "Missing current phase");
      return;
    }

    if (!requestedPhase) {
      showMessage("error", "Missing requested phase");
      return;
    }

    try {
      setLoadingRequest(true);

      const payload = {
        user_id: userId,
        account_id: account.id,
        current_phase: String(currentPhase),
        requested_phase: String(requestedPhase),
      };

      const res = await fetch(
        "https://api.fundednaira.net/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success) {
        showMessage("success", data.message || "Phase request submitted");
        setOpenModal(false);
        setSelectedAccount(null);
        fetchAccounts();
      } else {
        showMessage("error", data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    } finally {
      setLoadingRequest(false);
    }
  };

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

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#38BDF8]/70">
              Analytics
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
              Accounts Dashboard
            </h1>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F3EFE6]">
                My Accounts
              </h2>
              {accounts.length > 0 && (
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5B6B82]">
                  {accounts.length} total
                </span>
              )}
            </div>

            {loadingAccounts ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#5B6B82]">
                Loading accounts
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((acc) => {
                  const statusKey = String(acc.status).toLowerCase();
                  return (
                    <div
                      key={acc.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#38BDF8]/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.12)]"
                    >
                      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#38BDF8]/10 blur-2xl" />

                      <div className="relative mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
                          <Wallet size={18} />
                        </div>
                        <h3 className="text-base font-semibold text-[#F3EFE6]">
                          {acc.type || "Account"}
                        </h3>
                      </div>

                      <div className="relative grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                          <p className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                            <TrendingUp size={11} /> Balance
                          </p>
                          <p className="mt-1 font-mono text-sm font-semibold text-[#F3EFE6]">
                            {formatMoney(acc.balance)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                          <p className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                            <Activity size={11} /> Equity
                          </p>
                          <p className="mt-1 font-mono text-sm font-semibold text-emerald-300">
                            {formatMoney(acc.equity)}
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-3">
                        <PerformanceBar balance={acc.balance} equity={acc.equity} />
                      </div>

                      {acc.type === "Challenge" && (
                        <div className="relative mt-3">
                          <div className="mb-1 flex items-center justify-between">
                            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                              Progress
                            </p>
                            <p className="font-mono text-[0.65rem] capitalize text-[#38BDF8]">
                              {String(acc.phase).toLowerCase() === "funded"
                                ? "Funded"
                                : `Phase ${acc.phase}`}
                            </p>
                          </div>
                          <PhaseProgress phase={acc.phase} />
                        </div>
                      )}

                      <p className="relative mt-3 text-xs text-[#93A0B4]">
                        Phase:{" "}
                        <span className="capitalize text-[#F3EFE6]">
                          {acc.type === "Challenge" ? acc.phase : acc.type}
                        </span>
                      </p>

                      <span
                        className={`relative mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          statusStyles[statusKey] ||
                          "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/30"
                        }`}
                      >
                        {acc.status}
                      </span>

                      <button
                        onClick={() => handleViewDetails(acc)}
                        className="relative mt-5 w-full rounded-lg bg-[#38BDF8]/15 py-2 text-sm font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition hover:bg-[#38BDF8]/25"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!loadingAccounts && accounts.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center font-mono text-xs text-[#5B6B82]">
                No accounts found
              </div>
            )}
          </div>
        </div>
      </div>

      <AccountDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        account={selectedAccount}
        requestPhase={requestPhase}
        loadingRequest={loadingRequest}
      />
    </Layout>
  );
};

export default MyAccounts;