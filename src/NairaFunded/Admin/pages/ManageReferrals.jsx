import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Building2,
  Wallet,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../Layout";

const API_BASE =
  "https://api.fundednaira.net/api/admin";

const formatMoney = (value) => {
  const number = Number(
    String(value ?? 0).replace(/[^0-9.-]/g, "")
  );

  if (Number.isNaN(number)) {
    return `₦${value || 0}`;
  }

  return `₦${number.toLocaleString()}`;
};

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();

  if (value === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
        <CheckCircle2 size={13} />
        Paid
      </span>
    );
  }

  if (value === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
        <XCircle size={13} />
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
      <Clock3 size={13} />
      Pending
    </span>
  );
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 transition hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {value}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const ManageReferrals = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);

  const limit = 10;

  const fetchWithdrawals = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await fetch(
        `${API_BASE}/referral-withdrawals.php`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch withdrawal requests."
        );
      }

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid response:", text);
        throw new Error(
          "Invalid server response."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch withdrawals."
        );
      }

      setWithdrawals(data.withdrawals || []);
      setPage(1);
    } catch (err) {
      console.error(
        "fetchWithdrawals error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch withdrawals."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredWithdrawals = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return withdrawals.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.user_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.account_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.bank_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.account_number || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.id || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    withdrawals,
    search,
    statusFilter,
  ]);

  const pendingCount = withdrawals.filter(
    (item) =>
      String(item.status).toLowerCase() ===
      "pending"
  ).length;

  const paidCount = withdrawals.filter(
    (item) =>
      String(item.status).toLowerCase() ===
      "paid"
  ).length;

  const cancelledCount =
    withdrawals.filter(
      (item) =>
        String(item.status).toLowerCase() ===
        "cancelled"
    ).length;

  const pendingAmount = withdrawals
    .filter(
      (item) =>
        String(item.status).toLowerCase() ===
        "pending"
    )
    .reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  const totalPages = Math.ceil(
    filteredWithdrawals.length / limit
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated =
    filteredWithdrawals.slice(start, end);

  const handleAction = async (
    id,
    status
  ) => {
    try {
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
        throw new Error(
          data.message ||
            "Failed to update request."
        );
      }

      setMessage(
        data.message ||
          "Withdrawal updated successfully."
      );

      setWithdrawals((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

      setSelected(null);
      setShowModal(false);
    } catch (err) {
      console.error(
        "handleAction error:",
        err
      );

      setError(
        err.message ||
          "Failed to update request."
      );
    }
  };

  const openModal = (item) => {
    setSelected(item);
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setSelected(null);
    setShowModal(false);
  };

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
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-6 text-white md:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Users size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Referral Withdrawals
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Review and manage referral commission withdrawal requests.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={() =>
              fetchWithdrawals(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Requests"
            value={withdrawals.length}
            description="All withdrawal requests"
            icon={Users}
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            description="Awaiting payment"
            icon={Clock3}
            iconClass="bg-yellow-500/10 text-yellow-400"
          />

          <StatCard
            title="Paid"
            value={paidCount}
            description="Successfully processed"
            icon={CheckCircle2}
            iconClass="bg-green-500/10 text-green-400"
          />

          <StatCard
            title="Pending Amount"
            value={formatMoney(
              pendingAmount
            )}
            description="Total awaiting payment"
            icon={Wallet}
            iconClass="bg-purple-500/10 text-purple-400"
          />

        </div>

        {/* Alerts */}
        {(message || error) && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
              error
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-green-500/20 bg-green-500/10 text-green-400"
            }`}
          >
            {error ? (
              <AlertCircle
                size={19}
                className="mt-0.5"
              />
            ) : (
              <CheckCircle2
                size={19}
                className="mt-0.5"
              />
            )}

            <div className="flex-1">
              <p className="text-sm font-medium">
                {error || message}
              </p>
            </div>

            <button
              onClick={() => {
                setMessage("");
                setError("");
              }}
              className="opacity-60 transition hover:opacity-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search by user, bank, account number or request ID..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-3 text-sm text-gray-200 outline-none focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b border-gray-800 bg-gray-950/70">

                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">

                  <th className="px-6 py-4">
                    Request
                  </th>

                  <th className="px-6 py-4">
                    User
                  </th>

                  <th className="px-6 py-4">
                    Bank
                  </th>

                  <th className="px-6 py-4">
                    Account
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">

                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

                        <p className="mt-4 text-sm text-gray-400">
                          Loading withdrawal requests...
                        </p>

                      </div>
                    </td>
                  </tr>
                ) : paginated.length > 0 ? (
                  paginated.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800/80 transition hover:bg-gray-800/40"
                    >

                      <td className="px-6 py-5">
                        <span className="font-mono text-sm font-medium text-blue-400">
                          #{item.id}
                        </span>
                      </td>

                      <td className="px-6 py-5">

                        <div>
                          <p className="font-semibold">
                            {item.user_name ||
                              "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.email ||
                              "Referral user"}
                          </p>
                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">
                          <Building2
                            size={16}
                            className="text-gray-500"
                          />

                          <span className="text-sm text-gray-300">
                            {item.bank_name ||
                              "N/A"}
                          </span>
                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-mono text-sm text-gray-300">
                          {item.account_number ||
                            "N/A"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="font-semibold text-yellow-400">
                          {formatMoney(
                            item.amount
                          )}
                        </span>

                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-400">
                        {item.created_at ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            openModal(item)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="rounded-full bg-gray-800 p-4">
                          <Users
                            size={25}
                            className="text-gray-500"
                          />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-300">
                          No withdrawal requests found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or status filter.
                        </p>

                      </div>

                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* Results + pagination */}
        {!loading &&
          filteredWithdrawals.length >
            0 && (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-300">
                  {start + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-300">
                  {Math.min(
                    end,
                    filteredWithdrawals.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-300">
                  {
                    filteredWithdrawals.length
                  }
                </span>{" "}
                requests
              </p>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">

                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.max(
                          p - 1,
                          1
                        )
                      )
                    }
                    disabled={page === 1}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {getPageNumbers().map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          setPage(
                            pageNumber
                          )
                        }
                        className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                          page ===
                          pageNumber
                            ? "bg-blue-600 text-white"
                            : "border border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          p + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={
                      page === totalPages
                    }
                    className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>
              )}

            </div>
          )}

        {/* Modal */}
        {showModal && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-gray-800 bg-[#0F172A] shadow-2xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">

                <div>
                  <h2 className="text-xl font-bold">
                    Withdrawal Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Request #{selected.id}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              {/* Modal Body */}
              <div className="max-h-[70vh] overflow-y-auto p-6">

                {/* Amount */}
                <div className="mb-6 rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-5">

                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Withdrawal Amount
                  </p>

                  <p className="mt-2 text-3xl font-bold text-yellow-400">
                    {formatMoney(
                      selected.amount
                    )}
                  </p>

                  <div className="mt-3">
                    <StatusBadge
                      status={
                        selected.status
                      }
                    />
                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      User Name
                    </p>

                    <p className="mt-1 font-medium text-white">
                      {selected.user_name ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Account Name
                    </p>

                    <p className="mt-1 font-medium text-white">
                      {selected.account_name ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Bank Name
                    </p>

                    <p className="mt-1 font-medium text-white">
                      {selected.bank_name ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Account Number
                    </p>

                    <p className="mt-1 font-mono font-medium text-white">
                      {selected.account_number ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-gray-300">
                      {selected.created_at ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Request ID
                    </p>

                    <p className="mt-1 font-mono text-blue-400">
                      #{selected.id}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                {String(
                  selected.status
                ).toLowerCase() ===
                  "pending" && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">

                    <button
                      onClick={() =>
                        handleAction(
                          selected.id,
                          "paid"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold transition hover:bg-green-700"
                    >
                      <CheckCircle2
                        size={18}
                      />
                      Mark as Paid
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          selected.id,
                          "cancelled"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
                    >
                      <XCircle
                        size={18}
                      />
                      Cancel Request
                    </button>

                  </div>
                )}

                {String(
                  selected.status
                ).toLowerCase() !==
                  "pending" && (
                  <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center text-sm text-gray-400">
                    This withdrawal request has already been processed.
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageReferrals;