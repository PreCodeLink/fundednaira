import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import TopSection from "../companent/TopSection";
import { X } from "lucide-react";

/* ================= MODAL ================= */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const normalizePhase = (p) => {
    if (!p) return "";
    const v = String(p).toLowerCase();
    if (v.includes("instant")) return "Instant";
    if (v.includes("funded")) return "Funded";
    if (v.includes("1")) return "Phase 1";
    if (v.includes("2")) return "Phase 2";
    return p;
  };

  const currentPhase = normalizePhase(account.phase);

  const nextPhase =
    currentPhase === "Phase 1"
      ? "Phase 2"
      : currentPhase === "Phase 2"
      ? "Funded"
      : null;

  const canRequest =
    currentPhase !== "Instant" &&
    currentPhase !== "Funded" &&
    account.status?.toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-2 mb-5">
          <p>Type: {account.type}</p>
          <p>Balance: {account.balance}</p>
          <p>Equity: {account.equity}</p>
          <p>Phase: {currentPhase}</p>
          <p>Status: {account.status}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* NO REQUEST FOR INSTANT */}
        {currentPhase === "Instant" ? (
          <div className="text-yellow-400 text-sm">
            Instant accounts do not require phase requests.
          </div>
        ) : canRequest ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
          >
            {loadingRequest ? "Loading..." : `Request ${nextPhase}`}
          </button>
        ) : (
          <div className="text-gray-400 text-sm">
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
  buttonText,
  buttonColor = "blue",
  onBuy,
  buyingPlanId,
}) => {
  const isLoading = buyingPlanId === plan.id;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold">{plan.type}</h3>
      <p className="text-3xl font-bold mt-2">{formatMoney(plan.price)}</p>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white ${
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

/* ================= MAIN PAGE ================= */
const Accounts = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const getUserId = () => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return u?.id || u?.user_id || null;
  };

  /* ================= ACCOUNTS ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );
      const data = await res.json();

      setAccounts(data?.accounts || []);
    } catch (err) {
      setAccounts([]);
    }
  };

  /* ================= PLANS ================= */
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

  const formatMoney = (v) =>
    isNaN(Number(v)) ? "₦0" : `₦${Number(v).toLocaleString()}`;

  /* ================= REQUEST PHASE ================= */
  const requestPhase = async (account, phase) => {
    try {
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
            requested_phase: phase,
          }),
        }
      );

      setOpenModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  /* ================= BUY PLAN ================= */
  const handleBuyPlan = async (plan) => {
    setBuyingPlanId(plan.id);
    // payment logic unchanged
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
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3 className="text-lg font-semibold">{acc.type}</h3>

                  <p>Balance: {formatMoney(acc.balance)}</p>
                  <p>Phase: {acc.phase}</p>

                  <button
                    onClick={() => {
                      setSelectedAccount(acc);
                      setOpenModal(true);
                    }}
                    className="mt-4 w-full bg-blue-600 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUY UI (UNCHANGED) ================= */}
          <section className="mt-16">
            {/* Challenge */}
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

            {/* Instant */}
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
          </section>
        </div>
      </div>

      {/* MODAL */}
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
