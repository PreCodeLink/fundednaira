import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Ban } from "lucide-react";

const AccountModal = ({
  isOpen,
  closeModal,
  selectedAccount,
  refreshAccounts,
  showMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen || !selectedAccount) return null;

  const getValue = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return "—";
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return `₦${value}`;
    return `₦${number.toLocaleString()}`;
  };

  const resetReasonState = () => {
    setShowReasonBox(false);
    setPendingStatus("");
    setReason("");
  };

  const changeStatus = async (newStatus, customReason = "") => {
    if (!selectedAccount?.id) {
      if (showMessage) {
        showMessage("error", "No account selected.");
      } else {
        alert("No account selected.");
      }
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://api.fundednaira.ng/api/admin/update-account-status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedAccount.id,
          status: newStatus,
          reason: customReason,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (showMessage) {
          showMessage("error", data.message || "Failed to update account status.");
        } else {
          alert(data.message || "Failed to update account status.");
        }
        return;
      }

      if (showMessage) {
        showMessage("success", data.message || `Account marked as ${newStatus}.`);
      } else {
        alert(data.message || "Status updated successfully.");
      }

      if (typeof refreshAccounts === "function") {
        await refreshAccounts();
      }

      resetReasonState();
      closeModal();
    } catch (error) {
      console.error("Status update error:", error);

      if (showMessage) {
        showMessage("error", "Something went wrong while updating the account status.");
      } else {
        alert("Something went wrong while updating the account status.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendOrFail = (status) => {
    setPendingStatus(status);
    setShowReasonBox(true);
  };

  const submitReasonAction = async () => {
    if (!reason.trim()) {
      if (showMessage) {
        showMessage("error", "Please enter a reason.");
      } else {
        alert("Please enter a reason.");
      }
      return;
    }

    await changeStatus(pendingStatus, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">Account Details</h2>
            <p className="text-sm text-gray-400">Manage purchased account status</p>
          </div>

          <button
            onClick={() => {
              resetReasonState();
              closeModal();
            }}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard
              label="User Name"
              value={getValue(
                selectedAccount.full_name,
                selectedAccount.user,
                selectedAccount.name
              )}
            />
            <InfoCard
              label="Email"
              value={getValue(selectedAccount.email)}
            />
            <InfoCard
              label="Account Login"
              value={getValue(
                selectedAccount.account_login,
                selectedAccount.login
              )}
            />
            <InfoCard
              label="Server"
              value={getValue(selectedAccount.server)}
            />
            <InfoCard
              label="Password"
              value={getValue(
                selectedAccount.account_password,
                selectedAccount.password
              )}
            />
            <InfoCard
              label="Current Phase"
              value={getValue(
                selectedAccount.current_phase,
                selectedAccount.phase
              )}
            />
            <InfoCard
              label="Plan"
              value={formatMoney(
                getValue(selectedAccount.plan_size, selectedAccount.size, 0)
              )}
            />
            <InfoCard
              label="Type"
              value={getValue(
                selectedAccount.type,
                selectedAccount.plan_type
              )}
            />
            <InfoCard
              label="Status"
              value={getValue(selectedAccount.status)}
            />
          </div>

          {showReasonBox && (
            <div className="rounded-2xl border border-yellow-600/30 bg-yellow-500/10 p-4">
              <h3 className="mb-3 font-semibold text-yellow-300">
                Enter reason for {pendingStatus}
              </h3>

              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Write reason for ${pendingStatus} account...`}
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={submitReasonAction}
                  disabled={loading}
                  className="rounded-xl bg-yellow-500 px-5 py-2.5 font-medium text-black hover:bg-yellow-400 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit Reason"}
                </button>

                <button
                  onClick={resetReasonState}
                  className="rounded-xl border border-gray-700 px-5 py-2.5 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showReasonBox && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => changeStatus("active")}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium hover:bg-green-500 disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {loading ? "Processing..." : "Activate"}
              </button>

              <button
                onClick={() => handleSuspendOrFail("suspended")}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-medium text-black hover:bg-yellow-400 disabled:opacity-50"
              >
                <AlertCircle size={18} />
                Suspend
              </button>

              <button
                onClick={() => handleSuspendOrFail("failed")}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium hover:bg-red-500 disabled:opacity-50"
              >
                <Ban size={18} />
                Fail Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 break-words font-medium text-white">{value || "—"}</p>
    </div>
  );
};

export default AccountModal;
