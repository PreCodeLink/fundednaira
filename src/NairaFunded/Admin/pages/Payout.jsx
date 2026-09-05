import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import PayoutModal from "../components/PayOutModal";

import {
  Search,
  RefreshCw,
  WalletCards,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Payouts = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const perPage = 10;

  const API = "https://api.fundednaira.net/api/admin";

  // =========================
  // AUTH HEADERS
  // =========================
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // HANDLE UNAUTHORIZED
  // =========================
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth/admin", { replace: true });
  };

  // =========================
  // FORMAT MONEY
  // =========================
  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₦0";
    }

    const number = Number(
      String(value).replace(/[^0-9.-]/g, "")
    );

    if (Number.isNaN(number)) {
      return `₦${value}`;
    }

    return `₦${number.toLocaleString("en-NG")}`;
  };

  // =========================
  // STATUS
  // =========================
  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid" || value === "success") {
      return {
        wrapper:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
        label: "Paid",
      };
    }

    if (value === "pending") {
      return {
        wrapper:
          "border border-amber-500/20 bg-amber-500/10 text-amber-400",
        icon: <Clock3 size={14} />,
        label: "Pending",
      };
    }

    if (
      value === "rejected" ||
      value === "failed" ||
      value === "cancelled"
    ) {
      return {
        wrapper:
          "border border-red-500/20 bg-red-500/10 text-red-400",
        icon: <XCircle size={14} />,
        label:
          value.charAt(0).toUpperCase() +
          value.slice(1),
      };
    }

    return {
      wrapper:
        "border border-gray-700 bg-gray-800 text-gray-400",
      icon: <Clock3 size={14} />,
      label: status || "Unknown",
    };
  };

  // =========================
  // FETCH PAYOUTS
  // =========================
  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/get-payout-requests.php`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      // =========================
      // SECURITY CHECK
      // =========================
      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

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

  // =========================
  // FILTER
  // =========================
  const filteredPayouts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payouts.filter((payout) => {
      const status =
        String(payout.status || "").toLowerCase();

      const searchMatch =
        !query ||
        String(payout.user || "")
          .toLowerCase()
          .includes(query) ||
        String(payout.email || "")
          .toLowerCase()
          .includes(query) ||
        String(payout.bank_name || "")
          .toLowerCase()
          .includes(query) ||
        String(payout.account_number || "")
          .toLowerCase()
          .includes(query) ||
        String(payout.id || "")
          .toLowerCase()
          .includes(query);

      const statusMatch =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return searchMatch && statusMatch;
    });
  }, [payouts, search, statusFilter]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredPayouts.length / perPage
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredPayouts.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // =========================
  // SUMMARY
  // =========================
  const totalPayouts = payouts.length;

  const pendingPayouts = payouts.filter(
    (p) =>
      String(p.status || "").toLowerCase() ===
      "pending"
  ).length;

  const paidPayouts = payouts.filter((p) => {
    const status = String(
      p.status || ""
    ).toLowerCase();

    return status === "paid" || status === "success";
  }).length;

  const totalPaidAmount = payouts
    .filter((p) => {
      const status = String(
        p.status || ""
      ).toLowerCase();

      return status === "paid" || status === "success";
    })
    .reduce((total, p) => {
      const amount = Number(
        String(p.amount || 0).replace(
          /[^0-9.-]/g,
          ""
        )
      );

      return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

  // =========================
  // UPDATE PAYOUT
  // =========================
  const updatePayout = (id, updates) => {
    const updated = payouts.map((p) =>
      p.id === id
        ? { ...p, ...updates }
        : p
    );

    setPayouts(updated);
    setSelected(null);
  };

  // =========================
  // OPEN PAYOUT
  // =========================
  const openPayout = (payout) => {
    setSelected(payout);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20">
                <WalletCards size={22} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Payout Requests
              </h1>

            </div>

            <p className="text-sm text-gray-400">
              Review, process and manage customer
              withdrawal requests.
            </p>
          </div>

          <button
            onClick={fetchPayouts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Total Requests
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {totalPayouts.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <WalletCards size={20} />
              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Pending
                </p>

                <h3 className="mt-2 text-2xl font-bold text-amber-400">
                  {pendingPayouts.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <Clock3 size={20} />
              </div>

            </div>

          </div>

          {/* Paid */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Paid Requests
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  {paidPayouts.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>

            </div>

          </div>

          {/* Amount */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Total Paid
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {formatMoney(totalPaidAmount)}
                </h3>
              </div>

              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                <WalletCards size={20} />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            SEARCH / FILTER
        ===================================== */}

        <div className="mb-5 flex flex-col gap-3 md:flex-row">

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
              placeholder="Search user, email, bank, account number..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

        </div>

        {/* =====================================
            TABLE
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

          <div className="border-b border-gray-800 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Withdrawal Requests
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredPayouts.length} request
                  {filteredPayouts.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <span className="hidden rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-400 sm:block">
                Showing {currentData.length} of{" "}
                {filteredPayouts.length}
              </span>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/60 text-xs uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-5 py-4 text-left">
                    User
                  </th>

                  <th className="text-left">
                    Bank Details
                  </th>

                  <th className="text-left">
                    Amount
                  </th>

                  <th className="text-left">
                    Date
                  </th>

                  <th className="text-left">
                    Status
                  </th>

                  <th className="px-5 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <RefreshCw
                          size={28}
                          className="mb-3 animate-spin text-blue-500"
                        />

                        <p className="text-sm text-gray-400">
                          Loading payout requests...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : currentData.length > 0 ? (

                  currentData.map((payout) => {

                    const status =
                      getStatusStyle(
                        payout.status
                      );

                    return (

                      <tr
                        key={payout.id}
                        className="border-b border-gray-800/80 transition hover:bg-gray-800/40"
                      >

                        {/* USER */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-sm font-bold uppercase text-blue-400">
                              {String(
                                payout.user || "U"
                              ).charAt(0)}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-medium text-white">
                                {payout.user ||
                                  "Unknown User"}
                              </p>

                              <p className="truncate text-xs text-gray-500">
                                {payout.email ||
                                  "No email"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* BANK */}

                        <td>

                          <div>

                            <p className="font-medium text-gray-200">
                              {payout.bank_name ||
                                "N/A"}
                            </p>

                            <p className="mt-1 font-mono text-xs text-gray-500">
                              {payout.account_number ||
                                "N/A"}
                            </p>

                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td>

                          <span className="font-semibold text-white">
                            {formatMoney(
                              payout.amount
                            )}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <span className="text-sm text-gray-400">
                            {payout.date ||
                              "N/A"}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.wrapper}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 text-right">

                          <button
                            onClick={() =>
                              openPayout(
                                payout
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600 hover:text-white"
                          >
                            <Eye size={16} />
                            View
                          </button>

                        </td>

                      </tr>

                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                          <WalletCards size={25} />
                        </div>

                        <h3 className="font-medium text-gray-300">
                          No payout requests
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          No requests match your
                          current search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =====================================
            PAGINATION
        ===================================== */}

        {totalPages > 0 && (

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-sm text-gray-500">
              Page {currentPage} of{" "}
              {totalPages}
            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(p - 1, 1)
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="inline-flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <div className="hidden items-center gap-1 sm:flex">

                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      5
                    ),
                  },
                  (_, i) => {

                    let pageNumber;

                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (
                      currentPage <= 3
                    ) {
                      pageNumber = i + 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      pageNumber =
                        totalPages -
                        4 +
                        i;
                    } else {
                      pageNumber =
                        currentPage -
                        2 +
                        i;
                    }

                    return (

                      <button
                        key={pageNumber}
                        onClick={() =>
                          setCurrentPage(
                            pageNumber
                          )
                        }
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                          currentPage ===
                          pageNumber
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        {pageNumber}
                      </button>

                    );
                  }
                )}

              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      p + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="inline-flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>

            </div>

          </div>

        )}

        {/* =====================================
            PAYOUT MODAL
        ===================================== */}

        <PayoutModal
          payout={selected}
          setPayout={setSelected}
          updatePayout={updatePayout}
        />

      </div>
    </AdminLayout>
  );
};

export default Payouts;