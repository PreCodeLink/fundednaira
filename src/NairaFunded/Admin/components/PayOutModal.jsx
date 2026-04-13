import { useEffect, useState } from "react";
import { X } from "lucide-react";

const PayoutModal = ({ payout, setPayout, updatePayout }) => {
  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!payout?.account_id) return;

      try {
        setLoadingDetails(true);

        const res = await fetch(
          `http://localhost/FundedNaira/api/admin/get-payout-account-details.php?account_id=${payout.account_id}`
        );
        const data = await res.json();

        if (data.success) {
          setAccountDetails(data.details);
        } else {
          setAccountDetails(null);
        }
      } catch (error) {
        console.error(error);
        setAccountDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    if (payout) {
      setCertificate(null);
      setAdminNote("");
      fetchAccountDetails();
    }
  }, [payout]);

  if (!payout) return null;

  const handleUpdate = async (status) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("payout_id", payout.id);
      formData.append("status", status);
      formData.append("admin_note", adminNote);

      if (status === "Paid" && certificate) {
        formData.append("certificate", certificate);
      }

      const res = await fetch(
        "http://localhost/FundedNaira/api/admin/update-payout-request.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (result.success) {
        updatePayout(payout.id, {
          status,
          certificate: result.certificate || "",
          note: adminNote,
        });
      } else {
        alert(result.message || "Failed to update payout");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl p-6 text-white relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setPayout(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-semibold mb-6">Payout Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                User Information
              </h4>
              <p>
                <span className="text-gray-400">User:</span> {payout.user}
              </p>
              <p>
                <span className="text-gray-400">Email:</span> {payout.email}
              </p>
              <p>
                <span className="text-gray-400">Account ID:</span>{" "}
                {payout.account_id}
              </p>
              <p>
                <span className="text-gray-400">Amount:</span> {payout.amount}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                Trading Account
              </h4>

              {loadingDetails ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : accountDetails ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Login:</span>{" "}
                    <span className="text-green-400">{accountDetails.login}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Password:</span>{" "}
                    <span className="text-green-400">{accountDetails.password}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Server:</span>{" "}
                    <span className="text-green-400">{accountDetails.server}</span>
                  </p>
                </div>
              ) : (
                <p className="text-red-400 text-sm">Failed to load account</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
                Bank Information
              </h4>
              <p>
                <span className="text-gray-400">Account Name:</span>{" "}
                {payout.account_name}
              </p>
              <p>
                <span className="text-gray-400">Bank Name:</span>{" "}
                {payout.bank_name}
              </p>
              <p>
                <span className="text-gray-400">Account Number:</span>{" "}
                {payout.account_number}
              </p>
            </div>

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

            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">
                Upload Payout Certificate (Required for Paid)
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertificate(e.target.files[0])}
                className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            disabled={loading}
            onClick={() => {
              if (!certificate) {
                alert("Please upload certificate before marking as paid");
                return;
              }
              handleUpdate("Paid");
            }}
            className="bg-green-600 hover:bg-green-700 py-3 rounded-xl disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : "Mark as Paid"}
          </button>

          <button
            disabled={loading}
            onClick={() => handleUpdate("Rejected")}
            className="bg-red-600 hover:bg-red-700 py-3 rounded-xl disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutModal;