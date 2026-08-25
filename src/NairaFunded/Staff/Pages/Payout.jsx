import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  RefreshCw,
  Wallet,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import PayoutModal from "../Components/PayOutModal";
import StaffLayoutPR from "../Components/LayoutPR";

const Payouts = () => {
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const perPage = 10;

  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-payout-requests.php"
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setPayouts(data);
      } else {
        setPayouts([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error("fetchPayouts error:", error);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // Search + Status Filter
  const filteredPayouts = payouts.filter((payout) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      String(payout.user || "")
        .toLowerCase()
        .includes(keyword) ||
      String(payout.email || "")
        .toLowerCase()
        .includes(keyword) ||
      String(payout.bank_name || "")
        .toLowerCase()
        .includes(keyword) ||
      String(payout.account_number || "")
        .toLowerCase()
        .includes(keyword) ||
      String(payout.amount || "")
        .toLowerCase()
        .includes(keyword);

    const matchesStatus =
      statusFilter === "All"
        ? true
        : String(payout.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayouts.length / perPage);

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredPayouts.slice(
    indexOfFirst,
    indexOfLast
  );

  // Keep page valid after filtering
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const updatePayout = (id, updates) => {
    const updated = payouts.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );

    setPayouts(updated);
    setSelected(null);
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (value === "pending") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getStatusIcon = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return <CheckCircle2 size={14} />;
    }

    if (value === "pending") {
      return <Clock3 size={14} />;
    }

    return <XCircle size={14} />;
  };

  const pendingCount = payouts.filter(
    (p) => String(p.status || "").toLowerCase() === "pending"
  ).length;

  const paidCount = payouts.filter(
    (p) => String(p.status || "").toLowerCase() === "paid"
  ).length;

  return (
    <StaffLayoutPR>
      <div className="min-h-screen bg-[#0B0F19] p-6 text-white md:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600/10 p-3">
                <Wallet
                  size={24}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  Payout Requests
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Review and manage trader payout requests.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchPayouts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Total Requests
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {payouts.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3">
                <Wallet
                  size={22}
                  className="text-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Pending
                </p>

                <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                  {pendingCount}
                </h2>
              </div>

              <div className="rounded-xl bg-yellow-500/10 p-3">
                <Clock3
                  size={22}
                  className="text-yellow-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Paid
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-400">
                  {paidCount}
                </h2>
              </div>

              <div className="rounded-xl bg-green-500/10 p-3">
                <CheckCircle2
                  size={22}
                  className="text-green-400"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Search & Filter */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search user, email, bank or account number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/60">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400">

                  <th className="px-5 py-4">
                    Trader
                  </th>

                  <th className="px-5 py-4">
                    Bank
                  </th>

                  <th className="px-5 py-4">
                    Account Number
                  </th>

                  <th className="px-5 py-4">
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">

                        <RefreshCw
                          size={24}
                          className="animate-spin text-blue-500"
                        />

                        <p className="text-gray-400">
                          Loading payout requests...
                        </p>

                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-b border-gray-800/70 transition hover:bg-gray-800/40"
                    >

                      {/* User */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {payout.user || "Unknown User"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {payout.email || "No email"}
                          </p>
                        </div>
                      </td>

                      {/* Bank */}
                      <td className="px-5 py-4 text-gray-300">
                        {payout.bank_name || "N/A"}
                      </td>

                      {/* Account */}
                      <td className="px-5 py-4 font-mono text-gray-300">
                        {payout.account_number || "N/A"}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold text-white">
                        {payout.amount || "₦0"}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-400">
                        {payout.date || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                            payout.status
                          )}`}
                        >
                          {getStatusIcon(payout.status)}
                          {payout.status || "Unknown"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelected(payout)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium transition hover:bg-blue-700"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">

                        <Wallet
                          size={32}
                          className="text-gray-600"
                        />

                        <p className="font-medium text-gray-300">
                          No payout requests found
                        </p>

                        <p className="text-sm text-gray-500">
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

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(p - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">

              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => {
                  let pageNumber;

                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (
                    currentPage >= totalPages - 2
                  ) {
                    pageNumber =
                      totalPages - 4 + i;
                  } else {
                    pageNumber =
                      currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() =>
                        setCurrentPage(pageNumber)
                      }
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}

              {totalPages > 5 &&
                currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-gray-500">
                      ...
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage(totalPages)
                      }
                      className="h-10 w-10 rounded-lg bg-gray-800 text-gray-300 transition hover:bg-gray-700"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

            </div>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

        {/* Modal */}
        <PayoutModal
          payout={selected}
          setPayout={setSelected}
          updatePayout={updatePayout}
        />

      </div>
    </StaffLayoutPR>
  );
};

export default Payouts;