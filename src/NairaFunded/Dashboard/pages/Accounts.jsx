import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import TopSection from "../companent/TopSection";
import { useNavigate } from "react-router-dom";

/* ================= MODAL ================= */
const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!isOpen || !account) return null;

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  const normalizePhase = (p) => {
    const v = String(p || "").toLowerCase();
    if (v.includes("instant")) return "Instant";
    if (v.includes("funded")) return "Funded";
    if (v.includes("2")) return "Phase 2";
    return "Phase 1";
  };

  const currentPhase = normalizePhase(account.phase);

  const getNextPhase = () => {
    if (currentPhase === "Phase 1") return "Phase 2";
    if (currentPhase === "Phase 2") return "Funded";
    return null;
  };

  const requestPhase = async () => {
    setMsg("");
    setErr("");

    if (!userId) return setErr("Login required");
    if (currentPhase === "Instant") return setErr("Instant has no request");

    const payload = {
      user_id: userId,
      account_id: account.id,
      current_phase: currentPhase,
      requested_phase: getNextPhase(),
    };

    setLoading(true);

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
        setErr(data.message || "Request failed");
      } else {
        setMsg(data.message || "Request sent");
      }
    } catch {
      setErr("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl border border-gray-800 text-white">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {msg && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded mb-3">
            {msg}
          </div>
        )}

        {err && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-3">
            {err}
          </div>
        )}

        <div className="space-y-2 mb-5">
          <p>Type: {account.type}</p>
          <p>Balance: ₦{account.balance}</p>
          <p>Equity: ₦{account.equity}</p>
          <p>Phase: {currentPhase}</p>
          <p>Status: {account.status}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded mb-5 text-sm">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {currentPhase === "Instant" ? (
          <div className="text-yellow-400 text-sm">
            Instant account has no phase request
          </div>
        ) : (
          <button
            onClick={requestPhase}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
          >
            {loading ? "Loading..." : `Request ${getNextPhase()}`}
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

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  /* FETCH ACCOUNTS */
  const fetchAccounts = async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const data = await res.json();

      setAccounts(data.accounts || []);
    } catch (err) {
      console.log(err);
      setAccounts([]);
    }
  };

  /* FETCH PLANS */
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

  const format = (v) =>
    isNaN(Number(v)) ? "₦0" : `₦${Number(v).toLocaleString()}`;

  const challenge = plans.filter(
    (p) => String(p.type).toLowerCase() === "challenge"
  );

  const instant = plans.filter((p) =>
    ["instant", "instant funding"].includes(String(p.type).toLowerCase())
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts</h1>

          {/* ================= MY ACCOUNTS ================= */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3 className="text-lg font-semibold">{acc.type}</h3>

                  <p className="text-gray-400">
                    Balance: <span className="text-white">{format(acc.balance)}</span>
                  </p>

                  <p className="text-gray-400">
                    Equity: <span className="text-white">{format(acc.equity)}</span>
                  </p>

                  <p className="text-gray-400">
                    Phase: <span className="text-white">{acc.phase}</span>
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                      acc.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {acc.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelected(acc);
                      setOpen(true);
                    }}
                    className="mt-4 w-full bg-blue-600 py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CHALLENGE ================= */}
          <h2 className="text-2xl mb-4">Challenge Accounts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {challenge.map((p) => (
              <div key={p.id} className="bg-gray-900 p-6 rounded-xl">
                <h3>{p.size}</h3>
                <p>{format(p.price)}</p>
              </div>
            ))}
          </div>

          {/* ================= INSTANT ================= */}
          <h2 className="text-2xl mt-10 mb-4">Instant Accounts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {instant.map((p) => (
              <div key={p.id} className="bg-gray-900 p-6 rounded-xl">
                <h3>{p.size}</h3>
                <p>{format(p.price)}</p>
                <p className="text-green-400 text-sm">No Phase Required</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AccountDetailsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        account={selected}
      />
    </Layout>
  );
};

export default Accounts;
