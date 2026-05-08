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

  /* ================= SAFE NORMALIZATION ================= */
  const rawType = String(account.type || "").toLowerCase();
  const rawPhase = String(account.phase || account.current_phase || "");
  const rawStatus = String(account.status || "").toLowerCase();

  const isInstant =
    rawType.includes("instant") || rawPhase.toLowerCase().includes("instant");

  const normalizePhase = (p) => {
    const v = String(p).toLowerCase();
    if (v.includes("1") || v.includes("phase 1")) return "1";
    if (v.includes("2") || v.includes("phase 2")) return "2";
    if (v.includes("funded")) return "funded";
    return "";
  };

  const currentPhase = normalizePhase(rawPhase);

  const getNextPhase = () => {
    if (isInstant) return null;
    if (currentPhase === "1") return "2";
    if (currentPhase === "2") return "funded";
    return null;
  };

  const nextPhase = getNextPhase();

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

        {/* INFO */}
        <div className="space-y-3 mb-6">
          <p>Type: <span className="text-white">{account.type}</span></p>
          <p>Balance: <span className="text-white">{account.balance}</span></p>
          <p>Equity: <span className="text-white">{account.equity}</span></p>
          <p>
            Phase:{" "}
            <span className="text-white">
              {isInstant ? "Instant" : currentPhase}
            </span>
          </p>
          <p>Status: <span className="text-white">{account.status}</span></p>
        </div>

        {/* MT5 */}
        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* ================= BUTTON LOGIC ================= */}
        {isInstant ? (
          <div className="text-yellow-400 text-sm bg-yellow-500/10 p-3 rounded">
            Instant accounts do not require phase request.
          </div>
        ) : nextPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
          >
            {loadingRequest
              ? "Submitting..."
              : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            No phase request available.
          </div>
        )}
      </div>
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

  /* ================= USER ================= */
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?.user_id || null;
  };

  /* ================= FETCH ACCOUNTS ================= */
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
      console.error(err);
      setAccounts([]);
    }
  };

  /* ================= FETCH PLANS ================= */
  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/get-plans.php"
      );
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch {
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  /* ================= FORMAT MONEY ================= */
  const formatMoney = (value) => {
    const num = Number(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
  };

  /* ================= REQUEST PHASE ================= */
  const requestPhase = async (account, nextPhase) => {
    setLoadingRequest(true);

    try {
      const userId = getUserId();

      await fetch(
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

      setOpenModal(false);
    } catch (err) {
      console.error(err);
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

            <div className="grid md:grid-cols-3 gap-6">
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
                    Phase: <span className="text-white">{acc.phase}</span>
                  </p>

                  <button
                    onClick={() => {
                      setSelectedAccount(acc);
                      setOpenModal(true);
                    }}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUY UI (UNCHANGED) ================= */}
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
                <div className="h-8 w-1 rounded-full bg-blue-500"></div>
                <h3 className="text-2xl font-bold">Challenge Accounts</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {challengePlans.map((plan) => (
                  <div key={plan.id} className="bg-gray-900 p-6 rounded-xl">
                    {plan.type}
                  </div>
                ))}
              </div>
            </div>

            {/* INSTANT */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-green-500"></div>
                <h3 className="text-2xl font-bold">Instant Funding</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {instantPlans.map((plan) => (
                  <div key={plan.id} className="bg-gray-900 p-6 rounded-xl">
                    {plan.type}
                  </div>
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
        requestPhase={requestPhase}
        loadingRequest={loadingRequest}
      />
    </Layout>
  );
};

export default Accounts;
