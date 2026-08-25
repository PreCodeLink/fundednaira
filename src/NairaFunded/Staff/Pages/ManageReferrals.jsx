import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import StaffLayoutPR from "../Components/LayoutPR";

const StaffManageReferrals = () => {
  const API_BASE = "https://api.fundednaira.net/api/admin";

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  // =========================
  // FETCH WITHDRAWALS
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
        setError(data.message || "Failed to load withdrawals");
        return;
      }

      setWithdrawals(data.withdrawals || []);
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
  // SEARCH
  // =========================

  const filteredWithdrawals = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return withdrawals;
    }

    return withdrawals.filter((item) => {
      return (
        String(item.user_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.account_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.account_number || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.bank_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.amount || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.status || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [withdrawals, search]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredWithdrawals.length / limit
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

  const paginated = filteredWithdrawals.slice(
    start,
    end
  );

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

      setWithdrawals((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : null
      );

      setShowModal(false);

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

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Referral Withdrawals
            </h1>

            <p className="mt-2 text-gray-400">
              Review and manage referral withdrawal requests.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search withdrawals..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 sm:w-72"
              />
            </div>

            <button
              onClick={fetchWithdrawals}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>
          </div>
        </div>

        {/* ALERTS */}

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
              className="text-red-300 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* SUMMARY */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm text-gray-400">
              Total Requests
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {withdrawals.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-gray-900 p-5">
            <p className="text-sm text-gray-400">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {
                withdrawals.filter(
                  (item) =>
                    String(item.status).toLowerCase() ===
                    "pending"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-gray-900 p-5">
            <p className="text-sm text-gray-400">
              Paid
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {
                withdrawals.filter(
                  (item) =>
                    String(item.status).toLowerCase() ===
                    "paid"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* TABLE */}

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
                        Loading withdrawal requests...
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-10 text-center text-gray-400"
                    >
                      {search
                        ? "No withdrawals match your search."
                        : "No withdrawal requests found."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-800 transition hover:bg-gray-800/40"
                    >

                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {item.user_name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ID: {item.id}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-gray-300">
                        {item.bank_name || "N/A"}
                      </td>

                      <td className="p-4">
                        <p className="text-gray-300">
                          {item.account_number || "N/A"}
                        </p>
                      </td>

                      <td className="p-4 font-semibold text-yellow-400">
                        ₦{item.amount}
                      </td>

                      <td className="p-4">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td className="p-4 text-gray-400">
                        {item.created_at}
                      </td>

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

        {/* PAGINATION */}

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

        {/* MODAL */}

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
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              {/* DETAILS */}

              <div className="space-y-4">

                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-xs text-gray-500">
                    User Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.user_name}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-gray-800/50 p-4">
                    <p className="text-xs text-gray-500">
                      Account Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {selected.account_name ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-800/50 p-4">
                    <p className="text-xs text-gray-500">
                      Bank Name
                    </p>

                    <p className="mt-1 font-semibold">
                      {selected.bank_name ||
                        "N/A"}
                    </p>
                  </div>

                </div>

                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-xs text-gray-500">
                    Account Number
                  </p>

                  <p className="mt-1 font-semibold tracking-wide">
                    {selected.account_number ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-400">
                    ₦{selected.amount}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-800/50 p-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        status={selected.status}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-gray-300">
                      {selected.created_at}
                    </p>
                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              {String(selected.status).toLowerCase() ===
                "pending" && (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">

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
              )}

            </div>
          </div>
        )}

      </div>
    </StaffLayoutPR>
  );
};

export default StaffManageReferrals;