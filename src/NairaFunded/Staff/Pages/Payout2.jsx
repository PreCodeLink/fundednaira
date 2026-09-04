import React, { useEffect, useState } from "react";
import {
  Eye,
  RefreshCw,
  Wallet,
  Clock3,
} from "lucide-react";
import PayoutModal from "../Components/PayOutModal2";
import StaffLayoutPR from "../Components/LayoutPS";

const PendingPayouts = () => {
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const perPage = 10;

  /* =========================
     FETCH PAYOUTS
  ========================= */

  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-payout-requests.php"
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        const pendingOnly = data.filter(
          (payout) =>
            String(payout.status || "")
              .toLowerCase() === "pending"
        );

        setPayouts(pendingOnly);
      } else {
        setPayouts([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error(
        "fetchPayouts error:",
        error
      );

      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  /* =========================
     PAGINATION
  ========================= */

  const totalPending = payouts.length;

  const totalPages = Math.ceil(
    totalPending / perPage
  );

  const indexOfLast =
    currentPage * perPage;

  const indexOfFirst =
    indexOfLast - perPage;

  const currentData = payouts.slice(
    indexOfFirst,
    indexOfLast
  );

  /* =========================
     KEEP PAGE VALID
  ========================= */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  /* =========================
     UPDATE PAYOUT
  ========================= */

  const updatePayout = (id, updates) => {
    setPayouts((prev) =>
      prev.filter((payout) => {
        if (payout.id !== id) {
          return true;
        }

        // Since this page only displays
        // pending payouts, remove it when
        // its status changes.
        return (
          String(updates?.status || "")
            .toLowerCase() === "pending"
        );
      })
    );

    setSelected(null);
  };

  return (
    <StaffLayoutPR>
      <div className="min-h-screen bg-[#0B0F19] p-4 text-white sm:p-6 md:p-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <Clock3
                size={18}
                className="text-yellow-400"
              />

              <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                Payout Management
              </span>

            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Pending Payouts
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review and process pending trader
              payout requests.
            </p>

          </div>

          <button
            onClick={fetchPayouts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              size={16}
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

        {/* ================= TOTAL PENDING ================= */}

        <div className="mb-7 rounded-2xl border border-yellow-500/20 bg-[#0B0F19] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Total Pending Payouts
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading
                  ? "..."
                  : totalPending}
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Payout requests waiting for
                processing
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">

              <Clock3
                size={22}
                className="text-yellow-400"
              />

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B0F19]">

          {/* TABLE HEADER */}

          <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Pending Payout Requests
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {totalPending} pending requests
                </p>

              </div>

              <Wallet
                size={20}
                className="text-blue-400"
              />

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="min-w-[1000px] w-full text-sm">

              <thead>

                <tr className="border-b border-white/[0.07] text-left text-gray-500">

                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider">
                    Trader
                  </th>

                  <th className="px-4 py-4 text-[11px] uppercase tracking-wider">
                    Bank
                  </th>

                  <th className="px-4 py-4 text-[11px] uppercase tracking-wider">
                    Account Number
                  </th>

                  <th className="px-4 py-4 text-[11px] uppercase tracking-wider">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-[11px] uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-4 py-4 text-[11px] uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] uppercase tracking-wider">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="py-16 text-center"
                    >

                      <RefreshCw
                        size={24}
                        className="mx-auto mb-3 animate-spin text-blue-400"
                      />

                      <p className="text-sm text-gray-500">
                        Loading pending payouts...
                      </p>

                    </td>

                  </tr>

                ) : currentData.length > 0 ? (

                  currentData.map(
                    (payout) => (

                      <tr
                        key={payout.id}
                        className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                      >

                        {/* TRADER */}

                        <td className="px-6 py-4">

                          <div>

                            <p className="font-medium text-white">
                              {payout.user ||
                                "Unknown User"}
                            </p>

                            <p className="mt-1 text-[11px] text-gray-600">
                              {payout.email ||
                                "No email"}
                            </p>

                          </div>

                        </td>

                        {/* BANK */}

                        <td className="px-4 py-4 text-gray-300">

                          {payout.bank_name ||
                            "N/A"}

                        </td>

                        {/* ACCOUNT NUMBER */}

                        <td className="px-4 py-4 font-mono text-gray-300">

                          {payout.account_number ||
                            "N/A"}

                        </td>

                        {/* AMOUNT */}

                        <td className="px-4 py-4 font-semibold text-white">

                          {payout.amount ||
                            "₦0"}

                        </td>

                        {/* DATE */}

                        <td className="px-4 py-4 text-gray-400">

                          {payout.date ||
                            "N/A"}

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            Pending

                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              setSelected(
                                payout
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
                          >

                            <Eye
                              size={15}
                            />

                            View

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="py-16 text-center"
                    >

                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                        <Clock3
                          size={20}
                          className="text-gray-600"
                        />

                      </div>

                      <p className="text-sm text-gray-400">
                        No pending payouts
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        All payout requests have
                        been processed.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (

            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:px-6">

              <p className="text-xs text-gray-500">

                Showing{" "}

                <span className="text-gray-300">
                  {indexOfFirst + 1}
                </span>

                {" - "}

                <span className="text-gray-300">
                  {Math.min(
                    indexOfLast,
                    totalPending
                  )}
                </span>

                {" of "}

                <span className="text-gray-300">
                  {totalPending}
                </span>

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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>

                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      5
                    ),
                  },
                  (_, i) => {

                    let page;

                    if (
                      totalPages <= 5
                    ) {
                      page = i + 1;
                    } else if (
                      currentPage <= 3
                    ) {
                      page = i + 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      page =
                        totalPages -
                        4 +
                        i;
                    } else {
                      page =
                        currentPage -
                        2 +
                        i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`h-9 w-9 rounded-lg text-xs font-medium transition ${
                          currentPage ===
                          page
                            ? "bg-gradient-to-r from-blue-600 to-sky-400 text-white"
                            : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>

              </div>

            </div>

          )}

        </div>

        {/* ================= MODAL ================= */}

        <PayoutModal
          payout={selected}
          setPayout={setSelected}
          updatePayout={updatePayout}
        />

      </div>
    </StaffLayoutPR>
  );
};

export default PendingPayouts;