import { useState } from "react";
import {
  X,
  ShieldCheck,
  Ban,
  RefreshCcw,
  Server,
  KeyRound,
  UserCircle2,
  Wallet,
  Layers3,
  Activity,
  FileText,
} from "lucide-react";

const AccountModal = ({
  selectedAccount,
  setSelectedAccount,
  handleSave,
  refreshAccounts,
}) => {
  const [loading, setLoading] = useState(false);

  if (!selectedAccount) return null;

  const status = String(selectedAccount.status || "").toLowerCase();

  const closeModal = () => {
    setSelectedAccount(null);
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return `₦${value}`;
    return `₦${number.toLocaleString()}`;
  };

  const getStatusClass = () => {
    if (status === "active") {
      return "bg-green-500/15 text-green-400 border border-green-500/30";
    }

    if (status === "pending") {
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    }

    if (status === "failed") {
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    }

    return "bg-gray-700/20 text-gray-300 border border-gray-700/30";
  };

  const changeStatus = async (newStatus, reason = "") => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/update-account-status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedAccount.id,
          status: newStatus,
          reason,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to update account status.");
        return;
      }

      alert(data.message || "Status updated successfully.");

      if (typeof refreshAccounts === "function") {
        await refreshAccounts();
      }

      closeModal();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong while updating the account status.");
    } finally {
      setLoading(false);
    }
  };

  const handleFailClick = () => {
    const reason = window.prompt(
      "Enter reason for marking this account as failed:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Failure reason is required.");
      return;
    }

    changeStatus("failed", reason.trim());
  };

  const onActivateClick = async () => {
    if (typeof handleSave === "function") {
      await handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-900 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="mb-6 pr-10">
          <h2 className="text-2xl font-bold">Manage Account</h2>
          <p className="mt-1 text-sm text-gray-400">
            Review account details, credentials, and account status actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-blue-600/20 p-2.5 text-blue-400">
                  <UserCircle2 size={22} />
                </div>
                <div>
                  <p className="font-semibold text-base">
                    {selectedAccount.user || selectedAccount.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-400">AC/{selectedAccount.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                  <p className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                    <Layers3 size={14} />
                    Type
                  </p>
                  <p>{selectedAccount.type || "N/A"}</p>
                </div>

                <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                  <p className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                    <Wallet size={14} />
                    Size
                  </p>
                  <p>{formatMoney(selectedAccount.size)}</p>
                </div>

                <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                  <p className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                    <Activity size={14} />
                    Phase
                  </p>
                  <p className="capitalize">
                    {selectedAccount.phase || selectedAccount.current_phase || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                  <p className="text-gray-400 text-xs mb-1">Status</p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass()}`}
                  >
                    {selectedAccount.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
              <div className="mb-3 flex items-center gap-2 text-gray-300">
                <KeyRound size={16} />
                <span className="font-medium">Account Credentials</span>
              </div>

              {status === "pending" ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Login ID"
                    value={selectedAccount.account_login || selectedAccount.login || ""}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        account_login: e.target.value,
                        login: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Password"
                    value={
                      selectedAccount.account_password ||
                      selectedAccount.password ||
                      ""
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        account_password: e.target.value,
                        password: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Server"
                    value={selectedAccount.server || ""}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        server: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1">Login</p>
                    <p>
                      {selectedAccount.account_login ||
                        selectedAccount.login ||
                        "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1">Password</p>
                    <p>
                      {selectedAccount.account_password ||
                        selectedAccount.password ||
                        "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 p-3 border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <Server size={14} />
                      Server
                    </p>
                    <p>{selectedAccount.server || "Not assigned"}</p>
                  </div>
                </div>
              )}
            </div>

            {status === "failed" && selectedAccount.failure_reason && (
              <div className="rounded-2xl border border-red-800 bg-red-950/30 p-5">
                <div className="mb-2 flex items-center gap-2 text-red-300">
                  <FileText size={16} />
                  <span className="font-medium">Failure Reason</span>
                </div>
                <p className="text-sm text-red-200">
                  {selectedAccount.failure_reason}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {status === "active" && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
                <h3 className="mb-3 text-base font-semibold">Active Account Actions</h3>

                <div className="rounded-xl border border-green-800/40 bg-green-950/20 p-4 text-sm text-green-300 mb-4">
                  This account is currently active and credentials have already been assigned.
                </div>

                <button
                  onClick={handleFailClick}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <Ban size={18} />
                  {loading ? "Processing..." : "Mark as Failed"}
                </button>
              </div>
            )}

            {status === "pending" && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
                <h3 className="mb-3 text-base font-semibold">Pending Account Actions</h3>

                <div className="rounded-xl border border-yellow-800/40 bg-yellow-950/20 p-4 text-sm text-yellow-200 mb-4">
                  Add login details, password, and server before activating this account.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={onActivateClick}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    <ShieldCheck size={18} />
                    {loading ? "Processing..." : "Activate Account"}
                  </button>

                  <button
                    onClick={handleFailClick}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    <Ban size={18} />
                    {loading ? "Processing..." : "Mark as Failed"}
                  </button>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
                <h3 className="mb-3 text-base font-semibold">Failed Account Actions</h3>

                <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300 mb-4">
                  This account has been marked as failed.
                </div>

                <button
                  onClick={() => changeStatus("active")}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  <RefreshCcw size={18} />
                  {loading ? "Processing..." : "Reactivate Account"}
                </button>
              </div>
            )}

            {!["active", "pending", "failed"].includes(status) && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-5">
                <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-gray-300">
                  No actions available for this account status.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
