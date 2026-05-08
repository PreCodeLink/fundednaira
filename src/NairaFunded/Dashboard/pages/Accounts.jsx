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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-3 mb-6">
          <p>Type: <span className="text-white">{account.type}</span></p>
          <p>Balance: <span className="text-white">{account.balance}</span></p>
          <p>Equity: <span className="text-white">{account.equity}</span></p>
          <p>Phase: <span className="text-white">{account.phase}</span></p>
          <p>Status: <span className="text-white">{account.status}</span></p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
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
          <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
            {currentPhase === "funded"
              ? "Already funded account"
              : "Cannot request phase"}
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
  buttonColor,
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const isLoading = Number(buyingPlanId) === Number(plan.id);

  const color =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold">{formatMoney(plan.size)} Account</h3>
      <p className="text-3xl font-bold mt-2">{formatMoney(plan.price)}</p>

      <div className="mt-4 text-sm text-gray-400 space-y-2">
        <p>Target: {plan.target}%</p>
        <p>Loss: {plan.loss}%</p>
        <p>Split: {plan.split}%</p>
      </div>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white ${color}`}
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
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?.user_id || null;
  };

  /* ================= FIXED FETCH ACCOUNTS ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return setAccounts([]);

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const data = await res.json();

      console.log("ACCOUNTS:", data);

      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAccounts([]);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/get-plans.php"
      );
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const formatMoney = (value) => {
    const num = Number(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
  };

  /* ================= REQUEST PHASE ================= */
  const requestPhase = async (account, nextPhase) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoadingRequest(true);

      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            account_id: account.id,
            current_phase: account.phase,
            requested_phase: nextPhase,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOpenModal(false);
        fetchAccounts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  /* ================= BUY ACCOUNT ================= */
  const handleBuyPlan = async (plan) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return navigate("/auth");

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

      if (!data.success) return;

      const payment = data.data;

      const squad = new window.squad({
        key: payment.public_key,
        email: payment.email,
        amount: payment.amount,
        currency_code: payment.currency,
        transaction_ref: payment.reference,
        callback_url: payment.callback_url,
        onClose: () => setBuyingPlanId(null),
        onSuccess: () =>
          (window.location.href = `/dashboard/payment/callback?reference=${payment.reference}`),
      });

      squad.setup();
      squad.open();
    } catch (err) {
      console.error(err);
      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter(
    (p) => String(p.type).toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter(
    (p) => String(p.type).toLowerCase().includes("instant")
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts</h1>

          {/* MY ACCOUNTS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-gray-900 p-6 rounded-2xl">
                <h3 className="font-bold">{acc.type}</h3>
                <p>{acc.phase}</p>
                <button
                  className="mt-4 bg-blue-600 w-full py-2 rounded"
                  onClick={() => {
                    setSelectedAccount(acc);
                    setOpenModal(true);
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* BUY ACCOUNTS UI (RESTORED EXACT STYLE) */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">
                Buy Trading Account
              </h2>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-6">
                Challenge Accounts
              </h3>

              <div className="grid md:grid-cols-4 gap-6">
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
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">
                Instant Funding
              </h3>

              <div className="grid md:grid-cols-4 gap-6">
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
          </section>

          <AccountDetailsModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            account={selectedAccount}
            requestPhase={requestPhase}
            loadingRequest={loadingRequest}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Accounts;
