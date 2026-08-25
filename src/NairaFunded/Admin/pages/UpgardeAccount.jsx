import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";

import {
  AlertCircle,
  CheckCircle2,
  Check,
  Ban,
  Search,
  X,
  Clock3,
  RefreshCw,
  User,
  Wallet,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const UpgradeAccount = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const requestsPerPage = 10;

  const [viewModal, setViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  /* =========================
     TOAST
  ========================= */

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

  /* =========================
     FORMAT MONEY
  ========================= */

  const formatMoney = (value) => {
    if (!value) return "₦0";

    const number = Number(
      String(value).replace(/[^0-9.]/g, "")
    );

    if (Number.isNaN(number)) return value;

    return `₦${number.toLocaleString()}`;
  };

  /* =========================
     FETCH REQUESTS
  ========================= */

  const fetchRequests = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-upgrade-requests.php"
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response.");
      }

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setRequests([]);

        showMessage(
          "error",
          data.message || "Failed to fetch upgrade requests."
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* =========================
     FILTERING
  ========================= */

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((item) => {
      const statusMatch =
        statusFilter === "All"
          ? true
          : String(item.status || "")
              .toLowerCase()
              .includes(statusFilter.toLowerCase());

      const searchMatch =
        !query ||
        String(item.user_name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.account_login || "")
          .toLowerCase()
          .includes(query) ||
        String(item.account_id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.email || "")
          .toLowerCase()
          .includes(query);

      return statusMatch && searchMatch;
    });
  }, [requests, statusFilter, search]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredRequests.length / requestsPerPage
  );

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;

  const currentRequests = filteredRequests.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1));
    }
  }, [totalPages, currentPage]);

  /* =========================
     STATISTICS
  ========================= */

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

  /* =========================
     STATUS
  ========================= */

  const getStatusStyle = (status) => {
    const lower = String(status || "").toLowerCase();

    if (lower === "pending") {
      return {
        wrapper:
          "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        icon: <Clock3 size={14} />,
      };
    }

    if (lower === "approved") {
      return {
        wrapper:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
      };
    }

    if (lower === "rejected") {
      return {
        wrapper:
          "border-red-500/20 bg-red-500/10 text-red-400",
        icon: <Ban size={14} />,
      };
    }

    return {
      wrapper:
        "border-gray-700 bg-gray-800/50 text-gray-400",
      icon: <AlertCircle size={14} />,
    };
  };

  /* =========================
     OPEN MODAL
  ========================= */

  const openViewModal = (request) => {
    setSelectedRequest(request);

    setNewLogin("");
    setNewPassword("");

    setViewModal(true);
  };

  const closeViewModal = () => {
    if (actionLoading) return;

    setViewModal(false);
    setSelectedRequest(null);
    setNewLogin("");
    setNewPassword("");
  };

  /* =========================
     APPROVE
  ========================= */

  const approveUpgrade = async () => {
    if (!selectedRequest) return;

    if (!newLogin.trim() || !newPassword.trim()) {
      showMessage(
        "error",
        "Please enter the new trading login and password."
      );

      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/approve-upgrade-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: selectedRequest.id,
            new_login: newLogin.trim(),
            new_password: newPassword.trim(),
          }),
        }
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Invalid server response.");
      }

      if (data.success) {
        showMessage(
          "success",
          data.message || "Upgrade approved successfully."
        );

        setViewModal(false);
        setSelectedRequest(null);

        await fetchRequests();
      } else {
        showMessage(
          "error",
          data.message || "Unable to approve request."
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Server error."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     REJECT
  ========================= */

  const rejectUpgrade = async () => {
    if (!selectedRequest) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this upgrade request?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/reject-upgrade-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedRequest.id,
          }),
        }
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Invalid server response.");
      }

      if (data.success) {
        showMessage(
          "success",
          data.message || "Upgrade request rejected."
        );

        setViewModal(false);
        setSelectedRequest(null);

        await fetchRequests();
      } else {
        showMessage(
          "error",
          data.message || "Unable to reject request."
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Server error."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#020617] text-white">
        {/* =========================
            TOAST
        ========================= */}

        {message.show && (
          <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-md">
            <div
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-xl ${
                message.type === "success"
                  ? "border-emerald-500/20 bg-emerald-950/90 text-emerald-200"
                  : "border-red-500/20 bg-red-950/90 text-red-200"
              }`}
            >
              <div className="mt-0.5">
                {message.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {message.type === "success"
                    ? "Success"
                    : "Something went wrong"}
                </p>

                <p className="mt-1 text-sm opacity-80">
                  {message.text}
                </p>
              </div>

              <button
                onClick={closeMessage}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-blue-400">
                <ArrowUpRight size={16} />
                <span>Account Management</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Upgrade Requests
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Review, approve and manage trading account
                upgrade requests submitted by users.
              </p>
            </div>

            <button
              onClick={fetchRequests}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>
          </div>

          {/* =========================
              STATS
          ========================= */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Requests"
              value={totalRequests}
              icon={<Wallet size={20} />}
              description="All upgrade requests"
            />

            <StatCard
              title="Pending"
              value={pendingRequests}
              icon={<Clock3 size={20} />}
              description="Awaiting review"
              iconClass="text-yellow-400 bg-yellow-500/10"
            />

            <StatCard
              title="Approved"
              value={approvedRequests}
              icon={<CheckCircle2 size={20} />}
              description="Successfully approved"
              iconClass="text-emerald-400 bg-emerald-500/10"
            />

            <StatCard
              title="Rejected"
              value={rejectedRequests}
              icon={<Ban size={20} />}
              description="Rejected requests"
              iconClass="text-red-400 bg-red-500/10"
            />
          </div>

          {/* =========================
              SEARCH / FILTER
          ========================= */}

          <div className="mb-6 rounded-2xl border border-gray-800 bg-[#0B1120] p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by user, email, account or request ID..."
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 pl-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-3 text-sm text-gray-300 outline-none focus:border-blue-500/50"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* =========================
              TABLE
          ========================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0B1120] shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <div>
                <h2 className="font-semibold text-white">
                  Upgrade Requests
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="hidden rounded-lg border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-gray-400 sm:block">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-sm">
                <thead className="border-b border-gray-800 bg-gray-950/50">
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4 font-medium">
                      Request
                    </th>

                    <th className="px-4 py-4 font-medium">
                      User
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Account
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Current
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Requested
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-4 font-medium">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <RefreshCw
                            size={28}
                            className="mb-3 animate-spin text-blue-500"
                          />

                          <p className="font-medium text-gray-300">
                            Loading requests...
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            Please wait
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : currentRequests.length > 0 ? (
                    currentRequests.map((request) => {
                      const statusStyle = getStatusStyle(
                        request.status
                      );

                      return (
                        <tr
                          key={request.id}
                          className="border-b border-gray-800/70 transition hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-5">
                            <span className="font-semibold text-white">
                              #{request.id}
                            </span>
                          </td>

                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <User size={17} />
                              </div>

                              <div>
                                <p className="font-medium text-gray-200">
                                  {request.user_name ||
                                    "Unknown User"}
                                </p>

                                <p className="mt-0.5 max-w-[190px] truncate text-xs text-gray-500">
                                  {request.email || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-5">
                            <span className="rounded-lg bg-gray-800 px-2.5 py-1.5 font-mono text-xs text-gray-300">
                              ACC/{request.account_id}
                            </span>
                          </td>

                          <td className="px-4 py-5 font-medium text-gray-300">
                            {formatMoney(
                              request.current_size
                            )}
                          </td>

                          <td className="px-4 py-5">
                            <div className="font-semibold text-blue-400">
                              {formatMoney(
                                request.requested_size
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${statusStyle.wrapper}`}
                            >
                              {statusStyle.icon}
                              {request.status}
                            </span>
                          </td>

                          <td className="px-4 py-5 text-xs text-gray-500">
                            {request.created_at || "—"}
                          </td>

                          <td className="px-5 py-5 text-right">
                            <button
                              onClick={() =>
                                openViewModal(request)
                              }
                              className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 transition hover:border-blue-500/40 hover:bg-blue-500/20"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-16 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                            <Search size={24} />
                          </div>

                          <h3 className="font-semibold text-gray-300">
                            No requests found
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
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
          </div>

          {/* =========================
              PAGINATION
          ========================= */}

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="hidden text-sm text-gray-500 sm:block">
                Showing {indexOfFirst + 1}–
                {Math.min(
                  indexOfLast,
                  filteredRequests.length
                )}{" "}
                of {filteredRequests.length}
              </p>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: totalPages },
                    (_, i) => {
                      const page = i + 1;

                      return (
                        <button
                          key={page}
                          onClick={() =>
                            setCurrentPage(page)
                          }
                          className={`h-9 min-w-9 rounded-xl px-2 text-sm font-medium transition ${
                            page === currentPage
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "text-gray-400 hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="flex items-center gap-1 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            REVIEW MODAL
        ========================= */}

        {viewModal && selectedRequest && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-800 bg-[#0B1120] shadow-2xl">
              {/* Modal Header */}

              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5 lg:px-8">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                      REQUEST #{selectedRequest.id}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs capitalize ${
                        getStatusStyle(
                          selectedRequest.status
                        ).wrapper
                      }`}
                    >
                      {
                        getStatusStyle(
                          selectedRequest.status
                        ).icon
                      }

                      {selectedRequest.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white lg:text-2xl">
                    Review Upgrade Request
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Verify the account details before
                    processing this request.
                  </p>
                </div>

                <button
                  onClick={closeViewModal}
                  className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="max-h-[78vh] overflow-y-auto p-6 lg:p-8">
                {/* USER + ACCOUNT */}

                <div className="grid gap-4 lg:grid-cols-2">
                  {/* User */}

                  <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <User size={19} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          User Information
                        </h3>

                        <p className="text-xs text-gray-500">
                          Account owner
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <InfoRow
                        label="Full Name"
                        value={
                          selectedRequest.user_name ||
                          "—"
                        }
                      />

                      <InfoRow
                        label="Email"
                        value={
                          selectedRequest.email || "—"
                        }
                      />

                      <InfoRow
                        label="User ID"
                        value={`#${selectedRequest.user_id}`}
                      />
                    </div>
                  </div>

                  {/* Account */}

                  <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Wallet size={19} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          Trading Account
                        </h3>

                        <p className="text-xs text-gray-500">
                          Current account
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <InfoRow
                        label="Account ID"
                        value={`ACC/${selectedRequest.account_id}`}
                        mono
                      />

                      <InfoRow
                        label="Current Login"
                        value={
                          selectedRequest.account_login ||
                          "—"
                        }
                        mono
                      />

                      <InfoRow
                        label="Current Password"
                        value={
                          selectedRequest.account_password ||
                          "—"
                        }
                        mono
                      />
                    </div>
                  </div>
                </div>

                {/* UPGRADE */}

                <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <ArrowUpRight size={19} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Upgrade Details
                      </h3>

                      <p className="text-xs text-gray-500">
                        Requested account scale
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Current Account Size
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-200">
                        {formatMoney(
                          selectedRequest.current_size
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-xs uppercase tracking-wider text-blue-400">
                        Requested Account Size
                      </p>

                      <p className="mt-2 text-2xl font-bold text-blue-400">
                        {formatMoney(
                          selectedRequest.requested_size
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NEW CREDENTIALS */}

                {String(
                  selectedRequest.status || ""
                ).toLowerCase() === "pending" && (
                  <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
                    <div className="mb-5">
                      <h3 className="font-semibold text-white">
                        New Trading Credentials
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Enter the credentials for the upgraded
                        account.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                          New MT5 Login
                        </label>

                        <input
                          value={newLogin}
                          onChange={(e) =>
                            setNewLogin(e.target.value)
                          }
                          placeholder="Enter new login"
                          disabled={actionLoading}
                          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                          New MT5 Password
                        </label>

                        <input
                          type="text"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(e.target.value)
                          }
                          placeholder="Enter new password"
                          disabled={actionLoading}
                          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:justify-between">
                  <button
                    onClick={closeViewModal}
                    disabled={actionLoading}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:opacity-40"
                  >
                    Close
                  </button>

                  {String(
                    selectedRequest.status || ""
                  ).toLowerCase() === "pending" && (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={rejectUpgrade}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Ban size={17} />

                        {actionLoading
                          ? "Processing..."
                          : "Reject Request"}
                      </button>

                      <button
                        onClick={approveUpgrade}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/10 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />

                            Processing...
                          </>
                        ) : (
                          <>
                            <Check size={17} />

                            Approve Upgrade
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  title,
  value,
  icon,
  description,
  iconClass = "bg-blue-500/10 text-blue-400",
}) => {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#0B1120] p-5 transition hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-600">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =========================
   INFO ROW
========================= */

const InfoRow = ({
  label,
  value,
  mono = false,
}) => {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm text-gray-300 ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default UpgradeAccount;