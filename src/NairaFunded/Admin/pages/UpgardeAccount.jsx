import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";

import {
  AlertCircle,
  CheckCircle2,
  Check,
  Ban,
  Eye,
  Search,
  X,
} from "lucide-react";

const UpgradeAccount = () => {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("All");

  const [search, setSearch] = useState("");

  const requestsPerPage = 10;

  const [viewModal, setViewModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [newLogin, setNewLogin] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [rejectReason, setRejectReason] = useState("");

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

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
    }, 3000);
  };

  const closeMessage = () => {
    setMessage({
      show: false,
      type: "",
      text: "",
    });
  };

  const formatMoney = (value) => {
    if (!value) return "₦0";

    const number = Number(
      String(value).replace(/[^0-9.]/g, "")
    );

    if (Number.isNaN(number)) return value;

    return `₦${number.toLocaleString()}`;
  };

  const fetchRequests = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/admin/get-upgrade-requests.php"
      );

      const text = await res.text();

      console.log(text);

      const data = JSON.parse(text);

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setRequests([]);
        showMessage(
          "error",
          data.message || "Failed to fetch requests."
        );
      }
    } catch (err) {
      console.log(err);

      showMessage("error", "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((item) => {
    const statusMatch =
      statusFilter === "All"
        ? true
        : String(item.status)
            .toLowerCase()
            .includes(statusFilter.toLowerCase());

    const searchMatch =
      String(item.user_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(item.account_login || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(item.account_id || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const indexOfLast =
    currentPage * requestsPerPage;

  const indexOfFirst =
    indexOfLast - requestsPerPage;

  const currentRequests =
    filteredRequests.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages = Math.ceil(
    filteredRequests.length / requestsPerPage
  );

  const getStatusClass = (status) => {
    const lower = String(status).toLowerCase();

    if (lower === "pending") {
      return "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30";
    }

    if (lower === "approved") {
      return "bg-green-600/20 text-green-400 border border-green-500/30";
    }

    if (lower === "rejected") {
      return "bg-red-600/20 text-red-400 border border-red-500/30";
    }

    return "bg-gray-700/20 text-gray-300 border border-gray-700/30";
  };

  const openViewModal = (request) => {
    setSelectedRequest(request);

    setNewLogin("");

    setNewPassword("");

    setRejectReason("");

    setViewModal(true);
  };  const approveUpgrade = async () => {
    if (!selectedRequest) return;

    if (!newLogin.trim() || !newPassword.trim()) {
      showMessage(
        "error",
        "Please enter the new trading login and password."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/admin/approve-upgrade-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: selectedRequest.id,
            new_login: newLogin,
            new_password: newPassword,
          }),
        }
      );

      const text = await res.text();

      console.log(text);

      const data = JSON.parse(text);

      if (data.success) {
        showMessage("success", data.message);

        setViewModal(false);

        fetchRequests();
      } else {
        showMessage(
          "error",
          data.message || "Unable to approve request."
        );
      }
    } catch (err) {
      console.log(err);

      showMessage("error", "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const rejectUpgrade = async () => {
    if (!selectedRequest) return;

   try {
  setLoading(true);

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

  console.log("PHP Response:", text);

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    showMessage("error", text); // Show raw PHP error
    return;
  }

  if (data.success) {
    showMessage("success", data.message);
    setViewModal(false);
    fetchRequests();
  } else {
    showMessage(
      "error",
      data.message ||
        JSON.stringify(data)
    );
  }

} catch (err) {
  console.error(err);

  showMessage(
    "error",
    err.message
  );
} finally {
  setLoading(false);
}
  };

  return (
    <AdminLayout>

      {/* Toast */}

      {message.show && (
        <div className="fixed right-5 top-5 z-[100]">

          <div
            className={`flex min-w-[340px] max-w-[450px] items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl ${
              message.type === "success"
                ? "border-green-700 bg-green-950/95 text-green-200"
                : "border-red-700 bg-red-950/95 text-red-200"
            }`}
          >

            <div className="mt-1">

              {message.type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}

            </div>

            <div className="flex-1">

              <h4 className="font-semibold">

                {message.type === "success"
                  ? "Success"
                  : "Error"}

              </h4>

              <p className="mt-1 text-sm">

                {message.text}

              </p>

            </div>

            <button
              onClick={closeMessage}
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

          </div>

        </div>
      )}      {/* View Request Modal */}

      {viewModal && selectedRequest && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

          <div className="w-full max-w-3xl rounded-3xl border border-gray-800 bg-[#0F172A] shadow-2xl overflow-hidden">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-800 px-8 py-6">

              <div>

                <h2 className="text-2xl font-bold text-white">

                  Upgrade Request Details

                </h2>

                <p className="mt-1 text-sm text-gray-400">

                  Review this request before approving or rejecting it.

                </p>

              </div>

              <button
                onClick={() => setViewModal(false)}
                className="rounded-xl p-2 transition hover:bg-gray-800"
              >

                <X size={20} />

              </button>

            </div>

            <div className="max-h-[75vh] overflow-y-auto p-8">

              <div className="grid gap-6 lg:grid-cols-2">

                {/* User */}

                <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">

                  <h3 className="mb-5 text-lg font-semibold text-blue-400">

                    User Information

                  </h3>

                  <div className="space-y-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        Full Name

                      </p>

                      <p className="mt-1 font-medium">

                        {selectedRequest.user_name}

                      </p>

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        Email

                      </p>

                      <p className="mt-1">

                        {selectedRequest.email}

                      </p>

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        User ID

                      </p>

                      <p className="mt-1">

                        #{selectedRequest.user_id}

                      </p>

                    </div>

                  </div>

                </div>

                {/* Trading Account */}

                <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">

                  <h3 className="mb-5 text-lg font-semibold text-green-400">

                    Trading Account

                  </h3>

                  <div className="space-y-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        Account ID

                      </p>

                      <p className="mt-1">

                        ACC/{selectedRequest.account_id}

                      </p>

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        Current Login

                      </p>

                      <p className="mt-1">

                        {selectedRequest.account_login}

                      </p>

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500">

                        Current Password

                      </p>

                      <p className="mt-1">

                        {selectedRequest.account_password}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Upgrade Card */}

              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

                <h3 className="mb-6 text-lg font-semibold text-blue-400">

                  Upgrade Information

                </h3>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-gray-500">

                      Current Account Size

                    </p>

                    <p className="mt-2 text-2xl font-bold">

                      {formatMoney(selectedRequest.current_size)}

                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-wider text-gray-500">

                      Requested Size

                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-400">

                      {formatMoney(selectedRequest.requested_size)}

                    </p>

                  </div>

                </div>

              </div>

              {/* Admin Inputs */}

              <div className="mt-8 grid gap-6 lg:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-300">

                    New MT5 Login

                  </label>

                  <input
                    value={newLogin}
                    onChange={(e) =>
                      setNewLogin(e.target.value)
                    }
                    placeholder="Enter upgraded login"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-300">

                    New MT5 Password

                  </label>

                  <input
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter upgraded password"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition focus:border-blue-500"
                  />

                </div>

              </div>



              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">

                <button
                  onClick={rejectUpgrade}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3 font-semibold transition hover:bg-red-700"
                >

                  <Ban size={18} />

                  Reject Request

                </button>

                <button
                  onClick={approveUpgrade}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold transition hover:bg-green-700"
                >

                  <Check size={18} />

                  Approve Upgrade

                </button>

              </div>

            </div>

          </div>

        </div>

      )}      {/* Header */}

      <div className="relative p-6 text-white">

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-3xl font-bold">

              Upgrade Requests

            </h2>

            <p className="mt-2 text-gray-400">

              Review and manage challenge account scale-up requests.

            </p>

          </div>

        </div>

        {/* Search & Filter */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row">

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
              placeholder="Search by user, request ID or account..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 outline-none"
          >

            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>

          </select>

        </div>

        {/* Table */}

        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">

          <div className="overflow-x-auto">

            <table className="w-full text-xs">

              <thead className="border-b border-gray-800 bg-gray-950/40 text-gray-400">

                <tr>

                  <th className="px-4 py-4 text-left">

                    Request #

                  </th>

                  <th className="text-left">

                    User

                  </th>

                  <th className="text-left">

                    Account

                  </th>

                  <th className="text-left">

                    Current Size

                  </th>

                  <th className="text-left">

                    Requested

                  </th>

                  <th className="text-left">

                    Status

                  </th>

                  <th className="text-left">

                    Date

                  </th>

                  <th className="px-4 text-right">

                    Action

                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="py-12 text-center text-gray-400"
                    >

                      Loading upgrade requests...

                    </td>

                  </tr>

                ) : currentRequests.length > 0 ? (

                  currentRequests.map((request) => (

                    <tr
                      key={request.id}
                      className="border-b border-gray-800 transition hover:bg-gray-800/40"
                    >

                      <td className="px-4 py-5">

                        #{request.id}

                      </td>

                      <td>

                        <div>

                          <p className="font-medium">

                            {request.user_name}

                          </p>

                          <p className="text-xs text-gray-500">

                            {request.email}

                          </p>

                        </div>

                      </td>

                      <td>

                        ACC/{request.account_id}

                      </td>

                      <td>

                        {formatMoney(request.current_size)}

                      </td>

                      <td className="font-semibold text-blue-400">

                        {formatMoney(request.requested_size)}

                      </td>

                      <td>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            request.status
                          )}`}
                        >

                          {request.status}

                        </span>

                      </td>

                      <td>

                        {request.created_at}

                      </td>

                      <td className="px-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setRejectReason("");
                              setNewLogin("");
                              setNewPassword("");
                              setViewModal(true);
                            }}
                            className="rounded-xl bg-blue-600 px-5 py-2 font-medium transition hover:bg-blue-700"
                          >

                            View

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="py-12 text-center text-gray-400"
                    >

                      No upgrade requests found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg bg-gray-800 px-4 py-2 disabled:opacity-40"
            >

              Prev

            </button>

            {Array.from({ length: totalPages }, (_, i) => {

              const page = i + 1;

              return (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >

                  {page}

                </button>

              );

            })}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg bg-gray-800 px-4 py-2 disabled:opacity-40"
            >

              Next

            </button>

          </div>

        )}

      </div>

    </AdminLayout>

  );

};

export default UpgradeAccount;