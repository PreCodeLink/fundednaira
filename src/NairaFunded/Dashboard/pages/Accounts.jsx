import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
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
            Phase: <span className="text-white capitalize">{account.phase}</span>
          </p>
          <p className="text-gray-400">
            Status: <span className="text-white capitalize">{account.status}</span>
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login Details</h3>

          <p className="text-sm">Login: <span className="text-green-400">{account.login}</span></p>
          <p className="text-sm">Password: <span className="text-green-400">{account.password}</span></p>
          <p className="text-sm">Server: <span className="text-green-400">{account.server}</span></p>
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
  const isLoading = Number(buyingPlanId) === Number(plan.id);

  const color =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-2">
        {formatMoney(plan.size)} Account
      </h3>

      <p className="text-3xl font-bold">{formatMoney(plan.price)}</p>

      <ul className="mt-6 text-sm text-gray-400 space-y-2">
        <li className="flex justify-between">
          <span>Target</span>
          <span className="text-white">{plan.target}%</span>
        </li>
        <li className="flex justify-between">
          <span>Loss</span>
          <span className="text-white">{plan.loss}%</span>
        </li>
        <li className="flex justify-between">
          <span>Split</span>
          <span className="text-white">{plan.split}%</span>
        </li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${color}`}
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

  /* ================= FIXED API ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();

    // ✅ FIX: backend returns { success, accounts }
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

  const formatMoney = (value) => {
    const num = Number(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
  };

  const requestPhase = async (account, nextPhase) => {
    setLoadingRequest(true);

    try {
      const userId = getUserId();

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

      await res.json();
      setOpenModal(false);
    } finally {
      setLoadingRequest(false);
    }
  };

  const challengePlans = plans.filter(
    (p) => String(p.type).toLowerCase() === "challenge"
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

          {/* ================= MY ACCOUNTS (RESTORED UI) ================= */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{acc.type}</h3>

                  <p className="text-gray-400 text-sm">
                    Balance: <span className="text-white">{formatMoney(acc.balance)}</span>
                  </p>

                  <p className="text-gray-400 text-sm">
                    Equity: <span className="text-white">{formatMoney(acc.equity)}</span>
                  </p>

                  <p className="text-gray-400 text-sm">
                    Phase: <span className="text-white capitalize">{acc.phase}</span>
                  </p>

                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                    {acc.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedAccount(acc);
                      setOpenModal(true);
                    }}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUY SECTION (YOUR UI) ================= */}
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
                    buttonText="Buy Challenge"
                    onBuy={() => {}}
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
                    onBuy={() => {}}
                    buyingPlanId={buyingPlanId}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL RESTORED */}
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
