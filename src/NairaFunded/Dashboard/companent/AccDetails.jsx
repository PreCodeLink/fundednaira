import { useState } from "react";

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

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  /* ================= FIX: DETECT INSTANT ================= */
  const isInstant =
    String(account.type || "").toLowerCase().includes("instant");

  const currentPhase = String(account.phase || "").toLowerCase();

  /* ================= FIX: NEXT PHASE ================= */
  const getNextPhase = () => {
    if (isInstant) return null;

    if (currentPhase === "phase 1" || currentPhase === "1") return "Phase 2";
    if (currentPhase === "phase 2" || currentPhase === "2") return "Funded";

    return null;
  };

  const handlePhaseRequest = async () => {
    setMessage("");
    setError("");

    const userId = getUserId();

    const payload = {
      user_id: userId,
      account_id: account.id || account.account_id || 0,
      current_phase: account.phase || account.current_phase || "",
      requested_phase: getNextPhase(),
    };

    console.log("PHASE REQUEST:", payload);

    if (!payload.user_id) return setError("Missing user_id");
    if (!payload.account_id) return setError("Missing account_id");

    /* ================= IMPORTANT ================= */
    if (isInstant) {
      return setError("Instant accounts cannot request phase.");
    }

    if (!payload.requested_phase) {
      return setError("No next phase available.");
    }

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
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>

        {/* MESSAGES */}
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
          <p>
            Phase:{" "}
            <span className="text-white">
              {isInstant ? "Instant" : account.phase}
            </span>
          </p>
        </div>

        {/* MT5 INFO */}
        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* ================= BUTTON LOGIC ================= */}
        {isInstant ? (
          <div className="text-yellow-400 text-sm bg-yellow-500/10 p-3 rounded">
            Instant accounts do not require phase requests.
          </div>
        ) : (
          <button
            onClick={handlePhaseRequest}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
          >
            {loadingRequest
              ? "Please wait..."
              : `Request ${getNextPhase() || "Next Phase"}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountDetailsModal;
