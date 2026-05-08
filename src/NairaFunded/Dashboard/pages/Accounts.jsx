import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import TopSection from "../companent/TopSection";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

/* ================= MODAL ================= */
const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  const normalize = (v) => String(v || "").toLowerCase();

  const currentPhase = account.phase;

  const isInstant = normalize(currentPhase).includes("instant");

  const getNextPhase = (phase) => {
    const p = normalize(phase);

    if (p.includes("phase 1")) return "Phase 2";
    if (p.includes("phase 2")) return "Funded";

    return null;
  };

  const nextPhase = getNextPhase(currentPhase);

  const handleRequest = async () => {
    setError("");
    setMessage("");

    const payload = {
      user_id: getUserId(),
      account_id: account.id,
      current_phase: currentPhase,
      requested_phase: nextPhase,
    };

    console.log("REQUEST:", payload);

    if (!payload.user_id) return setError("Login required");
    if (!payload.account_id) return setError("Missing account ID");

    if (!nextPhase) {
      return setError("No phase request allowed for this account");
    }

    try {
      setLoading(true);

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

      setMessage("Request submitted successfully");
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg text-white border border-gray-800">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* MESSAGES */}
        {error && <p className="text-red-400 mb-2">{error}</p>}
        {message && <p className="text-green-400 mb-2">{message}</p>}

        {/* DETAILS */}
        <div className="space-y-2">
          <p>Type: {account.type}</p>
          <p>Balance: {account.balance}</p>
          <p>Equity: {account.equity}</p>
          <p>Phase: {account.phase}</p>
          <p>Status: {account.status}</p>
        </div>

        {/* LOGIN */}
        <div className="bg-gray-800 p-3 rounded mt-4">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* INSTANT BLOCK */}
        {isInstant ? (
          <p className="text-yellow-400 mt-4">
            Instant accounts do not require phase request
          </p>
        ) : (
          <button
            onClick={handleRequest}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
          >
            {loading ? "Loading..." : `Request ${nextPhase || "Next Phase"}`}
          </button>
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
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id;
    } catch {
      return null;
    }
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
      console.log(err);
      setAccounts([]);
    }
  };

  /* ================= PLANS ================= */
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
          <div className="mb-10">
            <h2 className="text-xl mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-xl border border-gray-800"
                >
                  <h3 className="font-semibold">{acc.type}</h3>
                  <p>{formatMoney(acc.balance)}</p>
                  <p>{acc.phase}</p>

                  <button
                    onClick={() => {
                      setSelected(acc);
                      setOpen(true);
                    }}
                    className="mt-3 w-full bg-blue-600 py-2 rounded"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CHALLENGE ================= */}
          <h2 className="text-xl mb-4">Challenge Accounts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {challengePlans.map((p) => (
              <div key={p.id} className="bg-gray-900 p-5 rounded-xl">
                <h3>{p.size}</h3>
                <p>{formatMoney(p.price)}</p>
              </div>
            ))}
          </div>

          {/* ================= INSTANT ================= */}
          <h2 className="text-xl mt-10 mb-4">Instant Funding</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {instantPlans.map((p) => (
              <div key={p.id} className="bg-gray-900 p-5 rounded-xl border border-green-600">
                <h3>{p.size}</h3>
                <p>{formatMoney(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AccountDetailsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        account={selected}
      />
    </Layout>
  );
};

export default Accounts;
