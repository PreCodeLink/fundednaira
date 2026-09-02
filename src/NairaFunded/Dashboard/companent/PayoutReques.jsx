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

      return user?.id || user?.user_id || user?.userId || null;
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
          `https://api.fundednaira.net/api/dashboard/get-user-accounts-for-payout.php?user_id=${userId}`
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
              id:
                acc.id ||
                acc.account_id ||
                acc.accountId ||
                acc.trading_account_id ||
                "",
              phase: acc.phase || acc.account_phase || "",
              status: acc.status || acc.account_status || "",
            }))
          : [];

        console.log("normalized accounts:", normalized);

        setAccounts(normalized);

        const firstValid = normalized.find(
          (acc) => String(acc.status || "").toLowerCase() !== "failed"
        );

        console.log("FIRST VALID ACCOUNT:", firstValid);

        setSelectedAccount(firstValid?.id ? String(firstValid.id) : "");
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

    console.log("FINAL selectedAccount:", selectedAccount);
    console.log("FINAL userId:", userId);
    console.log("FINAL amount:", amount);
    console.log("FINAL accounts:", accounts);

    if (!userId) {
      setType("error");
      setMessage("User not logged in");
      return;
    }

    if (!selectedAccount || Number(selectedAccount) <= 0) {
      setType("error");
      setMessage("Please select trading account");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setType("error");
      setMessage("Please enter payout amount");
      return;
    }

    const payload = {
      user_id: Number(userId),
      account_id: Number(selectedAccount),
      amount: String(amount),
    };

    console.log("Submitting payout payload:", payload);

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "https://api.fundednaira.net/api/dashboard/request-payout.php",
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
        console.error("JSON parse error:", error);

        setType("error");
        setMessage("Invalid server response");

        return;
      }

      if (result.success) {
        setType("success");

        setMessage(result.message || "Payout request submitted successfully ");

        setAmount("");
        setSelectedAccount("");

        setTimeout(() => {
          onClose();

          if (onSuccess) {
            onSuccess();
          }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19]/95 p-6 text-[#F3EFE6] backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold tracking-tight">
            Request Payout
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5B6B82] transition hover:bg-white/[0.06] hover:text-[#F3EFE6]"
          >
            <X size={20} />
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              type === "success"
                ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                : "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/30"
            }`}
          >
            {message}
          </div>
        )}

        {!hasPaymentDetails ? (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
            <div className="flex items-start gap-2">
              <CircleAlert size={18} className="mt-0.5 shrink-0 text-amber-300" />

              <div>
                <p className="text-sm text-amber-200">
                  No bank details found in your profile.
                </p>

                <Link
                  to="/profile"
                  className="mt-3 inline-block rounded-lg bg-amber-400/15 px-4 py-2 text-sm font-medium text-amber-200 ring-1 ring-inset ring-amber-400/30 transition hover:bg-amber-400/25"
                >
                  Add Bank Details
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                Saved Bank Details
              </p>

              <p className="text-[#93A0B4]">
                Account Name:{" "}
                <span className="text-[#F3EFE6]">
                  {paymentDetails.account_name}
                </span>
              </p>

              <p className="text-[#93A0B4]">
                Bank Name:{" "}
                <span className="text-[#F3EFE6]">
                  {paymentDetails.bank_name}
                </span>
              </p>

              <p className="text-[#93A0B4]">
                Account Number:{" "}
                <span className="text-[#F3EFE6]">
                  {paymentDetails.account_number}
                </span>
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#93A0B4]">
                Select Trading Account
              </label>

              <select
                value={selectedAccount}
                onChange={(e) => {
                  console.log("dropdown changed to:", e.target.value);

                  setSelectedAccount(e.target.value);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30 disabled:opacity-50"
                required
                disabled={loadingAccounts || validAccounts.length === 0}
              >
                <option value="" className="bg-[#0B0F19]">
                  Select trading account
                </option>

                {validAccounts.map((acc) => (
                  <option
                    key={acc.id}
                    value={String(acc.id)}
                    className="bg-[#0B0F19]"
                  >
                    Account ID: {acc.id} | Phase: {acc.phase || "N/A"} |
                    Status: {acc.status || "N/A"}
                  </option>
                ))}
              </select>

              {loadingAccounts && (
                <p className="mt-2 font-mono text-xs text-[#5B6B82]">
                  Loading accounts...
                </p>
              )}

              {!loadingAccounts && validAccounts.length === 0 && (
                <p className="mt-2 text-xs text-red-300">
                  No eligible accounts available. Failed accounts cannot
                  request payout.
                </p>
              )}
            </div>

            <input
              type="number"
              placeholder="Enter payout amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[#F3EFE6] outline-none transition placeholder:text-[#5B6B82] focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/30 disabled:opacity-50"
              required
              disabled={validAccounts.length === 0}
            />

            <button
              type="submit"
              disabled={loading || loadingAccounts || validAccounts.length === 0}
              className="w-full rounded-lg bg-emerald-400/15 py-3 font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 transition-all duration-200 hover:bg-emerald-400/25 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
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