import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import TopSection from "../companent/TopSection";

/* ---------------- MODAL ---------------- */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const currentPhase = String(account.phase || "").toLowerCase();
  const accountType = String(account.type || "").toLowerCase();

  // ❌ BLOCK INSTANT FROM PHASE REQUEST
  const isInstant = accountType.includes("instant");

  const canRequestPhase =
    String(account.status || "").toLowerCase() === "active" &&
    currentPhase !== "funded" &&
    !isInstant;

  const nextPhase =
    String(account.phase) === "1"
      ? "2"
      : String(account.phase) === "2"
      ? "funded"
      : "";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-400">
            Type: <span className="text-white">{account.type || "N/A"}</span>
          </p>
          <p className="text-gray-400">
            Balance: <span className="text-white">{account.balance || "₦0"}</span>
          </p>
          <p className="text-gray-400">
            Equity: <span className="text-white">{account.equity || "₦0"}</span>
          </p>
          <p className="text-gray-400">
            Phase: <span className="text-white capitalize">{account.phase}</span>
          </p>
          <p className="text-gray-400">
            Status: <span className="text-white capitalize">{account.status}</span>
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login Details</h3>

          <p className="text-sm">
            Login: <span className="text-green-400">{account.login || "Not assigned"}</span>
          </p>
          <p className="text-sm">
            Password: <span className="text-green-400">{account.password || "Not assigned"}</span>
          </p>
          <p className="text-sm">
            Server: <span className="text-green-400">{account.server || "Not assigned"}</span>
          </p>
        </div>

        {/* 🔥 INSTANT BLOCK MESSAGE */}
        {isInstant ? (
          <div className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
            Instant accounts do not support phase progression.
          </div>
        ) : canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-medium"
          >
            {loadingRequest ? "Submitting..." : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            {currentPhase === "funded"
              ? "This account is already funded."
              : "Only active accounts can request the next phase."}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- PLAN CARD ---------------- */
const PlanCard = ({
  plan,
  formatMoney,
  buttonColor = "blue",
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const buttonClass =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const badgeClass =
    buttonColor === "green"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-blue-500/20 text-blue-400 border border-blue-500/30";

  const isLoading = Number(buyingPlanId) === Number(plan.id);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">
      <h3 className="text-xl font-semibold">
        {formatMoney(plan.size)} Account
      </h3>

      <span className={`text-xs px-3 py-1 rounded-full ${badgeClass}`}>
        {plan.type}
      </span>

      <p className="mt-3 text-3xl font-bold">{formatMoney(plan.price)}</p>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${buttonClass}`}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const Accounts = () => {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?.user_id;
  };

  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();
    setAccounts(Array.isArray(data) ? data : []);
  };

  const fetchPlans = async () => {
    const res = await fetch(
      "https://api.fundednaira.ng/api/dashboard/get-plans.php"
    );
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const handleViewDetails = (acc) => {
    setSelectedAccount(acc);
    setOpenModal(true);
  };

  const requestPhase = async (account, requestedPhase) => {
    const userId = getUserId();
    if (!userId) return;

    setLoadingRequest(true);

    await fetch(
      "https://api.fundednaira.ng/api/dashboard/request-phase.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          account_id: account.id,
          current_phase: account.phase,
          requested_phase: requestedPhase,
        }),
      }
    );

    setLoadingRequest(false);
  };

  const handleBuyPlan = async (plan) => {
    setBuyingPlanId(plan.id);
    // keep your payment logic unchanged
  };

  const challengePlans = plans.filter(
    (p) => p.type?.toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) =>
    ["instant", "instant funding"].includes(p.type?.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* Accounts */}
          <div className="grid md:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-900 p-5 rounded-xl border border-gray-800"
              >
                <h3 className="font-semibold">{acc.type}</h3>

                <button
                  onClick={() => handleViewDetails(acc)}
                  className="mt-4 w-full bg-blue-600 py-2 rounded-lg"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Buy Plans */}
          <h2 className="mt-10 text-2xl font-bold">Buy Account</h2>

          <div className="grid md:grid-cols-3 gap-6 mt-5">
            {challengePlans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                formatMoney={(v) => `₦${v}`}
                buttonText="Buy Challenge"
                onBuy={handleBuyPlan}
                buyingPlanId={buyingPlanId}
              />
            ))}

            {instantPlans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                formatMoney={(v) => `₦${v}`}
                buttonText="Buy Instant"
                buttonColor="green"
                onBuy={handleBuyPlan}
                buyingPlanId={buyingPlanId}
              />
            ))}
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

export default Accounts;import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import TopSection from "../companent/TopSection";

/* ================= MODAL ================= */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const isInstant =
    String(account.type || "").toLowerCase().includes("instant");

  const currentPhase = String(account.phase || "").toLowerCase();

  const canRequestPhase =
    !isInstant &&
    String(account.status || "").toLowerCase() === "active" &&
    currentPhase !== "funded";

  const nextPhase =
    String(account.phase) === "1"
      ? "2"
      : String(account.phase) === "2"
      ? "funded"
      : "";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-400">
            Type: <span className="text-white">{account.type}</span>
          </p>
          <p className="text-gray-400">
            Balance: <span className="text-white">{account.balance}</span>
          </p>
          <p className="text-gray-400">
            Equity: <span className="text-white">{account.equity}</span>
          </p>
          <p className="text-gray-400">
            Phase:{" "}
            <span className="text-white capitalize">
              {isInstant ? "Instant" : account.phase}
            </span>
          </p>
          <p className="text-gray-400">
            Status: <span className="text-white">{account.status}</span>
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login Details</h3>

          <p className="text-sm">
            Login: <span className="text-green-400">{account.login}</span>
          </p>
          <p className="text-sm">
            Password: <span className="text-green-400">{account.password}</span>
          </p>
          <p className="text-sm">
            Server: <span className="text-green-400">{account.server}</span>
          </p>
        </div>

        {/* ================= PHASE LOGIC FIX ================= */}
        {isInstant ? (
          <div className="text-sm text-green-400 bg-green-900/20 rounded-lg p-3">
            Instant account — no phase request required
          </div>
        ) : canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-medium"
          >
            {loadingRequest
              ? "Submitting..."
              : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            No phase request available
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= PLAN CARD ================= */
const PlanCard = ({
  plan,
  formatMoney,
  buttonColor = "blue",
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const isLoading = Number(buyingPlanId) === Number(plan.id);

  const buttonClass =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const badgeClass =
    buttonColor === "green"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-blue-500/20 text-blue-400 border border-blue-500/30";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {formatMoney(plan.size)} Account
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full ${badgeClass}`}>
          {plan.type}
        </span>
      </div>

      <p className="text-3xl font-bold">{formatMoney(plan.price)}</p>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${buttonClass} disabled:opacity-50`}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
};

/* ================= MAIN ================= */
const Accounts = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id;
  };

  /* ================= FETCH ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );
    const data = await res.json();
    setAccounts(data.accounts || data || []);
  };

  const fetchPlans = async () => {
    const res = await fetch(
      "https://api.fundednaira.ng/api/dashboard/get-plans.php"
    );
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  /* ================= REQUEST PHASE ================= */
  const requestPhase = async (account, requestedPhase) => {
    setLoadingRequest(true);

    await fetch(
      "https://api.fundednaira.ng/api/dashboard/request-phase.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          account_id: account.id,
          current_phase: account.phase,
          requested_phase: requestedPhase,
        }),
      }
    );

    setLoadingRequest(false);
    setOpenModal(false);
    fetchAccounts();
  };

  const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

  const challengePlans = plans.filter(
    (p) => p.type?.toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) =>
    p.type?.toLowerCase().includes("instant")
  );

  /* ================= UI ================= */
  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* ACCOUNTS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-900 p-5 rounded-xl border border-gray-800"
              >
                <h3>{acc.type}</h3>
                <p>Balance: {acc.balance}</p>
                <p>
                  Phase:{" "}
                  {acc.type?.toLowerCase().includes("instant")
                    ? "Instant"
                    : acc.phase}
                </p>

                <button
                  onClick={() => {
                    setSelectedAccount(acc);
                    setOpenModal(true);
                  }}
                  className="mt-3 w-full bg-blue-600 py-2 rounded-lg"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* BUY SECTION */}
          <h2 className="text-2xl font-bold mb-4">Buy Account</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[...challengePlans, ...instantPlans].map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatMoney={formatMoney}
                onBuy={() => {}}
                buyingPlanId={buyingPlanId}
                buttonText="Buy Account"
              />
            ))}
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

export default Accounts;
