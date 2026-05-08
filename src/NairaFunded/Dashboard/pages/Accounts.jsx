import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import TopSection from "../companent/TopSection";

/* =========================
   ACCOUNT MODAL
========================= */
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
            Phase:{" "}
            <span className="text-white">
              {isInstant ? "Instant" : account.phase}
            </span>
          </p>

          <p className="text-gray-400">
            Status: <span className="text-white">{account.status}</span>
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

        {/* ================= PHASE LOGIC ================= */}
        {isInstant ? (
          <div className="text-sm text-green-400 bg-green-900/20 border border-green-700 rounded-lg p-3">
            Instant account — no phase request required
          </div>
        ) : canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
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

/* =========================
   MAIN COMPONENT
========================= */
const Accounts = () => {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id;
  };

  const fetchAccounts = async () => {
    const userId = getUserId();

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();

    setAccounts(data.accounts || data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const requestPhase = async (account, requestedPhase) => {
    const userId = getUserId();

    setLoadingRequest(true);

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            account_id: account.id,
            current_phase: account.phase,
            requested_phase: requestedPhase,
          }),
        }
      );

      await res.json();
      fetchAccounts();
      setOpenModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800"
              >
                <h3 className="text-lg font-semibold">{acc.type}</h3>

                <p>Balance: {acc.balance}</p>
                <p>Equity: {acc.equity}</p>
                <p>
                  Phase:{" "}
                  {String(acc.type || "").toLowerCase() === "instant"
                    ? "Instant"
                    : acc.phase}
                </p>

                <button
                  className="mt-4 bg-blue-600 w-full py-2 rounded"
                  onClick={() => {
                    setSelectedAccount(acc);
                    setOpenModal(true);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

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

/* ⭐ IMPORTANT FIX FOR VERCEL BUILD */
export default Accounts;
