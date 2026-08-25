import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";

import {
  Search,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Payments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const perPage = 10;

  // =========================
  // FORMAT MONEY
  // =========================
  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "₦0";
    }

    const number = Number(
      String(value).replace(/[^0-9.-]/g, "")
    );

    if (Number.isNaN(number)) {
      return `₦${value}`;
    }

    return `₦${number.toLocaleString()}`;
  };

  // =========================
  // FORMAT STATUS
  // =========================
  const formatStatus = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "success") return "Successful";
    if (s === "pending") return "Pending";
    if (s === "failed") return "Failed";

    return status || "Unknown";
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "success") {
      return "border border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (s === "pending") {
      return "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    if (s === "failed") {
      return "border border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border border-gray-700 bg-gray-800 text-gray-400";
  };

  // =========================
  // FETCH PAYMENTS
  // =========================
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-payments.php"
      );

      const text = await res.text();

      console.log("payments raw response:", text);

      let data = [];

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("payments parse error:", error);
        data = [];
      }

      setPayments(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("fetchPayments error:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // =========================
  // STATISTICS
  // =========================
  const statistics = useMemo(() => {
    let successful = 0;
    let pending = 0;
    let failed = 0;
    let totalRevenue = 0;

    payments.forEach((payment) => {
      const status = String(payment.status || "").toLowerCase();

      if (status === "success") {
        successful++;
        totalRevenue += Number(
          String(payment.amount || 0).replace(/[^0-9.-]/g, "")
        ) || 0;
      }

      if (status === "pending") {
        pending++;
      }

      if (status === "failed") {
        failed++;
      }
    });

    return {
      total: payments.length,
      successful,
      pending,
      failed,
      totalRevenue,
    };
  }, [payments]);

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredPayments = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const status = String(
        payment.status || ""
      ).toLowerCase();

      const statusMatch =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      const searchMatch =
        !searchValue ||
        String(payment.reference || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.user || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.plan_type || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.gateway || "")
          .toLowerCase()
          .includes(searchValue);

      return statusMatch && searchMatch;
    });
  }, [payments, search, statusFilter]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredPayments.length / perPage
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredPayments.slice(
    indexOfFirst,
    indexOfLast
  );

  // =========================
  // PAGE CHANGE
  // =========================
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
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

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-4 text-white sm:p-6">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <CreditCard size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Transactions
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Monitor and manage all payment transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-400 sm:block">
              Powered by{" "}
              <span className="font-semibold text-white">
                Squad
              </span>
            </div>

            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

          </div>
        </div>

        {/* =========================
            STATISTICS
        ========================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Total Transactions
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {statistics.total.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <CreditCard size={21} />
              </div>

            </div>
          </div>

          {/* Successful */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Successful
                </p>

                <h3 className="mt-2 text-2xl font-bold text-green-400">
                  {statistics.successful.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <CheckCircle2 size={21} />
              </div>

            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Pending
                </p>

                <h3 className="mt-2 text-2xl font-bold text-yellow-400">
                  {statistics.pending.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <Clock3 size={21} />
              </div>

            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Successful Revenue
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  {formatMoney(
                    statistics.totalRevenue
                  )}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <CreditCard size={21} />
              </div>

            </div>
          </div>
        </div>

        {/* =========================
            FILTER BAR
        ========================= */}
        <div className="mb-5 rounded-2xl border border-gray-800 bg-gray-900 p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search reference, user, email, plan..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-11 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />

            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Success">
                Successful
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>

          </div>
        </div>

        {/* =========================
            RESULTS INFO
        ========================= */}
        <div className="mb-3 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Showing{" "}
            <span className="font-medium text-gray-300">
              {filteredPayments.length === 0
                ? 0
                : indexOfFirst + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-300">
              {Math.min(
                indexOfLast,
                filteredPayments.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-300">
              {filteredPayments.length}
            </span>{" "}
            transactions
          </p>

          {search || statusFilter !== "All" ? (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setCurrentPage(1);
              }}
              className="text-left text-blue-400 hover:text-blue-300 sm:text-right"
            >
              Clear filters
            </button>
          ) : null}

        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/60">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">

                  <th className="px-5 py-4">
                    Reference
                  </th>

                  <th className="px-4 py-4">
                    Customer
                  </th>

                  <th className="px-4 py-4">
                    Plan
                  </th>

                  <th className="px-4 py-4">
                    Amount
                  </th>

                  <th className="px-4 py-4">
                    Gateway
                  </th>

                  <th className="px-4 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">

                        <RefreshCw
                          size={25}
                          className="mb-3 animate-spin text-blue-500"
                        />

                        <p className="text-sm text-gray-400">
                          Loading transactions...
                        </p>

                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (

                  currentData.map((payment) => (

                    <tr
                      key={payment.id}
                      className="border-b border-gray-800/80 transition hover:bg-gray-800/40"
                    >

                      {/* Reference */}
                      <td className="px-5 py-5">

                        <div className="flex flex-col">

                          <span className="font-mono text-xs font-medium text-blue-400">
                            {payment.reference || "N/A"}
                          </span>

                          <span className="mt-1 text-[11px] text-gray-600">
                            TXN #{payment.id}
                          </span>

                        </div>

                      </td>

                      {/* Customer */}
                      <td className="px-4 py-5">

                        <div className="flex flex-col">

                          <span className="font-medium text-gray-200">
                            {payment.user || "Unknown User"}
                          </span>

                          <span className="mt-1 text-xs text-gray-500">
                            {payment.email || "No email"}
                          </span>

                        </div>

                      </td>

                      {/* Plan */}
                      <td className="px-4 py-5">

                        <div className="flex flex-col">

                          <span className="font-medium capitalize text-gray-200">
                            {payment.plan_type || "N/A"}
                          </span>

                          <span className="mt-1 text-xs text-gray-500">
                            {payment.plan_size
                              ? `₦${Number(
                                  payment.plan_size
                                ).toLocaleString()}`
                              : "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* Amount */}
                      <td className="px-4 py-5">

                        <span className="font-semibold text-white">
                          {formatMoney(
                            payment.amount
                          )}
                        </span>

                      </td>

                      {/* Gateway */}
                      <td className="px-4 py-5">

                        <span className="rounded-lg border border-gray-800 bg-gray-950 px-2.5 py-1.5 text-xs capitalize text-gray-300">
                          {payment.gateway || "N/A"}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-4 py-5">

                        <span className="text-xs text-gray-400">
                          {payment.date || "N/A"}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >

                          {String(
                            payment.status || ""
                          ).toLowerCase() ===
                          "success" ? (
                            <CheckCircle2 size={13} />
                          ) : String(
                              payment.status || ""
                            ).toLowerCase() ===
                            "pending" ? (
                            <Clock3 size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}

                          {formatStatus(
                            payment.status
                          )}

                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                          <CreditCard size={25} />
                        </div>

                        <h3 className="font-semibold text-gray-300">
                          No transactions found
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          Try changing your search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* =========================
            PAGINATION
        ========================= */}
        {totalPages > 1 && (

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-medium text-gray-300">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-300">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                onClick={() =>
                  changePage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">
                  Previous
                </span>
              </button>

              {/* Pages */}
              <div className="flex items-center gap-1">

                {getPageNumbers().map((page) => (

                  <button
                    key={page}
                    onClick={() =>
                      changePage(page)
                    }
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "border border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>

                ))}

              </div>

              {/* Next */}
              <button
                onClick={() =>
                  changePage(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                className="flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">
                  Next
                </span>
                <ChevronRight size={16} />
              </button>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Payments;