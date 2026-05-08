import { useState } from "react";

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      const user = JSON.parse(rawUser);
      return user.id || user.user_id || null;
    } catch {
      return null;
    }
  };

  // ✅ FIXED: Proper phase conversion for backend
  const getNextPhase = (phase) => {
    if (!phase) return "";

    const p = String(phase).toLowerCase();

    if (p === "1" || p === "phase 1") return "2";
    if (p === "2" || p === "phase 2") return "funded";

    return "";
  };

  const handlePhaseRequest = async () => {
    setMessage("");
    setError("");

    const userId = getUserId();

    const currentPhase =
      account.current_phase || account.phase || "";

    const payload = {
      user_id: userId,
      account_id: account.id || account.account_id || 0,

      // ✅ FIX: ensure only backend-safe values
      current_phase: String(currentPhase).replace(/[^0-9]/g, "") || "1",

      requested_phase: getNextPhase(currentPhase),
    };

    console.log("FINAL PAYLOAD:", payload);

    // validation
    if (!payload.user_id) return setError("Missing user_id");
    if (!payload.account_id) return setError("Missing account_id");
    if (!payload.current_phase) return setError("Missing current_phase");
    if (!payload.requested_phase) return setError("Missing requested_phase");

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

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to request phase.");
        return;
      }

      setMessage(data.message || "Phase request submitted successfully.");
    } catch (err) {
      console.error("REQUEST ERROR:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* ACCOUNT INFO */}
        <div className="space-y-3 mb-6">
          <p className="text-gray-400">
            Type: <span className="text-white">{account.type}</span>
          </p>
          <p className="text-gray-400">
            Balance: <span className="text-white">{account.balance}</span>
          </p>
          <p className="text-gray-400">
            Equity: <span className="text-white">{account.equity}</span>
          </p>
          <p className="text-gray-400">
            Phase:{" "}
            <span className="text-white">
              {account.phase || account.current_phase}
            </span>
          </p>
        </div>

        {/* MT5 DETAILS */}
        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">MT5 Login Details</h3>

          <p className="text-sm">
            Login: <span className="text-green-400">{account.login}</span>
          </p>
          <p className="text-sm">
            Password: <span className="text-green-400">{account.password}</span>
          </p>
          <p className="text-sm">
            Server: <span className="text-green-400">{account.server}</span>
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handlePhaseRequest}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : `Request ${
                getNextPhase(account.phase || account.current_phase) ||
                "Next Phase"
              }`}
        </button>
      </div>
    </div>
  );
};

export default AccountDetailsModal;
