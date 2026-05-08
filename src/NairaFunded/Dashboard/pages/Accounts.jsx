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
            <span className="text-white capitalize">
              {isInstant ? "Instant" : account.phase}
            </span>
          </p>

          <p className="text-gray-400">
            Status: <span className="text-white capitalize">{account.status}</span>
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

        {/* ===================== */}
        {/* PHASE BUTTON LOGIC */}
        {/* ===================== */}

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
            {loadingRequest
              ? "Submitting..."
              : `Request Phase ${nextPhase}`}
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
