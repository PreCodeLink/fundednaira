import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import TopSection from "../companent/TopSection";

/* ================= MODAL (RESTORED + FIXED) ================= */
const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
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

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-5">Account Details</h2>

        <div className="space-y-3 mb-6">
          <p>Type: <span className="text-white">{account.type}</span></p>
          <p>Balance: <span className="text-white">{account.balance}</span></p>
          <p>Equity: <span className="text-white">{account.equity}</span></p>
          <p>Phase: <span className="text-white">{currentPhase}</span></p>
          <p>Status: <span className="text-white">{account.status}</span></p>
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
            No request available
          </div>
        )}
      </div>
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
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  /* ================= FIXED API ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const data = await res.json();

      // FIX SAFE RESPONSE
      const accountsData = data?.accounts || [];

      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    } catch (err) {
      console.log(err);
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
    } catch {
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const formatMoney = (v) =>
    isNaN(Number(v)) ? "₦0" : `₦${Number(v).toLocaleString()}`;

  /* ================= REQUEST ================= */
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

          {/* ================= MY ACCOUNTS (YOUR ORIGINAL UI) ================= */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {acc.type || "Account"}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Balance: <span className="text-white">{formatMoney(acc.balance)}</span>
                  </p>

                  <p className="text-gray-400 text-sm">
                    Equity: <span className="text-white">{formatMoney(acc.equity)}</span>
                  </p>

                  <p className="text-gray-400 text-sm">
                    Phase: <span className="text-white">{acc.phase}</span>
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

            {accounts.length === 0 && (
              <div className="bg-gray-900 p-6 text-center text-gray-400 rounded-xl">
                No accounts found
              </div>
            )}
          </div>

          {/* ================= BUY UI (UNCHANGED EXACT STRUCTURE) ================= */}
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
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Challenge Accounts
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Pass the evaluation and move to the next phase.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {challengePlans.map((plan) => (
                  <div key={plan.id} className="bg-gray-900 p-6 rounded-xl">
                    <p>{plan.type}</p>
                  </div>
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
                  <div key={plan.id} className="bg-gray-900 p-6 rounded-xl">
                    <p>{plan.type}</p>
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
