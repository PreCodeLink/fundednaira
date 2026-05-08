import { useState } from "react";

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  // ================= USER ID =================
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  // ================= PHASE LOGIC (FIXED) =================
  const normalizePhase = (phase) => {
    if (!phase) return "";
    return String(phase).toLowerCase().trim();
  };

  const getNextPhase = (phase) => {
    const p = normalizePhase(phase);

    if (p.includes("phase 1") || p === "1") return "Phase 2";
    if (p.includes("phase 2") || p === "2") return "Funded";

    // ❌ Instant accounts cannot request
    if (p.includes("instant")) return null;

    return null;
  };

  // ================= REQUEST =================
  const handlePhaseRequest = async () => {
    setMessage("");
    setError("");

    const userId = getUserId();

    const currentPhase = account.phase || account.current_phase;
    const requestedPhase = getNextPhase(currentPhase);

    const payload = {
      user_id: userId,
      account_id: account.id || account.account_id,
      current_phase: currentPhase,
      requested_phase: requestedPhase,
    };

    console.log("PHASE REQUEST PAYLOAD:", payload);
    console.log("ACCOUNT:", account);

    // ================= VALIDATION =================
    if (!payload.user_id) return setError("Missing user_id");
    if (!payload.account_id) return setError("Missing account_id");
    if (!payload.current_phase) return setError("Missing current_phase");

    if (!requestedPhase) {
      return setError(
        "This account cannot request next phase (Instant or completed account)."
      );
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Request failed");
        return;
      }

      setMessage(data.message || "Phase request submitted successfully.");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = account.phase || account.current_phase;
  const nextPhase = getNextPhase(currentPhase);

  const isInstant = normalizePhase(currentPhase).includes("instant");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUCCESS / ERROR */}
        {message && (
          <div className="mb-3 bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        {/* ACCOUNT INFO */}
        <div className="space-y-2 mb-5">
          <p>Type: <span className="text-white">{account.type}</span></p>
          <p>Balance: <span className="text-white">{account.balance}</span></p>
          <p>Equity: <span className="text-white">{account.equity}</span></p>
          <p>Phase: <span className="text-white">{currentPhase}</span></p>
        </div>

        {/* LOGIN INFO */}
        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* ================= INSTANT BLOCK ================= */}
        {isInstant ? (
          <div className="text-yellow-400 text-sm bg-yellow-500/10 p-3 rounded">
            Instant accounts do not require phase requests.
          </div>
        ) : (
          <button
            onClick={handlePhaseRequest}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
          >
            {loading
              ? "Please wait..."
              : `Request ${nextPhase || "Next Phase"}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountDetailsModal;
