import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PayoutModal from "../companent/PayoutReques";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { Wallet, CircleAlert, Download } from "lucide-react";

const Payout = () => {
  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState("");

  const getUser = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;
      return JSON.parse(rawUser);
    } catch (error) {
      console.error("getUser error:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?.user_id || null;
  };

  const fetchPaymentDetails = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `https://fundednaira.ng/api/dashboard/get-payment-details.php?user_id=${userId}`
      );
      const data = await res.json();

      if (data.success) {
        setPaymentDetails(data.details);
      } else {
        setPaymentDetails(null);
      }
    } catch (error) {
      console.error("fetchPaymentDetails error:", error);
      setPaymentDetails(null);
    }
  };

  const fetchHistory = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `https://fundednaira.ng/api/dashboard/get-payout-history.php?user_id=${userId}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchHistory error:", error);
      setHistory([]);
    }
  };

  useEffect(() => {
    const user = getUser();
    setUserStatus(String(user?.status || "").toLowerCase());

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPaymentDetails(), fetchHistory()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const hasPaymentDetails =
    paymentDetails &&
    paymentDetails.account_name &&
    paymentDetails.bank_name &&
    paymentDetails.account_number;

  const isFailedAccount = userStatus === "failed";
  const canRequestPayout = hasPaymentDetails && !isFailedAccount;

  const downloadCertificate = (item) => {
    if (!item.certificate) return;

    const fileUrl = `https://fundednaira.ng/item.certificate}`;
    window.open(fileUrl, "_blank");
  };

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 bg-gray-950 min-h-screen text-white">
          <h1 className="text-3xl font-bold mb-8">Payouts</h1>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Request Payout</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Submit your payout request using your saved bank details.
                    </p>
                  </div>
                </div>

                {isFailedAccount ? (
                  <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-4 flex items-start gap-2">
                    <CircleAlert size={18} className="mt-0.5" />
                    <p className="text-sm">
                      Your account is marked as failed. Failed accounts are not
                      eligible to request payout.
                    </p>
                  </div>
                ) : hasPaymentDetails ? (
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      <span className="text-gray-400">Account Name:</span>{" "}
                      {paymentDetails.account_name}
                    </p>
                    <p>
                      <span className="text-gray-400">Bank Name:</span>{" "}
                      {paymentDetails.bank_name}
                    </p>
                    <p>
                      <span className="text-gray-400">Account Number:</span>{" "}
                      {paymentDetails.account_number}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <CircleAlert size={18} className="mt-0.5" />
                      <p className="text-sm">
                        No bank details found. Please add your bank details in
                        your profile before requesting payout.
                      </p>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium"
                    >
                      Add Bank Details
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    if (canRequestPayout) {
                      setShowModal(true);
                    }
                  }}
                  disabled={!canRequestPayout}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    canRequestPayout
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Payout History</h2>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3 text-left">Amount</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Message</th>
                      <th className="text-left">Certificate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b border-gray-800">
                        <td className="py-4">{item.amount}</td>
                        <td>{item.date}</td>
                        <td>
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              item.status === "Paid"
                                ? "bg-green-500/20 text-green-400"
                                : item.status === "Rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="text-gray-300 max-w-[260px]">
                          {item.status === "Rejected" ? (
                            <span className="text-red-300 text-xs">
                              {item.note || "This payout request was rejected."}
                            </span>
                          ) : item.status === "Pending" ? (
                            <span className="text-yellow-300 text-xs">
                              Your payout request is under review.
                            </span>
                          ) : (
                            <span className="text-green-300 text-xs">
                              Payout completed successfully.
                            </span>
                          )}
                        </td>

                        <td>
                          {item.status === "Paid" && item.certificate ? (
                            <button
                              onClick={() => downloadCertificate(item)}
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              Not Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {history.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-400">
                          No payout history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <PayoutModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            paymentDetails={paymentDetails}
            onSuccess={fetchHistory}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Payout;