import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayoutModal = ({ payout, setPayout, updatePayout }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [breachReason, setBreachReason] = useState("");

  const API_BASE = "https://api.fundednaira.net/api/admin";

  // ==============================
  // AUTH HEADERS
  // ==============================
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==============================
  // HANDLE UNAUTHORIZED
  // ==============================
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setPayout(null);

    navigate("/auth/admin", { replace: true });
  };

  // ==============================
  // FETCH ACCOUNT DETAILS
  // ==============================
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!payout?.account_id) return;

      try {
        setLoadingDetails(true);

        const res = await fetch(
          `${API_BASE}/get-payout-account-details.php?account_id=${payout.account_id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        const data = await res.json();

        if (data.success) {
          setAccountDetails(data.details);
        } else {
          setAccountDetails(null);
        }
      } catch (error) {
        console.error("Account details error:", error);
        setAccountDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    if (payout) {
      setCertificate(null);
      setAdminNote("");
      setAccountDetails(null);
      setShowBreachModal(false);
      setBreachReason("");

      fetchAccountDetails();
    }
  }, [payout]);

  if (!payout) return null;

  // ==============================
  // UPDATE PAYOUT
  // ==============================
  const handleUpdate = async (status) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const formData = new FormData();

      formData.append("payout_id", payout.id);
      formData.append("status", status);
      formData.append("admin_note", adminNote);

      if (status === "Paid" && certificate) {
        formData.append("certificate", certificate);
      }

      const res = await fetch(
        `${API_BASE}/update-payout-request.php`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const result = await res.json();

      if (result.success) {
        updatePayout(payout.id, {
          status,
          certificate: result.certificate || "",
          note: adminNote,
        });

        setPayout(null);
      } else {
        alert(result.message || "Failed to update payout");
      }
    } catch (error) {
      console.error("Update payout error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // BREACH ACCOUNT
  // ==============================
  const submitBreach = async () => {
    if (!breachReason.trim()) {
      alert("Please enter a breach reason");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(
        `${API_BASE}/update-account-status.php`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: payout.account_id,
            status: "failed",
            reason: breachReason.trim(),
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const result = await res.json();

      if (result.success) {
        alert("Account breached successfully");

        setShowBreachModal(false);
        setBreachReason("");
        setPayout(null);
      } else {
        alert(result.message || "Failed to breach account");
      }
    } catch (error) {
      console.error("Breach account error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl p-6 text-white relative max-h-[90vh] overflow-y-auto">

        {/* CLOSE */}
        <button
          onClick={() => setPayout(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-semibold mb-6">
          Payout Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            {/* USER INFORMATION */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                User Information
              </h4>

              <p>
                <span className="text-gray-400">User:</span>{" "}
                {payout.user}
              </p>

              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {payout.email}
              </p>

              <p>
                <span className="text-gray-400">Account ID:</span>{" "}
                {payout.account_id}
              </p>

              <p>
                <span className="text-gray-400">Amount:</span>{" "}
                {payout.amount}
              </p>
            </div>

            {/* TRADING ACCOUNT */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                Trading Account
              </h4>

              {loadingDetails ? (
                <p className="text-sm text-gray-400">
                  Loading...
                </p>
              ) : accountDetails ? (
                <div className="space-y-2 text-sm">

                  <p>
                    <span className="text-gray-400">
                      Login:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.login}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Password:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.password}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Server:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.server}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Account Type:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.type}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Account Size:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.size}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Current Phase:
                    </span>{" "}
                    <span className="text-green-400">
                      {accountDetails.type === "Challenge"
                        ? accountDetails.phase
                        : accountDetails.type}
                    </span>
                  </p>

                  {accountDetails.is_upgraded && (
                    <p>
                      <span className="text-gray-400">
                        Account:
                      </span>{" "}
                      <span className="text-blue-400 font-semibold">
                        Upgraded ✓
                      </span>
                    </p>
                  )}

                </div>
              ) : (
                <p className="text-red-400 text-sm">
                  Failed to load account
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* BANK INFORMATION */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                Bank Information
              </h4>

              <p>
                <span className="text-gray-400">
                  Account Name:
                </span>{" "}
                {payout.account_name}
              </p>

              <p>
                <span className="text-gray-400">
                  Bank Name:
                </span>{" "}
                {payout.bank_name}
              </p>

              <p>
                <span className="text-gray-400">
                  Account Number:
                </span>{" "}
                {payout.account_number}
              </p>
            </div>

            {/* ADMIN NOTE */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">
                Admin Note / Rejection Reason
              </label>

              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 p-3 rounded-lg border border-gray-700 text-sm outline-none resize-none"
                placeholder="Write note or rejection reason"
              />
            </div>

            {/* CERTIFICATE */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">
                Upload Payout Certificate (Required for Paid)
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setCertificate(e.target.files?.[0] || null)
                }
                className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

          {/* PAID */}
          <button
            disabled={loading}
            onClick={() => {
              if (!certificate) {
                alert(
                  "Please upload certificate before marking as paid"
                );
                return;
              }

              handleUpdate("Paid");
            }}
            className="bg-green-600 hover:bg-green-700 py-3 rounded-xl disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : "Mark as Paid"}
          </button>

          {/* REJECT */}
          <button
            disabled={loading}
            onClick={() => handleUpdate("Rejected")}
            className="bg-red-600 hover:bg-red-700 py-3 rounded-xl disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : "Reject"}
          </button>

          {/* BREACH */}
          <button
            disabled={loading}
            onClick={() => setShowBreachModal(true)}
            className="bg-orange-600 hover:bg-orange-700 py-3 rounded-xl disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : "Breach Account"}
          </button>
        </div>

        {/* BREACH MODAL */}
        {showBreachModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">

            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">

              <h3 className="text-lg font-semibold text-white mb-2">
                Breach Account
              </h3>

              <p className="text-sm text-gray-400 mb-4">
                Enter the reason for breaching this account.
              </p>

              <textarea
                rows={5}
                value={breachReason}
                onChange={(e) =>
                  setBreachReason(e.target.value)
                }
                placeholder="Enter breach reason..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-orange-500"
              />

              <div className="mt-4 flex gap-3">

                <button
                  onClick={() => {
                    setShowBreachModal(false);
                    setBreachReason("");
                  }}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={submitBreach}
                  disabled={loading}
                  className="w-full rounded-lg bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? "Please wait..." : "Confirm Breach"}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutModal;