import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../Layout";

import {
  Search,
  RefreshCw,
  WalletCards,
  CheckCircle2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Eye,
  X,
} from "lucide-react";

const DailyPayouts = () => {
  const [payouts, setPayouts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPayout, setSelectedPayout] =
    useState(null);

  const [summary, setSummary] = useState({
    count: 0,
    requested_total: 0,
    received_total: 0,
  });

  const [today, setToday] = useState("");

  const perPage = 10;

  /* =====================================================
     FORMAT MONEY
  ====================================================== */

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₦0";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "₦0";
    }

    return `₦${number.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  /* =====================================================
     FETCH DAILY PAYOUTS
  ====================================================== */

  const fetchDailyPayouts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-daily-payouts.php"
      );

      const data = await res.json();

      if (data.success) {
        setPayouts(
          Array.isArray(data.payouts)
            ? data.payouts
            : []
        );

        setSummary(
          data.summary || {
            count: 0,
            requested_total: 0,
            received_total: 0,
          }
        );

        setToday(data.display_date || "");
      } else {
        setPayouts([]);

        setSummary({
          count: 0,
          requested_total: 0,
          received_total: 0,
        });
      }
    } catch (error) {
      console.error(
        "Daily payouts error:",
        error
      );

      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyPayouts();
  }, []);

  /* =====================================================
     SEARCH
  ====================================================== */

  const filteredPayouts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return payouts;
    }

    return payouts.filter((payout) => {
      return (
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
          .includes(query) ||

        String(payout.account_id || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [payouts, search]);

  /* =====================================================
     PAGINATION
  ====================================================== */

  const totalPages = Math.ceil(
    filteredPayouts.length / perPage
  );

  const indexOfLast =
    currentPage * perPage;

  const indexOfFirst =
    indexOfLast - perPage;

  const currentData =
    filteredPayouts.slice(
      indexOfFirst,
      indexOfLast
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  /* =====================================================
     STATUS
  ====================================================== */

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "paid" ||
      value === "success"
    ) {
      return {
        wrapper:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

        icon: (
          <CheckCircle2 size={14} />
        ),

        label: "Paid",
      };
    }

    return {
      wrapper:
        "border border-gray-700 bg-gray-800 text-gray-400",

      icon: <Clock3 size={14} />,

      label: status || "Unknown",
    };
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <CalendarDays size={22} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Daily Payouts
              </h1>

            </div>

            <p className="text-sm text-gray-400">
              Track all successful payouts made today.
            </p>
          </div>

          <button
            onClick={fetchDailyPayouts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* =====================================================
            DATE
        ====================================================== */}

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-5 py-4">

          <CalendarDays
            size={18}
            className="text-blue-400"
          />

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Nigeria Local Date
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-200">
              {today || "Loading..."}
            </p>
          </div>

          <span className="ml-auto hidden rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400 sm:block">
            Africa/Lagos
          </span>

        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* TOTAL RECEIVED */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Today's Paid Payout
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  {formatMoney(
                    summary.received_total
                  )}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  80% received by traders
                </p>

              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <WalletCards size={20} />
              </div>

            </div>

          </div>

          {/* COUNT */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Paid Today
                </p>

                <h3 className="mt-2 text-2xl font-bold text-blue-400">
                  {Number(
                    summary.count || 0
                  ).toLocaleString()}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Successful payout requests
                </p>

              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <CheckCircle2 size={20} />
              </div>

            </div>

          </div>

          {/* REQUESTED TOTAL */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Total Requested
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-200">
                  {formatMoney(
                    summary.requested_total
                  )}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Before 20% split
                </p>

              </div>

              <div className="rounded-xl bg-gray-800 p-3 text-gray-400">
                <WalletCards size={20} />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-5">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search user, email, bank, account number..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />

          </div>

        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

          <div className="border-b border-gray-800 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Today's Paid Payouts
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredPayouts.length} payout
                  {filteredPayouts.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

              <span className="hidden rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-400 sm:block">
                Showing{" "}
                {currentData.length} of{" "}
                {filteredPayouts.length}
              </span>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/60 text-xs uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-5 py-4 text-left">
                    User
                  </th>

                  <th className="text-left">
                    Bank Details
                  </th>

                  <th className="text-left">
                    Requested
                  </th>

                  <th className="text-left">
                    Received
                  </th>

                  <th className="text-left">
                    Time
                  </th>

                  <th className="text-left">
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
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <RefreshCw
                          size={28}
                          className="mb-3 animate-spin text-blue-500"
                        />

                        <p className="text-sm text-gray-400">
                          Loading today's payouts...
                        </p>

                      </div>

                    </td>
                  </tr>
                ) : currentData.length > 0 ? (

                  currentData.map(
                    (payout) => {

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
                                  payout.user ||
                                  "U"
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

                          {/* REQUESTED */}

                          <td>

                            <span className="font-medium text-gray-400">
                              {formatMoney(
                                payout.requested_amount
                              )}
                            </span>

                          </td>

                          {/* RECEIVED */}

                          <td>

                            <span className="font-semibold text-emerald-400">
                              {formatMoney(
                                payout.receive_amount
                              )}
                            </span>

                          </td>

                          {/* TIME */}

                          <td>

                            <span className="text-gray-400">
                              {payout.time ||
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

                          <td className="px-5 py-4 text-right">

                            <button
                              onClick={() =>
                                setSelectedPayout(
                                  payout
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
                            >

                              <Eye size={15} />

                              View

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                          <WalletCards
                            size={25}
                          />
                        </div>

                        <h3 className="font-medium text-gray-300">
                          No payouts today
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          No successful payouts have been made today.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {totalPages > 0 && (

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-sm text-gray-500">
              Page{" "}
              {currentPage} of{" "}
              {totalPages}
            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage(
                    (p) =>
                      Math.max(
                        p - 1,
                        1
                      )
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

                    if (
                      totalPages <= 5
                    ) {
                      pageNumber =
                        i + 1;

                    } else if (
                      currentPage <= 3
                    ) {
                      pageNumber =
                        i + 1;

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
                  setCurrentPage(
                    (p) =>
                      Math.min(
                        p + 1,
                        totalPages
                      )
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="inline-flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next

                <ChevronRight
                  size={16}
                />

              </button>

            </div>

          </div>

        )}

        {/* =====================================================
            PAYOUT DETAILS MODAL
        ====================================================== */}

        {selectedPayout && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedPayout(null)
            }
          >

            <div
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-800 bg-[#0B0F19] shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4 sm:px-6">

                <div>

                  <div className="flex items-center gap-2">

                    <WalletCards
                      size={19}
                      className="text-blue-400"
                    />

                    <h2 className="font-semibold text-white">
                      Payout Details
                    </h2>

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Payout #
                    {selectedPayout.id}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedPayout(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              {/* CONTENT */}

              <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">

                {/* TRADER */}

                <div className="mb-5 rounded-xl border border-gray-800 bg-gray-900 p-4">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Trader
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold uppercase text-blue-400 ring-1 ring-blue-500/20">

                      {String(
                        selectedPayout.user ||
                        "U"
                      ).charAt(0)}

                    </div>

                    <div>

                      <p className="font-semibold text-white">
                        {selectedPayout.user ||
                          "Unknown User"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {selectedPayout.email ||
                          "No email"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ACCOUNT DETAILS */}

                <div className="mb-5">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Trading Account
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <DetailItem
                      label="Account ID"
                      value={
                        selectedPayout.account_id
                          ? `AC/${selectedPayout.account_id}`
                          : "N/A"
                      }
                    />

                    <DetailItem
                      label="Account Size"
                      value={
                        selectedPayout.account_size
                          ? formatMoney(
                              selectedPayout.account_size
                            )
                          : "N/A"
                      }
                    />

                    <DetailItem
                      label="Login"
                      value={
                        selectedPayout.login ||
                        selectedPayout.account_login ||
                        "N/A"
                      }
                      mono
                    />

                    <DetailItem
                      label="Password"
                      value={
                        selectedPayout.password ||
                        selectedPayout.account_password ||
                        "N/A"
                      }
                      mono
                    />

                    <div className="sm:col-span-2">

                      <DetailItem
                        label="Server"
                        value={
                          selectedPayout.server ||
                          "N/A"
                        }
                        mono
                      />

                    </div>

                  </div>

                </div>

                {/* BANK DETAILS */}

                <div className="mb-5">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Bank Details
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <DetailItem
                      label="Bank Name"
                      value={
                        selectedPayout.bank_name ||
                        "N/A"
                      }
                    />

                    <DetailItem
                      label="Account Number"
                      value={
                        selectedPayout.account_number ||
                        "N/A"
                      }
                      mono
                    />

                    <div className="sm:col-span-2">

                      <DetailItem
                        label="Account Name"
                        value={
                          selectedPayout.account_name ||
                          "N/A"
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* PAYOUT INFORMATION */}

                <div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Payout Information
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <DetailItem
                      label="Requested Amount"
                      value={formatMoney(
                        selectedPayout.requested_amount
                      )}
                    />

                    <DetailItem
                      label="Trader Receives"
                      value={formatMoney(
                        selectedPayout.receive_amount
                      )}
                      highlight
                    />

                    <DetailItem
                      label="Date"
                      value={
                        selectedPayout.date ||
                        selectedPayout.created_at ||
                        "N/A"
                      }
                    />

                    <DetailItem
                      label="Time"
                      value={
                        selectedPayout.time ||
                        "N/A"
                      }
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex justify-end border-t border-gray-800 px-5 py-4 sm:px-6">

                <button
                  onClick={() =>
                    setSelectedPayout(null)
                  }
                  className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

/* =====================================================
   DETAIL ITEM
====================================================== */

const DetailItem = ({
  label,
  value,
  mono = false,
  highlight = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">

      <p className="mb-1 text-[11px] uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p
        className={`break-all text-sm font-medium ${
          highlight
            ? "text-emerald-400"
            : "text-gray-200"
        } ${
          mono
            ? "font-mono"
            : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
};

export default DailyPayouts;