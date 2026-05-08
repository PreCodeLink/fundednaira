import { useState } from "react";

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !account) return null;

  const getUserId = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;

      const user = JSON.parse(raw);
      return user?.id || user?.user_id || null;
    } catch (e) {
      console.log("User parse error");
      return null;
    }
  };

  const normalizePhase = (phase) => {
    if (!phase) return "";
    return String(phase).toLowerCase().trim();
  };

  const getNextPhase = (phase) => {
    const p = normalizePhase(phase);

    if (p.includes("phase 1") || p === "1") return "Phase 2";
    if (p.includes("phase 2") || p === "2") return "Funded";
    if (p.includes("instant")) return null;

    return null;
  };

  const currentPhase = account?.phase || account?.current_phase || "";
  const isInstant = normalizePhase(currentPhase).includes("instant");
  const nextPhase = getNextPhase(currentPhase);

  const handlePhaseRequest = async () => {
    setError("");
    setMessage("");

    const userId = getUserId();

    const payload = {
      user_id: userId,
      account_id: account?.id || account?.account_id,
      current_phase: currentPhase,
      requested_phase: nextPhase,
    };

    console.log("PAYLOAD:", payload);

    if (!payload.user_id) return setError("Missing user_id");
    if (!payload.account_id) return setError("Missing account_id");

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
      console.log(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg text-white">

        <div className="flex justify-between mb-4">
          <h2>Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {error && <p className="text-red-400 mb-2">{error}</p>}
        {message && <p className="text-green-400 mb-2">{message}</p>}

        <p>Type: {account?.type}</p>
        <p>Phase: {currentPhase}</p>

        <div className="bg-gray-800 p-3 mt-3">
          <p>Login: {account?.login}</p>
          <p>Password: {account?.password}</p>
        </div>

        {isInstant ? (
          <p className="text-yellow-400 mt-3">
            Instant accounts cannot request phase
          </p>
        ) : (
          <button
            onClick={handlePhaseRequest}
            className="w-full mt-4 bg-blue-600 py-3 rounded"
          >
            {loading ? "Loading..." : `Request ${nextPhase || "Next Phase"}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountDetailsModal;
