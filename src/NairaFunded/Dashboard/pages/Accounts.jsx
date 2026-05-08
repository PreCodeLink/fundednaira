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
          <p>Type: <span className="text-white">{account.type || "N/A"}</span></p>
          <p>Balance: <span className="text-white">{account.balance || "₦0"}</span></p>
          <p>Equity: <span className="text-white">{account.equity || "₦0"}</span></p>
          <p>Phase: <span className="text-white capitalize">{account.phase}</span></p>
          <p>Status: <span className="text-white capitalize">{account.status}</span></p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login Details</h3>
          <p>Login: <span className="text-green-400">{account.login || "N/A"}</span></p>
          <p>Password: <span className="text-green-400">{account.password || "N/A"}</span></p>
          <p>Server: <span className="text-green-400">{account.server || "N/A"}</span></p>
        </div>

        {canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
          >
            {loadingRequest ? "Submitting..." : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            {currentPhase === "funded"
              ? "This account is already funded."
              : "Only active accounts can request next phase."}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= PLAN CARD ================= */
const PlanCard = ({ plan, formatMoney, buttonColor, buttonText, onBuy, buyingPlanId }) => {
  const isLoading = buyingPlanId === plan.id;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold">{formatMoney(plan.size)} Account</h3>

      <p className="text-3xl font-bold mt-2">{formatMoney(plan.price)}</p>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl font-medium text-white ${
          buttonColor === "green"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
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
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id;
    } catch {
      return null;
    }
  };

  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();
    setAccounts(data?.accounts || []);
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

  const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

  const requestPhase = async (account, nextPhase) => {
    setLoadingRequest(true);

    await fetch("https://api.fundednaira.ng/api/dashboard/request-phase.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: getUserId(),
        account_id: account.id,
        current_phase: account.phase,
        requested_phase: nextPhase,
      }),
    });

    setLoadingRequest(false);
    setOpenModal(false);
  };

  const handleBuyPlan = async (plan) => {
    setBuyingPlanId(plan.id);

    // fake buy handler placeholder (keep your API here)
    setTimeout(() => {
      setBuyingPlanId(null);
      alert("Plan purchase triggered");
    }, 1000);
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

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* MY ACCOUNTS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-gray-900 p-6 rounded-xl">
                <h3>{acc.type}</h3>

                <button
                  onClick={() => {
                    setSelectedAccount(acc);
                    setOpenModal(true);
                  }}
                  className="mt-4 bg-blue-600 w-full py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* BUY SECTION (YOUR ORIGINAL UI RESTORED 100%) */}
          <section className="mt-16">

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">
                Buy Trading Account
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Choose your preferred account size and start your journey to becoming a funded trader.
              </p>
            </div>

            {/* CHALLENGE */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-blue-500"></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">Challenge Accounts</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Pass the evaluation and move to the next phase.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

            {/* INSTANT */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Instant Funding Accounts
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Get faster access with instant funding options.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
