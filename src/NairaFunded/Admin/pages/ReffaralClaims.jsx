import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  RefreshCw,
  Users,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import AdminLayout from "../Layout";

const API =
  "https://api.fundednaira.net/api/admin/claim-referral-account.php";

const ReferralClaims = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const perPage = 10;

  // =========================
  // ADMIN AUTH
  // =========================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth/admin", {
      replace: true,
    });
  };

  // =========================
  // MESSAGE
  // =========================

  const showMessage = (type, text) => {
    setMessage({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        show: false,
        type: "",
        text: "",
      });
    }, 3500);
  };

  const closeMessage = () => {
    setMessage({
      show: false,
      type: "",
      text: "",
    });
  };

  // =========================
  // FETCH CLAIMS
  // =========================

  const fetchClaims = async (isRefresh = false) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(API, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      // =========================
      // TOKEN EXPIRED / INVALID
      // =========================

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid API response:", text);
        throw new Error("Invalid server response.");
      }

      if (data.success) {
        setClaims(data.claims || []);

        if (isRefresh) {
          showMessage(
            "success",
            "Referral claims refreshed."
          );
        }
      } else {
        setClaims([]);

        showMessage(
          "error",
          data.message ||
            "Failed to load referral claims."
        );
      }
    } catch (error) {
      console.error("fetchClaims error:", error);

      showMessage(
        "error",
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // =========================
  // FILTERING
  // =========================

  const filteredClaims = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return claims.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.account_login || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.server || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, search, statusFilter]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredClaims.length / perPage
  );

  const safePage =
    totalPages > 0
      ? Math.min(currentPage, totalPages)
      : 1;

  const indexOfLast = safePage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentClaims = filteredClaims.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================
  // STATISTICS
  // =========================

  const totalClaims = claims.length;

  const claimedClaims = claims.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "claimed"
  ).length;

  const pendingClaims = claims.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "pending"
  ).length;

  // =========================
  // HELPERS
  // =========================

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "claimed") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (value === "pending") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    if (value === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const formatSize = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    const number = Number(
      String(value).replace(/[^0-9.]/g, "")
    );

    if (Number.isNaN(number)) {
      return value;
    }

    return `₦${number.toLocaleString()}`;
  };

  const getPaginationPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    if (safePage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (safePage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      safePage - 2,
      safePage - 1,
      safePage,
      safePage + 1,
      safePage + 2,
    ];
  };

  // =========================
  // UI
  // =========================

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-6 text-white md:p-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Referral Claims
            </h1>

            <p className="mt-2 text-gray-400">
              Manage affiliate reward account claims.
            </p>
          </div>

          <button
            onClick={() => fetchClaims(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* TOAST */}

        {message.show && (
          <div className="fixed right-5 top-5 z-[100]">
            <div
              className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
                message.type === "success"
                  ? "border-green-700 bg-green-950/95 text-green-200"
                  : "border-red-700 bg-red-950/95 text-red-200"
              }`}
            >
              <div className="mt-0.5">
                {message.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <X size={20} />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {message.type === "success"
                    ? "Success"
                    : "Error"}
                </p>

                <p className="mt-1 text-sm opacity-90">
                  {message.text}
                </p>
              </div>

              <button
                onClick={closeMessage}
                className="text-gray-400 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        )}

        {/* STATISTICS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Total Claims
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {totalClaims}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Claimed
                </p>

                <h3 className="mt-2 text-2xl font-bold text-green-400">
                  {claimedClaims}
                </h3>
              </div>

              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Pending
                </p>

                <h3 className="mt-2 text-2xl font-bold text-yellow-400">
                  {pendingClaims}
                </h3>
              </div>

              <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
                <Clock3 size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH / FILTER */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
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
              placeholder="Search by name, email, login or server..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="claimed">
              Claimed
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="border-b border-gray-800 bg-gray-950/60">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">
                    User
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Referrals
                  </th>

                  <th className="px-6 py-4">
                    MT5 Login
                  </th>

                  <th className="px-6 py-4">
                    Server
                  </th>

                  <th className="px-6 py-4">
                    Account Size
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw
                          size={25}
                          className="animate-spin text-blue-500"
                        />

                        <p className="mt-3 text-sm text-gray-400">
                          Loading referral claims...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentClaims.length > 0 ? (
                  currentClaims.map((item) => (
                    <tr
                      key={
                        item.id ||
                        item.account_login
                      }
                      className="border-b border-gray-800 transition last:border-0 hover:bg-gray-800/40"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white">
                          {item.name ||
                            "Unknown User"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {item.email || "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 font-medium text-sky-400">
                          {item.total_referrals ||
                            0}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {item.account_login ? (
                          <span className="font-mono text-gray-200">
                            {item.account_login}
                          </span>
                        ) : (
                          <span className="text-yellow-400">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {item.server || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 font-medium text-purple-400">
                          {formatSize(
                            item.size
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status ||
                            "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-gray-500">
                        {item.created_at || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                          <Users size={24} />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-200">
                          No referral claims found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search
                          or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}

        {totalPages > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(p - 1, 1)
                )
              }
              disabled={safePage === 1}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {getPaginationPages().map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() =>
                      setCurrentPage(
                        pageNumber
                      )
                    }
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                      safePage === pageNumber
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
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
                safePage === totalPages
              }
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* RESULTS INFO */}

        {!loading &&
          filteredClaims.length > 0 && (
            <div className="mt-4 text-center text-xs text-gray-500">
              Showing {indexOfFirst + 1}–
              {Math.min(
                indexOfLast,
                filteredClaims.length
              )}{" "}
              of {filteredClaims.length} claims
            </div>
          )}
      </div>
    </AdminLayout>
  );
};

export default ReferralClaims;