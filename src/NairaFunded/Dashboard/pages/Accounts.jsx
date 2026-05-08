import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import TopSection from "../companent/TopSection";

/* ===================== ACCOUNT MODAL ===================== */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const isInstant = String(account.type || "").toLowerCase() === "instant";
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
          <p>Type: {account.type}</p>
          <p>Balance: {account.balance}</p>
          <p>Equity: {account.equity}</p>
          <p>
            Phase: {isInstant ? "Instant" : account.phase}
          </p>
          <p>Status: {account.status}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <p>Login: {account.login || "N/A"}</p>
          <p>Password: {account.password || "N/A"}</p>
          <p>Server: {account.server || "N/A"}</p>
        </div>

        {/* PHASE CONTROL */}
        {isInstant ? (
          <div className="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg">
            Instant account — no phase request required
          </div>
        ) : canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 py-3 rounded-lg"
          >
            {loadingRequest
              ? "Submitting..."
              : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-gray-400 text-sm bg-gray-800 p-3 rounded-lg">
            No phase request available
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================== PLAN CARD ===================== */
const PlanCard = ({ plan, onBuy, buyingPlanId, formatMoney }) => {
  const isLoading = Number(buyingPlanId) === Number(plan.id);

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold">
        {formatMoney(plan.size)} Account
      </h3>

      <p className="text-2xl font-bold mt-2">
        {formatMoney(plan.price)}
      </p>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className="mt-5 w-full bg-blue-600 py-2 rounded-lg"
      >
        {isLoading ? "Processing..." : "Buy Account"}
      </button>
    </div>
  );
};

/* ===================== MAIN ===================== */
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

  /* ================= FETCH ACCOUNTS ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();

    setAccounts(data.accounts || data || []);
  };

  /* ================= FETCH PLANS ================= */
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

  /* ================= BUY PLAN ================= */
  const handleBuyPlan = async (plan) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id) {
      navigate("/auth");
      return;
    }

    setBuyingPlanId(plan.id);

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/payments/initialize-payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            plan_id: plan.id,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        window.location.href = `/dashboard/payment/callback?reference=${data.data.reference}`;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBuyingPlanId(null);
    }
  };

  /* ================= REQUEST PHASE ================= */
  const requestPhase = async (account, requestedPhase) => {
    setLoadingRequest(true);

    try {
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

      setOpenModal(false);
      fetchAccounts();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

  const challengePlans = plans.filter(
    (p) => p.type?.toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter(
    (p) => p.type?.toLowerCase().includes("instant")
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* ================= MY ACCOUNTS ================= */}
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
                  {String(acc.type).toLowerCase() === "instant"
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

          {/* ================= BUY ACCOUNTS ================= */}
          <h2 className="text-2xl font-bold mb-4">Buy Account</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[...challengePlans, ...instantPlans].map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onBuy={handleBuyPlan}
                buyingPlanId={buyingPlanId}
                formatMoney={formatMoney}
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
