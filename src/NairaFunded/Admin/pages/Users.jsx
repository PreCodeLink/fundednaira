import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";
import { Search } from "lucide-react";

const AdminUsers = () => {
  const API_BASE = "https://fundednaira.ng/api/admin";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const usersPerPage = 10;

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token not found");
      setLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({
        search,
        status: filter,
      }).toString();

      const res = await fetch(`${API_BASE}/get-users.php?${query}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to fetch users");
        setLoading(false);
        return;
      }

      setUsers(data.users || []);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filter]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const filteredUsers = useMemo(() => users, [users]);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleStatusChange = async (userId, status) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/update-user-status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          user_id: userId,
          status,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to update status");
        return;
      }

      setMessage(data.message);
      fetchUsers();
      setSelectedUser(null);
    } catch {
      setError("Server error. Please try again.");
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/delete-user.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.success) {
        setError(data.message || "Failed to delete user");
        return;
      }

      setMessage(data.message);
      fetchUsers();
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 text-white">
        {(message || error) && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
            <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">
              <div
                className={`text-lg font-semibold mb-3 ${
                  error ? "text-red-400" : "text-green-400"
                }`}
              >
                {error ? "Error" : "Success"}
              </div>

              <p className="text-gray-300 text-sm mb-5">{error || message}</p>

              <button
                onClick={() => {
                  setMessage("");
                  setError("");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-400 py-2 rounded-lg text-white font-medium hover:opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Manage Users</h2>

          <div className="flex gap-3">
            <div className="flex items-center bg-gray-900 px-3 rounded-lg border border-gray-800">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-transparent outline-none px-2 py-2 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Referrals</th>
                <th>Status</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 font-medium">FN/NG/{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.ref}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : user.status === "Suspended"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="text-right px-4 space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-800 rounded-lg"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1 ? "bg-blue-600" : "bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              className="px-4 py-2 bg-gray-800 rounded-lg"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4">User Details</h3>

              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-gray-400">ID:</span> FN/NG/{selectedUser.id}
                </p>
                <p>
                  <span className="text-gray-400">Name:</span> {selectedUser.name}
                </p>
                <p>
                  <span className="text-gray-400">Email:</span> {selectedUser.email}
                </p>
                <p>
                  <span className="text-gray-400">Referrals:</span> {selectedUser.ref}
                </p>
                <p>
                  <span className="text-gray-400">Status:</span> {selectedUser.status}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleStatusChange(selectedUser.id, "active")}
                  className="bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                >
                  Activate
                </button>

                <button
                  onClick={() => handleStatusChange(selectedUser.id, "suspended")}
                  className="bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg"
                >
                  Suspend
                </button>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-4 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;