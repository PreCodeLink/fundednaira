import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  RefreshCw,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PhaseModal from "../Components/PhaseModal";
import MPLayout from "../Components/Layout2";

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();

  const config = {
    approved: {
      label: "Approved",
      className:
        "border-green-500/20 bg-green-500/10 text-green-400",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
      icon: XCircle,
    },
    suspended: {
      label: "Suspended",
      className:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
      icon: Clock3,
    },
    pending: {
      label: "Pending",
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
      icon: Clock3,
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

const StatCard = ({ title, value, icon: Icon, iconClass }) => {
  return (
    <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

const PhaseRequests2 = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  /*
  |--------------------------------------------------------------------------
  | Authentication Failure
  |--------------------------------------------------------------------------
  */

  const handleAuthFailure = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff");

    setSelectedRequest(null);

    navigate("/auth/staff", { replace: true });
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Phase 2 Requests
  |--------------------------------------------------------------------------
  */

  const fetchRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("staff_token");

      /*
      |--------------------------------------------------------------------------
      | No Token
      |--------------------------------------------------------------------------
      */

      if (!token) {
        handleAuthFailure();
        return;
      }

      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/get-phase-requests.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Authentication Check
      |--------------------------------------------------------------------------
      */

      if (res.status === 401 || res.status === 403) {
        handleAuthFailure();
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Read Response
      |--------------------------------------------------------------------------
      */

      const text = await res.text();

      console.log("PHASE 2 REQUESTS RAW:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON response:", text);
        throw new Error("Invalid server response");
      }

      /*
      |--------------------------------------------------------------------------
      | Filter Phase 2
      |--------------------------------------------------------------------------
      */

      if (Array.isArray(data)) {
        const phaseRequests = data.filter(
          (item) =>
            String(item.requested_phase || "").toLowerCase() ===
            "2"
        );

        setRequests(phaseRequests);
      } else if (Array.isArray(data.requests)) {
        const phaseRequests = data.requests.filter(
          (item) =>
            String(item.requested_phase || "").toLowerCase() ===
            "2"
        );

        setRequests(phaseRequests);
      } else {
        setRequests([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error("fetchRequests error:", error);
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search + Status Filter
  |--------------------------------------------------------------------------
  */

  const filteredRequests = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return requests.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.full_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.status || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.current_phase || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.requested_phase || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | Reset Pagination
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | Handle Modal Update
  |--------------------------------------------------------------------------
  */

  const handleUpdated = (id, status, note) => {
    const updatedRequests = requests.map((item) =>
      String(item.id) === String(id)
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

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "pending"
  ).length;

  const approvedRequests = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "approved"
  ).length;

  const rejectedRequests = requests.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "rejected"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    filteredRequests.length / perPage
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredRequests.slice(
    indexOfFirst,
    indexOfLast
  );

  /*
  |--------------------------------------------------------------------------
  | Date Formatting
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MPLayout>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">

          {/* Header */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-blue-600/10 p-2 text-blue-400">
                  <FileText size={20} />
                </div>

                <span className="text-sm font-medium text-blue-400">
                  Phase 2 Management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Phase Requests
              </h1>

              <p className="mt-2 text-sm text-gray-400 md:text-base">
                Review and manage traders requesting access
                to Phase 2.
              </p>
            </div>

            <button
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Statistics */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Requests"
              value={totalRequests}
              icon={FileText}
              iconClass="bg-blue-500/10 text-blue-400"
            />

            <StatCard
              title="Pending Requests"
              value={pendingRequests}
              icon={Clock3}
              iconClass="bg-yellow-500/10 text-yellow-400"
            />

            <StatCard
              title="Approved Requests"
              value={approvedRequests}
              icon={CheckCircle2}
              iconClass="bg-green-500/10 text-green-400"
            />

            <StatCard
              title="Rejected Requests"
              value={rejectedRequests}
              icon={XCircle}
              iconClass="bg-red-500/10 text-red-400"
            />
          </div>

          {/* Main Card */}

          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

            {/* Toolbar */}

            <div className="border-b border-gray-800 p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="font-semibold text-white">
                    Request Management
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredRequests.length} request
                    {filteredRequests.length !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* Search */}

                  <div className="relative w-full sm:w-72">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="text"
                      placeholder="Search trader or email..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-700 bg-gray-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                    />
                  </div>

                  {/* Status */}

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-blue-500"
                  >
                    <option value="all">
                      All Status
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                    <option value="suspended">
                      Suspended
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/50 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Trader
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Current
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Requested
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map(
                      (_, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-800/70"
                        >
                          <td className="px-6 py-5">
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-4 w-44 animate-pulse rounded bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-4 w-12 animate-pulse rounded bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-4 w-12 animate-pulse rounded bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />
                          </td>

                          <td className="px-6 py-5">
                            <div className="ml-auto h-9 w-24 animate-pulse rounded-lg bg-gray-800" />
                          </td>
                        </tr>
                      )
                    )
                  ) : currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-800/70 transition hover:bg-gray-800/30"
                      >
                        {/* Trader */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-sm font-bold text-blue-400">
                              {String(
                                item.full_name || "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium text-white">
                                {item.full_name || "Unknown"}
                              </p>

                              <p className="text-xs text-gray-600">
                                Request #{item.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}

                        <td className="px-6 py-4 text-sm text-gray-400">
                          {item.email || "—"}
                        </td>

                        {/* Current Phase */}

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300">
                            Phase {item.current_phase || "—"}
                          </span>
                        </td>

                        {/* Requested Phase */}

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                            Phase {item.requested_phase || "—"}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={item.status}
                          />
                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDate(item.created_at)}
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedRequest(item)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-600/10 px-3.5 py-2 text-sm font-medium text-blue-400 transition hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
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
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-4 rounded-2xl bg-gray-800 p-4 text-gray-500">
                            <FileText size={28} />
                          </div>

                          <h3 className="font-semibold text-gray-300">
                            No requests found
                          </h3>

                          <p className="mt-2 text-sm text-gray-500">
                            Try changing your search or
                            status filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            {!loading && totalPages > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
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
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.max(p - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <div className="hidden items-center gap-1 sm:flex">
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => {
                        let pageNumber;

                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (
                          currentPage >=
                          totalPages - 2
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
                              setCurrentPage(
                                pageNumber
                              )
                            }
                            className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <span className="text-sm text-gray-500 sm:hidden">
                    Page {currentPage} of {totalPages}
                  </span>

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
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}

        {selectedRequest && (
          <PhaseModal
            data={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onUpdated={handleUpdated}
          />
        )}
      </div>
    </MPLayout>
  );
};

export default PhaseRequests2;