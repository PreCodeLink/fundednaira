import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, CircleAlert } from "lucide-react";

const PayoutModal = ({ isOpen, onClose, paymentDetails, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const getUserId = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      const user = JSON.parse(rawUser);
      return user.id || user.user_id || null;
    } catch (error) {
      console.error("getUserId error:", error);
      return null;
    }
  };

  const hasPaymentDetails =
    paymentDetails &&
    paymentDetails.account_name &&
    paymentDetails.bank_name &&
    paymentDetails.account_number;

  useEffect(() => {
    const fetchAccounts = async () => {
      const userId = getUserId();
      if (!userId || !isOpen) return;

      try {
        setLoadingAccounts(true);
        setMessage("");
        setType("");

        const res = await fetch(
          `https://api.fundednaira.ng/api/dashboard/get-user-accounts-for-payout.php?user_id=${userId}`
        );

        const text = await res.text();
        console.log("accounts raw response:", text);

        let data = [];
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("accounts parse error:", err);
          data = [];
        }

        const normalized = Array.isArray(data)
          ? data.map((acc) => ({
              id: acc.id || acc.account_id || "",
              phase: acc.phase || "",
              status: acc.status || "",
            }))
          : [];

        console.log("normalized accounts:", normalized);

        setAccounts(normalized);

        const firstValid = normalized.find(
          (acc) => String(acc.status || "").toLowerCase() !== "failed"
        );

        setSelectedAccount(firstValid ? String(firstValid.id) : "");
      } catch (error) {
        console.error("fetchAccounts error:", error);
        setAccounts([]);
        setSelectedAccount("");
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (isOpen) {
      setSelectedAccount("");
      setAmount("");
      fetchAccounts();
    }
  }, [isOpen]);

  const validAccounts = accounts.filter(
    (acc) => String(acc.status || "").toLowerCase() !== "failed"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = getUserId();

    if (!userId) {
      setType("error");
      setMessage("User not logged in");
      return;
    }

    if (!selectedAccount) {
      setType("error");
      setMessage("Please select trading account");
      return;
    }

    if (!amount) {
      setType("error");
      setMessage("Please enter payout amount");
      return;
    }

    const payload = {
      user_id: Number(userId),
      account_id: Number(selectedAccount),
      amount: amount,
    };

    console.log("Submitting payout payload:", payload);

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-payout.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      console.log("raw payout submit response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        setType("error");
        setMessage("Invalid server response");
        return;
      }

      if (result.success) {
        setType("success");
        setMessage(result.message || "Payout request submitted successfully");
        setAmount("");
        setSelectedAccount("");

        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setType("error");
        setMessage(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("submit payout error:", error);
      setType("error");
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800 text-white">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Request Payout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message}
          </div>
        )}

        {!hasPaymentDetails ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <CircleAlert size={18} className="text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-200">
                  No bank details found in your profile.
                </p>
                <Link
                  to="/profile"
                  className="inline-block mt-3 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-sm font-medium"
                >
                  Add Bank Details
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
              <p className="text-gray-400">Saved Bank Details</p>
              <p>
                Account Name:{" "}
                <span className="text-white">{paymentDetails.account_name}</span>
              </p>
              <p>
                Bank Name:{" "}
                <span className="text-white">{paymentDetails.bank_name}</span>
              </p>
              <p>
                Account Number:{" "}
                <span className="text-white">{paymentDetails.account_number}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Select Trading Account
              </label>

              <select
                value={selectedAccount}
                onChange={(e) => {
                  console.log("dropdown changed to:", e.target.value);
                  setSelectedAccount(e.target.value);
                }}
                className="w-full bg-gray-800 p-3 rounded-lg outline-none text-white border border-gray-700"
                required
                disabled={loadingAccounts || validAccounts.length === 0}
              >
                <option value="">Select trading account</option>

                {validAccounts.map((acc) => (
                  <option key={acc.id} value={String(acc.id)}>
                    Account ID: {acc.id} | Phase: {acc.phase || "N/A"} | Status:{" "}
                    {acc.status || "N/A"}
                  </option>
                ))}
              </select>

              {loadingAccounts && (
                <p className="text-xs text-gray-400 mt-2">Loading accounts...</p>
              )}

              {!loadingAccounts && validAccounts.length === 0 && (
                <p className="text-xs text-red-400 mt-2">
                  No eligible accounts available. Failed accounts cannot request payout.
                </p>
              )}
            </div>

            <input
              type="number"
              placeholder="Enter payout amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none text-white border border-gray-700"
              required
              disabled={validAccounts.length === 0}
            />

            <button
              type="submit"
              disabled={loading || loadingAccounts || validAccounts.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-medium"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PayoutModal;
