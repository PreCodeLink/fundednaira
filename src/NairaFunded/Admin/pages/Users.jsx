import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";
import UserToggleModal from "../components/UserModal";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const AdminUsers = () => {
  const API_BASE = "https://api.fundednaira.net/api/admin";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const usersPerPage = 10;
  const navigate = useNavigate();

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

  /* =========================
     FETCH USERS
  ========================= */

  const fetchUsers = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const headers = getAuthHeaders();

    if (!headers) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const query = new URLSearchParams({
      search,
      status: filter,
    }).toString();

    const res = await fetch(
      `${API_BASE}/get-users.php?${query}`,
      {
        method: "GET",
        headers,
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      setError("Invalid server response");
      setUsers([]);
      return;
    }

    if (!data.success) {
      setError(data.message || "Failed to fetch users");
      setUsers([]);
      return;
    }

    setUsers(
      Array.isArray(data.users)
        ? data.users
        : []
    );

  } catch (err) {
    console.error(err);

    setError("Unable to connect to the server.");
    setUsers([]);

  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [search, filter]);

  /* =========================
     AUTO CLEAR MESSAGE
  ========================= */

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  /* =========================
     FILTER
  ========================= */

  const filteredUsers = useMemo(() => {
    return Array.isArray(users)
      ? users
      : [];
  }, [users]);

  /* =========================
     STATISTICS
  ========================= */

  const totalUsers = filteredUsers.length;

  const activeUsers = filteredUsers.filter(
    (user) =>
      String(user.status).toLowerCase() ===
      "active"
  ).length;

  const suspendedUsers = filteredUsers.filter(
    (user) =>
      String(user.status).toLowerCase() ===
      "suspended"
  ).length;

  const pendingUsers = filteredUsers.filter(
    (user) =>
      String(user.status).toLowerCase() ===
      "pending"
  ).length;

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const indexOfLast =
    currentPage * usersPerPage;

  const indexOfFirst =
    indexOfLast - usersPerPage;

  const currentUsers =
    filteredUsers.slice(
      indexOfFirst,
      indexOfLast
    );

  /* =========================
     STATUS UPDATE
  ========================= */

  const handleStatusChange = async (userId, status) => {
  try {
    setError("");
    setMessage("");

    const headers = getAuthHeaders();

    if (!headers) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const res = await fetch(
      `${API_BASE}/update-user-status.php`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          status: status,
        }),
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      setError("Invalid server response");
      return;
    }

    if (!res.ok || !data.success) {
      setError(
        data.message ||
        "Failed to update status"
      );
      return;
    }

    setMessage(
      data.message ||
      "User status updated successfully"
    );

    setSelectedUser(null);

    await fetchUsers();

  } catch (err) {
    console.error(err);

    setError(
      "Server error. Please try again."
    );
  }
};

  /* =========================
     SUSPEND USER
  ========================= */

const handleSuspend = async (userId) => {
  const confirmed = window.confirm(
    "Are you sure you want to suspend this user?"
  );

  if (!confirmed) return;

  try {
    setError("");
    setMessage("");

    const headers = getAuthHeaders();

    if (!headers) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const res = await fetch(
      `${API_BASE}/suspend-user.php`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/admin");
      return;
    }

    const text = await res.text();

    console.log("Suspend response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      setError(
        `Server returned invalid JSON:\n${text}`
      );
      return;
    }

    if (!res.ok || !data.success) {
      setError(
        data.message ||
        "Failed to suspend user."
      );
      return;
    }

    setMessage(
      data.message ||
      "User suspended successfully."
    );

    setUsers((prev) =>
      prev.map((user) =>
        Number(user.id) === Number(userId)
          ? {
              ...user,
              status: "suspended",
            }
          : user
      )
    );

  } catch (err) {
    console.error(
      "SUSPEND USER ERROR:",
      err
    );

    setError(
      err.message ||
      "Server error."
    );
  }
};

  /* =========================
     STATUS STYLE
  ========================= */

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "active") {
      return {
        container:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (value === "suspended") {
      return {
        container:
          "bg-red-500/10 border-red-500/20 text-red-400",
        dot: "bg-red-400",
      };
    }

    if (value === "pending") {
      return {
        container:
          "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        dot: "bg-yellow-400",
      };
    }

    return {
      container:
        "bg-blue-500/10 border-blue-500/20 text-blue-400",
      dot: "bg-blue-400",
    };
  };

  /* =========================
     USER INITIAL
  ========================= */

  const getInitial = (user) => {
    const name =
      user.full_name ||
      user.name ||
      "U";

    return String(name)
      .charAt(0)
      .toUpperCase();
  };

  return (
    <AdminLayout>

      <div className="p-4 sm:p-6 lg:p-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <Users
                size={18}
                className="text-blue-400"
              />

              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                User Management
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Manage Users
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage traders, accounts and user
              access.
            </p>

          </div>

          <button
            onClick={() =>
              fetchUsers(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition disabled:opacity-50"
          >

            <RefreshCw
              size={16}
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


        {/* ================= STATS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">

          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            iconStyle="text-blue-400 bg-blue-500/10 border-blue-500/20"
          />

          <StatCard
            title="Active"
            value={activeUsers}
            icon={UserCheck}
            iconStyle="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          />

          <StatCard
            title="Suspended"
            value={suspendedUsers}
            icon={UserX}
            iconStyle="text-red-400 bg-red-500/10 border-red-500/20"
          />

          <StatCard
            title="Pending"
            value={pendingUsers}
            icon={Clock}
            iconStyle="text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
          />

        </div>


        {/* ================= SEARCH ================= */}

        <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl p-4 mb-5">

          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  );
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#070A11] border border-white/10 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition"
              />

            </div>

            <select
              value={filter}
              onChange={(e) => {
                setFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="h-11 px-4 rounded-xl bg-[#070A11] border border-white/10 text-sm text-gray-300 outline-none focus:border-blue-500/50"
            >

              <option value="All">
                All Users
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Suspended">
                Suspended
              </option>

              <option value="Pending">
                Pending
              </option>

            </select>

          </div>

        </div>


        {/* ================= TABLE ================= */}

        <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* Table heading */}

          <div className="px-5 sm:px-6 py-5 border-b border-white/[0.07]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-white">
                  Platform Users
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {filteredUsers.length} users found
                </p>

              </div>

              <ShieldCheck
                size={20}
                className="text-blue-400"
              />

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-sm">

              <thead>

                <tr className="border-b border-white/[0.07] text-gray-500">

                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider">
                    ID
                  </th>

                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider">
                    Referrals
                  </th>

                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <RefreshCw
                          size={25}
                          className="text-blue-400 animate-spin mb-3"
                        />

                        <p className="text-gray-400 text-sm">
                          Loading users...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : currentUsers.length > 0 ? (

                  currentUsers.map(
                    (user) => {

                      const statusStyle =
                        getStatusStyle(
                          user.status
                        );

                      return (
                        <tr
                          key={user.id}
                          className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.025] transition"
                        >

                          {/* User */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-sky-400/10 border border-blue-500/10 flex items-center justify-center text-blue-300 font-semibold">

                                {getInitial(
                                  user
                                )}

                              </div>

                              <div>

                                <p className="font-medium text-white">

                                  {user.full_name ||
                                    user.name ||
                                    "N/A"}

                                </p>

                                <p className="text-[11px] text-gray-600">
                                  Trader
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* ID */}

                          <td className="px-6 py-4">

                            <span className="text-gray-400 font-mono text-xs">

                              FN/NG/
                              {user.id}

                            </span>

                          </td>


                          {/* Email */}

                          <td className="px-6 py-4 text-gray-400">

                            {user.email ||
                              "N/A"}

                          </td>


                          {/* Referrals */}

                          <td className="px-6 py-4">

                            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs">

                              {user.ref || 0}

                            </span>

                          </td>


                          {/* Status */}

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusStyle.container}`}
                            >

                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                              />

                              {user.status ||
                                "Unknown"}

                            </span>

                          </td>


                          {/* Actions */}

                          <td className="px-6 py-4">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                onClick={() =>
                                  setSelectedUser(
                                    user
                                  )
                                }
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-medium"
                              >

                                <Eye
                                  size={15}
                                />

                                View

                              </button>


                              <button
                                onClick={() =>
                                  handleSuspend(
                                    user.id
                                  )
                                }
                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                              >

                                <UserX
                                  size={15}
                                />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">

                          <Users
                            size={20}
                            className="text-gray-600"
                          />

                        </div>

                        <p className="text-gray-400 text-sm">
                          No users found
                        </p>

                        <p className="text-gray-600 text-xs mt-1">
                          Try changing your search
                          or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (

            <div className="px-5 sm:px-6 py-4 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">

              <p className="text-xs text-gray-500">

                Showing{" "}

                <span className="text-gray-300">
                  {indexOfFirst + 1}
                </span>

                {" - "}

                <span className="text-gray-300">
                  {Math.min(
                    indexOfLast,
                    filteredUsers.length
                  )}
                </span>

                {" of "}

                <span className="text-gray-300">
                  {filteredUsers.length}
                </span>

              </p>


              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >

                  <ChevronLeft
                    size={17}
                  />

                </button>


                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      5
                    ),
                  },
                  (_, index) => {

                    let page;

                    if (
                      totalPages <= 5
                    ) {
                      page =
                        index + 1;
                    } else if (
                      currentPage <= 3
                    ) {
                      page =
                        index + 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      page =
                        totalPages -
                        4 +
                        index;
                    } else {
                      page =
                        currentPage -
                        2 +
                        index;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition ${
                          currentPage ===
                          page
                            ? "bg-gradient-to-r from-blue-600 to-sky-400 text-white"
                            : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
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
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>

            </div>
          )}

        </div>

      </div>


      {/* ================= MESSAGE MODAL ================= */}

      {(message || error) && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-sm bg-[#0B0F19] border border-white/10 rounded-2xl p-6 shadow-2xl">

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                error
                  ? "bg-red-500/10"
                  : "bg-emerald-500/10"
              }`}
            >

              {error ? (
                <UserX
                  size={22}
                  className="text-red-400"
                />
              ) : (
                <UserCheck
                  size={22}
                  className="text-emerald-400"
                />
              )}

            </div>

            <h3
              className={`text-lg font-semibold text-center ${
                error
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {error
                ? "Error"
                : "Success"}
            </h3>

            <p className="text-sm text-gray-400 text-center mt-2 mb-5">
              {error || message}
            </p>

            <button
              onClick={() => {
                setMessage("");
                setError("");
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 font-medium text-sm"
            >
              Continue
            </button>

          </div>

        </div>
      )}


      {/* ================= USER MODAL ================= */}

      {selectedUser && (

        <UserToggleModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onStatusChange={
            handleStatusChange
          }
        />

      )}

    </AdminLayout>
  );
};


/* ================= STAT CARD ================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconStyle,
}) => {

  return (
    <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/15 transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-gray-500">
            {title}
          </p>

          <h3 className="text-xl sm:text-2xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconStyle}`}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
};

export default AdminUsers;