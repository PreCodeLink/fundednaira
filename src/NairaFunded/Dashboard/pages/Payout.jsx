import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PayoutModal from "../companent/PayoutReques";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { Wallet, CircleAlert, Download } from "lucide-react";
import TopSection from "../companent/TopSection";

const Payout = () => {
  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

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
        `https://api.fundednaira.net/api/dashboard/get-payment-details.php?user_id=${userId}`
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
        `https://api.fundednaira.net/api/dashboard/get-payout-history.php?user_id=${userId}`
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

  useEffect(() => {
    const pendingRequest = history.find((item) => item.status === "Pending");

    if (!pendingRequest) {
      setTimeLeft("");
      return;
    }

    const createdAt = new Date(pendingRequest.date);
    const expiry = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Processing...");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [history]);

  const hasPaymentDetails =
    paymentDetails &&
    paymentDetails.account_name &&
    paymentDetails.bank_name &&
    paymentDetails.account_number;

  const isFailedAccount = userStatus === "failed";
  const canRequestPayout = hasPaymentDetails && !isFailedAccount;

  const downloadCertificate = (item) => {
    if (!item.certificate) return;

    const fileUrl = `https://api.fundednaira.net/${item.certificate}`;
    window.open(fileUrl, "_blank");
  };

  const historyStatusStyles = {
    Paid: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
    Rejected: "bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/30",
    Pending: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
  };

  return (
    <Layout>
      <div
        className="relative flex min-h-screen pt-16"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.12), transparent), #05070D",
        }}
      >
        {/* faint grid mesh backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Sidebar />

        <div className="relative z-10 mx-auto w-full flex-1 md:ml-72 space-y-6 p-4 text-[#F3EFE6] md:max-w-4xl md:p-6">
          <TopSection />

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#38BDF8]/70">
              Finance
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
              Payouts
            </h1>
          </div>

          {/* REQUEST PAYOUT */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#F3EFE6]">
                      Request Payout
                    </h2>
                    <p className="mt-0.5 text-sm text-[#93A0B4]">
                      Submit your payout request using your saved bank details.
                    </p>
                  </div>
                </div>

                {isFailedAccount ? (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-red-300">
                    <CircleAlert size={18} className="mt-0.5 shrink-0" />
                    <p className="text-sm">
                      Your account is marked as failed. Failed accounts are not
                      eligible to request payout.
                    </p>
                  </div>
                ) : hasPaymentDetails ? (
                  <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-sm text-[#93A0B4]">
                    <p>
                      <span className="text-[#5B6B82]">Account Name:</span>{" "}
                      <span className="text-[#F3EFE6]">
                        {paymentDetails.account_name}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#5B6B82]">Bank Name:</span>{" "}
                      <span className="text-[#F3EFE6]">
                        {paymentDetails.bank_name}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#5B6B82]">Account Number:</span>{" "}
                      <span className="text-[#F3EFE6]">
                        {paymentDetails.account_number}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-amber-300 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-2">
                      <CircleAlert size={18} className="mt-0.5 shrink-0" />
                      <p className="text-sm">
                        No bank details found. Please add your bank details in
                        your profile before requesting payout.
                      </p>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-400/15 px-4 py-2 text-sm font-medium text-amber-200 ring-1 ring-inset ring-amber-400/30 transition hover:bg-amber-400/25"
                    >
                      Add Bank Details
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (canRequestPayout) {
                    setShowModal(true);
                  }
                }}
                disabled={!canRequestPayout}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  canRequestPayout
                    ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-400/25 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)]"
                    : "cursor-not-allowed bg-white/[0.03] text-[#5B6B82] ring-1 ring-inset ring-white/10"
                }`}
              >
                Request Payout
              </button>
            </div>
          </div>

          {/* PENDING BANNER */}
          {history.some((item) => item.status === "Pending") && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <h3 className="text-lg font-semibold text-amber-300">
                  Payout Request Pending
                </h3>
              </div>

              <p className="mt-2 text-sm text-[#93A0B4]">
                Expect your payment within 24 hours.
              </p>

              <div className="mt-3 font-mono text-2xl font-bold text-amber-300">
                {timeLeft}
              </div>
            </div>
          )}

          {/* HISTORY */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="border-b border-white/[0.06] px-5 py-4 md:px-6">
              <h2 className="text-sm font-semibold text-[#F3EFE6] md:text-base">
                Payout History
              </h2>
            </div>

            {loading ? (
              <p className="p-6 font-mono text-xs uppercase tracking-[0.2em] text-[#5B6B82]">
                Loading...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5B6B82]">
                      <th className="px-5 py-3 md:px-6">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Certificate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4 font-mono text-[#F3EFE6] md:px-6">
                          {item.amount}
                        </td>
                        <td className="px-4 py-4 font-mono text-[#93A0B4]">
                          {item.date}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              historyStatusStyles[item.status] ||
                              "bg-white/[0.05] text-[#93A0B4] ring-1 ring-inset ring-white/10"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="max-w-[260px] px-4 py-4 text-[#93A0B4]">
                          {item.status === "Rejected" ? (
                            <span className="text-xs text-red-300">
                              {item.note || "This payout request was rejected."}
                            </span>
                          ) : item.status === "Pending" ? (
                            <span className="text-xs text-amber-300">
                              Your payout request is under review.
                            </span>
                          ) : (
                            <span className="text-xs text-emerald-300">
                              Payout completed successfully.
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {item.status === "Paid" && item.certificate ? (
                            <button
                              onClick={() => downloadCertificate(item)}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#38BDF8]/15 px-3 py-2 text-xs font-medium text-[#38BDF8] ring-1 ring-inset ring-[#38BDF8]/30 transition hover:bg-[#38BDF8]/25"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          ) : (
                            <span className="text-xs text-[#5B6B82]">
                              Not Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {history.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-10 text-center font-mono text-xs text-[#5B6B82]"
                        >
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