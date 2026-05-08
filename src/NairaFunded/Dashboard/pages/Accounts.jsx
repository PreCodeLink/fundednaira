import { useEffect, useState } from "react";
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-400">Type: <span className="text-white">{account.type}</span></p>
          <p className="text-gray-400">Balance: <span className="text-white">{account.balance}</span></p>
          <p className="text-gray-400">Equity: <span className="text-white">{account.equity}</span></p>
          <p className="text-gray-400">Phase: <span className="text-white">{account.phase}</span></p>
          <p className="text-gray-400">Status: <span className="text-white">{account.status}</span></p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login</h3>
          <p>Login: <span className="text-green-400">{account.login || "N/A"}</span></p>
          <p>Password: <span className="text-green-400">{account.password || "N/A"}</span></p>
          <p>Server: <span className="text-green-400">{account.server || "N/A"}</span></p>
        </div>

        {canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
          >
            {loadingRequest ? "Submitting..." : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <p className="text-gray-400 text-sm bg-gray-800 p-3 rounded-lg">
            {currentPhase === "funded"
              ? "Already funded"
              : "Only active accounts can request phase"}
          </p>
        )}
      </div>
    </div>
  );
};

/* ================= PLAN CARD ================= */
const PlanCard = ({ plan, formatMoney, buttonColor, buttonText, onBuy, buyingPlanId }) => {
  const isLoading = buyingPlanId === plan.id;

  const color =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:-translate-y-1 transition">
      <h3 className="text-xl font-bold">{formatMoney(plan.size)} Account</h3>
      <p className="text-3xl font-bold mt-2">{formatMoney(plan.price)}</p>

      <ul className="text-sm text-gray-400 mt-5 space-y-2">
        <li>Target: {plan.target}%</li>
        <li>Loss: {plan.loss}%</li>
        <li>Split: {plan.split}%</li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-lg text-white ${color}`}
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
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id;
  };

  const fetchAccounts = async () => {
    const userId = getUserId();
    const res = await fetch(`/api/dashboard/get-user-accounts.php?user_id=${userId}`);
    const data = await res.json();
    setAccounts(Array.isArray(data) ? data : []);
  };

  const fetchPlans = async () => {
    const res = await fetch("/api/dashboard/get-plans.php");
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const handleBuyPlan = async (plan) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/auth");

    setBuyingPlanId(plan.id);

    try {
      const res = await fetch("/api/payments/initialize-payment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plan_id: plan.id }),
      });

      const result = await res.json();

      if (!result.success) return;

      const payment = result.data;

      const squad = new window.squad({
        key: payment.public_key,
        email: payment.email,
        amount: payment.amount,
        currency_code: payment.currency,
        transaction_ref: payment.reference,
        onSuccess: () => {
          window.location.href = `/dashboard/payment/callback?reference=${payment.reference}`;
        },
      });

      squad.setup();
      squad.open();
    } catch (err) {
      console.error(err);
    } finally {
      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter(p => p.type === "challenge");
  const instantPlans = plans.filter(p => p.type === "instant");

  const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* CHALLENGE */}
          <h2 className="text-xl mb-4">Challenge Accounts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {challengePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatMoney={formatMoney}
                buttonColor="blue"
                buttonText="Buy Challenge"
                onBuy={handleBuyPlan}
                buyingPlanId={buyingPlanId}
              />
            ))}
          </div>

          {/* INSTANT (ADDED FEATURE) */}
          <h2 className="text-xl mt-12 mb-4">Instant Funding</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {instantPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatMoney={formatMoney}
                buttonColor="green"
                buttonText="Buy Instant"
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
        requestPhase={() => {}}
        loadingRequest={loadingRequest}
      />
    </Layout>
  );
};

export default Accounts;
