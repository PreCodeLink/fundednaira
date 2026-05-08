import { useState } from "react";

const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  loadingRequest = false,
}) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  /* ================= USER ================= */
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  /* ================= NORMALIZE DATA ================= */
  const type = String(account.type || "").toLowerCase();
  const phaseRaw = account.phase || account.current_phase || "";

  const isInstant =
    type.includes("instant") || String(phaseRaw).toLowerCase() === "instant";

  const normalizePhase = (p) => {
    const v = String(p).toLowerCase();

    if (v.includes("1") || v.includes("phase 1")) return "Phase 1";
    if (v.includes("2") || v.includes("phase 2")) return "Phase 2";
    if (v.includes("funded")) return "Funded";

    return p || "";
  };

  const currentPhase = normalizePhase(phaseRaw);

  /* ================= NEXT PHASE ================= */
  const getNextPhase = () => {
    if (isInstant) return null;

    if (currentPhase === "Phase 1") return "Phase 2";
    if (currentPhase === "Phase 2") return "Funded";

    return null;
  };

  const nextPhase = getNextPhase();

  /* ================= REQUEST ================= */
  const handlePhaseRequest = async () => {
    setMessage("");
    setError("");

    const userId = getUserId();

    if (!userId) return setError("User not logged in");
    if (isInstant) return setError("Instant accounts cannot request phase");
    if (!nextPhase) return setError("No next phase available");

    const payload = {
      user_id: userId,
      account_id: account.id || account.account_id,
      current_phase: currentPhase,
      requested_phase: nextPhase,
    };

    console.log("PHASE PAYLOAD:", payload);

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

      setMessage(data.message || "Phase request sent successfully");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MESSAGE */}
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

        {/* INFO */}
        <div className="space-y-2 mb-5">
          <p>Type: <span className="text-white">{account.type}</span></p>
          <p>Balance: <span className="text-white">{account.balance}</span></p>
          <p>Equity: <span className="text-white">{account.equity}</span></p>

          <p>
            Phase:{" "}
            <span className="text-white">
              {isInstant ? "Instant" : currentPhase}
            </span>
          </p>
        </div>

        {/* MT5 */}
        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {/* BUTTON LOGIC */}
        {isInstant ? (
          <div className="text-yellow-400 text-sm bg-yellow-500/10 p-3 rounded">
            Instant accounts do not require phase request.
          </div>
        ) : nextPhase ? (
          <button
            onClick={handlePhaseRequest}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
          >
            {loadingRequest ? "Please wait..." : `Request ${nextPhase}`}
          </button>
        ) : (
          <div className="text-gray-400 text-sm bg-gray-800 p-3 rounded">
            This account has no further phase available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailsModal;
