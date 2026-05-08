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
    account?.phase === "1"
      ? "2"
      : account?.phase === "2"
      ? "funded"
      : null;

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

        {canRequestPhase ? (
          <button
            onClick={() => nextPhase && requestPhase(account, nextPhase)}
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

/* ================= PLAN CARD ================= */
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
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6`}>
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">{formatMoney(plan.size)} Account</h3>
        <span className={`text-xs px-3 py-1 rounded-lg ${badgeClass}`}>
          {plan.type}
        </span>
      </div>

      <p className="text-3xl font-bold">{formatMoney(plan.price)}</p>

      <ul className="mt-6 space-y-2 text-gray-400 text-sm">
        <li className="flex justify-between">
          <span>Profit Target</span>
          <span className="text-white">{plan.target}%</span>
        </li>
        <li className="flex justify-between">
          <span>Max Loss</span>
          <span className="text-white">{plan.loss}%</span>
        </li>
        <li className="flex justify-between">
          <span>Profit Split</span>
          <span className="text-white">{plan.split}%</span>
        </li>
      </ul>

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

/* ================= MAIN ================= */
const Accounts = () => {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?.user_id || null;
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
    const res = await fetch("https://api.fundednaira.ng/api/dashboard/get-plans.php");
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const formatMoney = (value) => {
    const num = Number(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
  };

  const handleBuyPlan = async (plan) => {
    const user = getUser();
    if (!user) return navigate("/auth");

    try {
      setBuyingPlanId(plan.id);

      const res = await fetch(
        "https://api.fundednaira.ng/api/payments/initialize-payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id || user.user_id,
            plan_id: plan.id,
          }),
        }
      );

      const result = await res.json();

      const squad = new window.squad({
        key: result.data.public_key,
        email: result.data.email,
        amount: result.data.amount,
        currency_code: result.data.currency,
        transaction_ref: result.data.reference,
        callback_url: result.data.callback_url,
        onClose: () => setBuyingPlanId(null),
        onSuccess: () =>
          (window.location.href = `/dashboard/payment/callback?reference=${result.data.reference}`),
      });

      squad.setup();
      squad.open();
    } catch (err) {
      console.error(err);
      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter((p) =>
    String(p.type).toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) =>
    ["instant", "instant funding"].includes(String(p.type).toLowerCase())
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* MY ACCOUNTS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-gray-900 p-6 rounded-xl">
                <h3>{acc.type}</h3>
                <p>{formatMoney(acc.balance)}</p>
                <button onClick={() => {
                  setSelectedAccount(acc);
                  setOpenModal(true);
                }}>
                  View
                </button>
              </div>
            ))}
          </div>

          {/* CHALLENGE */}
          <h2 className="text-2xl mb-4">Challenge Accounts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {challengePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatMoney={formatMoney}
                buttonText="Buy Challenge"
                onBuy={handleBuyPlan}
                buyingPlanId={buyingPlanId}
              />
            ))}
          </div>

          {/* 🔥 INSTANT FEATURE ADDED (UNCHANGED STYLE) */}
          <h2 className="text-2xl mt-10 mb-4">Instant Funding Accounts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {instantPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatMoney={formatMoney}
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
        requestPhase={() => {}}
        loadingRequest={loadingRequest}
      />
    </Layout>
  );
};

export default Accounts;
