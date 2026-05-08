import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import TopSection from "../companent/TopSection";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= MODAL ================= */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  const normalizePhase = (phase) => {
    if (!phase) return "";
    const p = String(phase).toLowerCase();
    if (p.includes("instant")) return "Instant";
    if (p.includes("funded")) return "Funded";
    if (p.includes("1")) return "Phase 1";
    if (p.includes("2")) return "Phase 2";
    return phase;
  };

  const currentPhase = normalizePhase(account.phase || account.current_phase);

  const getNextPhase = () => {
    if (currentPhase === "Phase 1") return "Phase 2";
    if (currentPhase === "Phase 2") return "Funded";
    return null;
  };

  const isInstant = currentPhase === "Instant";

  const handleRequest = async () => {
    setMessage("");
    setError("");

    if (isInstant) {
      return setError("Instant accounts cannot request phase.");
    }

    const payload = {
      user_id: JSON.parse(localStorage.getItem("user"))?.id,
      account_id: account.id,
      current_phase: currentPhase,
      requested_phase: getNextPhase(),
    };

    if (!payload.requested_phase) {
      return setError("No next phase available.");
    }

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Request failed");
        return;
      }

      setMessage(data.message || "Request sent successfully.");
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-5">Account Details</h2>

        {message && (
          <div className="mb-3 bg-green-500/10 text-green-400 p-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-3 bg-red-500/10 text-red-400 p-3 rounded">
            {error}
          </div>
        )}

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

        {isInstant ? (
          <div className="text-yellow-400 bg-yellow-500/10 p-3 rounded">
            Instant accounts have no phase request.
          </div>
        ) : (
          <button
            onClick={handleRequest}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
          >
            {loadingRequest
              ? "Processing..."
              : `Request ${getNextPhase() || "Next Phase"}`}
          </button>
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
  const loading = Number(buyingPlanId) === Number(plan.id);

  const color =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold">
        {formatMoney(plan.size)} Account
      </h3>

      <p className="text-3xl font-bold mt-2">
        {formatMoney(plan.price)}
      </p>

      <ul className="text-sm text-gray-400 mt-4 space-y-2">
        <li>Target: {plan.target}%</li>
        <li>Loss: {plan.loss}%</li>
        <li>Split: {plan.split}%</li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${color}`}
      >
        {loading ? "Processing..." : buttonText}
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
  const [buyingPlanId, setBuyingPlanId] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?.user_id;
  };

  /* ================= FETCH ACCOUNTS ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();
    setAccounts(data?.accounts || []);
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

  const formatMoney = (v) => {
    const num = Number(String(v).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
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

          {/* ================= MY ACCOUNTS ================= */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3 className="font-bold">{acc.type}</h3>
                  <p>{formatMoney(acc.balance)}</p>
                  <p className="text-sm text-gray-400">{acc.phase}</p>

                  <button
                    onClick={() => {
                      setSelectedAccount(acc);
                      setOpenModal(true);
                    }}
                    className="mt-4 w-full bg-blue-600 py-2 rounded"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUY SECTION (YOUR UI RESTORED) ================= */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">
                Buy Trading Account
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Choose your preferred account size and start your journey.
              </p>
            </div>

            {/* CHALLENGE */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-blue-500 rounded" />
                <h3 className="text-2xl font-bold">Challenge Accounts</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
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
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-green-500 rounded" />
                <h3 className="text-2xl font-bold">
                  Instant Funding Accounts
                </h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
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

      {/* MODAL */}
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
