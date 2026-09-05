import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
  Layers3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import PhaseModal from "../components/PhaseModal";
import AdminLayout from "../Layout";

const API =
  "https://api.fundednaira.net/api/admin/get-phase-requests.php";

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();

  const config = {
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      className:
        "border-green-500/20 bg-green-500/10 text-green-400",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
    },
    suspended: {
      label: "Suspended",
      icon: Ban,
      className:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    },
    pending: {
      label: "Pending",
      icon: Clock3,
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
    },
  };

  const current = config[value] || config.pending;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${current.className}`}
    >
      <Icon size={13} />
      {current.label}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-sm transition hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const PhaseRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  // =========================
  // AUTH
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
  // FETCH REQUESTS
  // =========================

  const fetchRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(API, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      // Token expired / invalid
      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(
          "Failed to fetch phase requests."
        );
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (
        data &&
        Array.isArray(data.requests)
      ) {
        setRequests(data.requests);
      } else if (
        data &&
        Array.isArray(data.data)
      ) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error(
        "fetchRequests error:",
        error
      );

      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return requests.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.full_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.current_phase || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.requested_phase || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.status || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.id || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredRequests.length / perPage
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredRequests.slice(
    indexOfFirst,
    indexOfLast
  );

  // =========================
  // STATS
  // =========================

  const pendingCount = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "pending"
  ).length;

  const approvedCount = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "rejected"
  ).length;

  // =========================
  // UPDATED
  // =========================

  const handleUpdated = (id, status, note) => {
    const updatedRequests = requests.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            admin_note: note,
          }
        : item
    );

    setRequests(updatedRequests);
    setSelectedRequest(null);
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
      <div className="min-h-screen bg-gray-950 p-6 text-white md:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Layers3 size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Phase Requests
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Review and manage trader phase upgrade requests.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchRequests(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
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
            value={requests.length}
            icon={Layers3}
            description="All phase requests"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock3}
            description="Awaiting review"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            icon={CheckCircle2}
            description="Successfully approved"
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={XCircle}
            description="Requests rejected"
          />
        </div>

        {/* Search / Filter */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search by trader, email, phase, status or request ID..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-3 text-sm text-gray-200 outline-none transition focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Suspended">
                Suspended
              </option>
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">

              <thead className="border-b border-gray-800 bg-gray-950/70">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">

                  <th className="px-6 py-4">
                    Request
                  </th>

                  <th className="px-6 py-4">
                    Trader
                  </th>

                  <th className="px-6 py-4">
                    Current Phase
                  </th>

                  <th className="px-6 py-4">
                    Requested Phase
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
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">

                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

                        <p className="mt-4 text-sm text-gray-400">
                          Loading phase requests...
                        </p>

                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800/80 transition hover:bg-gray-800/40"
                    >

                      {/* Request */}
                      <td className="px-6 py-5">
                        <span className="font-mono text-sm font-medium text-blue-400">
                          #{item.id}
                        </span>
                      </td>

                      {/* Trader */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-white">
                            {item.full_name || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.email || "No email"}
                          </p>
                        </div>
                      </td>

                      {/* Current */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                          {item.current_phase || "N/A"}
                        </span>
                      </td>

                      {/* Requested */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400">
                          {item.requested_phase || "N/A"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-gray-400">
                        {item.created_at || "N/A"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            setSelectedRequest(item)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                          <Eye size={16} />
                          Manage
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">

                        <div className="rounded-full bg-gray-800 p-4">
                          <Layers3
                            size={25}
                            className="text-gray-500"
                          />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-300">
                          No phase requests found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
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

        {/* Results information */}
        {!loading &&
          filteredRequests.length > 0 && (
            <div className="mt-5 flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

              <p>
                Showing{" "}
                <span className="font-medium text-gray-300">
                  {indexOfFirst + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-300">
                  {Math.min(
                    indexOfLast,
                    filteredRequests.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-300">
                  {filteredRequests.length}
                </span>{" "}
                requests
              </p>

            </div>
          )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(p - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "border border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

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
              className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

        {/* Modal */}
        {selectedRequest && (
          <PhaseModal
            data={selectedRequest}
            onClose={() =>
              setSelectedRequest(null)
            }
            onUpdated={handleUpdated}
          />
        )}

      </div>
    </AdminLayout>
  );
};

export default PhaseRequests;