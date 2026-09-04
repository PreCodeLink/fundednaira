import { useEffect, useState } from "react";
import {
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import StaffLayoutPR from "../Components/LayoutPR";

const StaffManagePendingsReferrals = () => {
  const API_BASE = "https://api.fundednaira.net/api/admin";

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  // =========================
  // FETCH PENDING WITHDRAWALS
  // =========================

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/referral-withdrawals.php`
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.log("Server response:", text);
        setError("Invalid server response");
        return;
      }

      if (!data.success) {
        setError(
          data.message || "Failed to load withdrawals"
        );
        return;
      }

      // Only pending withdrawals
      const pendingWithdrawals = (data.withdrawals || []).filter(
        (item) =>
          String(item.status || "").toLowerCase() === "pending"
      );

      setWithdrawals(pendingWithdrawals);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    withdrawals.length / limit
  );

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }

    if (totalPages === 0 && page !== 1) {
      setPage(1);
    }
  }, [totalPages, page]);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = withdrawals.slice(start, end);

  // =========================
  // UPDATE STATUS
  // =========================

  const handleAction = async (id, status) => {
    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_BASE}/update-referral-withdrawal.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(
          data.message || "Failed to update request"
        );
        return;
      }

      setMessage(
        data.message || "Request updated successfully"
      );

      // Remove from pending list immediately
      setWithdrawals((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setShowModal(false);
      setSelected(null);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to update request");
    } finally {
      setProcessing(false);
    }
  };

  // =========================
  // STATUS BADGE
  // =========================

  const StatusBadge = ({ status }) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          <CheckCircle size={13} />
          Paid
        </span>
      );
    }

    if (value === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
          <XCircle size={13} />
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
        <Clock3 size={13} />
        Pending
      </span>
    );
  };

  // =========================
  // PAGE NUMBERS
  // =========================

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
    ];
  };

  return (
    <StaffLayoutPR>
      <div className="min-h-screen bg-gray-950 p-4 text-white md:p-6">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Pending Referral Withdrawals
            </h1>

            <p className="mt-2 text-gray-400">
              Review and manage pending referral withdrawal requests.
            </p>
          </div>

          <button
            onClick={fetchWithdrawals}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* =========================
            ALERTS
        ========================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-red-300 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* =========================
            SUMMARY
        ========================= */}

        <div className="mb-6">
          <div className="rounded-2xl border border-yellow-500/20 bg-gray-900 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Total Pending Referral Withdrawals
                </p>

                <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                  {withdrawals.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                <Clock3
                  size={24}
                  className="text-yellow-400"
                />
              </div>

            </div>
          </div>
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-sm">

              <thead className="bg-gray-800/70 text-gray-300">

                <tr>
                  <th className="p-4 text-left">
                    User
                  </th>

                  <th className="p-4 text-left">
                    Bank
                  </th>

                  <th className="p-4 text-left">
                    Account
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-right">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-10 text-center text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-3">

                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />

                        Loading pending withdrawals...

                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-10 text-center text-gray-400"
                    >
                      No pending referral withdrawals found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-800 transition hover:bg-gray-800/40"
                    >

                      {/* USER */}

                      <td className="p-4">

                        <div>
                          <p className="font-medium">
                            {item.user_name || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ID: {item.id}
                          </p>
                        </div>

                      </td>

                      {/* BANK */}

                      <td className="p-4 text-gray-300">
                        {item.bank_name || "N/A"}
                      </td>

                      {/* ACCOUNT */}

                      <td className="p-4">
                        <p className="text-gray-300">
                          {item.account_number || "N/A"}
                        </p>
                      </td>

                      {/* AMOUNT */}

                      <td className="p-4 font-semibold text-yellow-400">
                        ₦
                        {Number(item.amount || 0).toLocaleString(
                          "en-NG",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="p-4">
                        <StatusBadge status="pending" />
                      </td>

                      {/* DATE */}

                      <td className="p-4 text-gray-400">
                        {item.created_at || "N/A"}
                      </td>

                      {/* ACTION */}

                      <td className="p-4 text-right">

                        <button
                          onClick={() => {
                            setSelected(item);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-700"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* =========================
            PAGINATION
        ========================= */}

        {totalPages > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) => Math.max(p - 1, 1))
              }
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                  page === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

        {/* =========================
            MODAL
        ========================= */}

        {showModal && selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >

            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    Withdrawal Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Request #{selected.id}
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              {/* DETAILS */}

              <div className="space-y-4">

                {/* USER */}

                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-xs text-gray-500">
                    User Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.user_name || "N/A"}
                  </p>
                </div>

                {/* ACCOUNT NAME + BANK */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-gray-800/50 p-4">
                    <p className="text-xs text-gray-500">
                      Account Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {selected.account_name || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-800/50 p-4">
                    <p className="text-xs text-gray-500">
                      Bank Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {selected.bank_name || "N/A"}
                    </p>
                  </div>

                </div>

                {/* ACCOUNT NUMBER */}

                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-xs text-gray-500">
                    Account Number
                  </p>

                  <p className="mt-1 font-semibold tracking-wide">
                    {selected.account_number || "N/A"}
                  </p>
                </div>

                {/* AMOUNT */}

                <div className="rounded-xl bg-gray-800/50 p-4">

                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-400">
                    ₦
                    {Number(selected.amount || 0).toLocaleString(
                      "en-NG",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                {/* STATUS + DATE */}

                <div className="flex items-center justify-between rounded-xl bg-gray-800/50 p-4">

                  <div>

                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <div className="mt-2">
                      <StatusBadge status="pending" />
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-gray-300">
                      {selected.created_at || "N/A"}
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {/* MARK PAID */}

                <button
                  disabled={processing}
                  onClick={() =>
                    handleAction(
                      selected.id,
                      "paid"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={18} />

                  {processing
                    ? "Processing..."
                    : "Mark as Paid"}
                </button>

                {/* CANCEL */}

                <button
                  disabled={processing}
                  onClick={() =>
                    handleAction(
                      selected.id,
                      "cancelled"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-medium transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle size={18} />

                  {processing
                    ? "Processing..."
                    : "Cancel"}
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </StaffLayoutPR>
  );
};

export default StaffManagePendingsReferrals;