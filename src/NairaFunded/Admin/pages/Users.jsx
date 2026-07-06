import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";
import { Search } from "lucide-react";
import UserToggleModal from "../components/UserModal";

const AdminUsers = () => {
  const API_BASE = "https://api.fundednaira.net/api/admin";
   
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const usersPerPage = 10;

  /*
  |--------------------------------------------------------------------------
  | Fetch Users
  |--------------------------------------------------------------------------
  */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        search,
        status: filter,
      }).toString();

      const res = await fetch(
        `${API_BASE}/get-users.php?${query}`
      );

      const text = await res.text();

      console.log("RAW USERS RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.log(err);

        setError("Invalid JSON response");
        setUsers([]);

        return;
      }

      if (!data.success) {
        setError(data.message || "Failed to fetch users");
        setUsers([]);

        return;
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.log(error);

      setError("Server error. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Effects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchUsers();
  }, [search, filter]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  /*
  |--------------------------------------------------------------------------
  | Filtered Users
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const indexOfLast = currentPage * usersPerPage;

  const indexOfFirst = indexOfLast - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  /*
  |--------------------------------------------------------------------------
  | Update User Status
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    userId,
    status
  ) => {
    try {
      const res = await fetch(
        `${API_BASE}/update-user-status.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
            status,
          }),
        }
      );

      const text = await res.text();

      console.log("UPDATE STATUS RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        setError("Invalid JSON response");
        return;
      }

      if (!data.success) {
        setError(
          data.message || "Failed to update status"
        );

        return;
      }

      setMessage(data.message || "Status updated");

      fetchUsers();

      setSelectedUser(null);
    } catch (error) {
      console.log(error);

      setError("Server error. Please try again.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete User
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(
        `${API_BASE}/delete-user.php`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const text = await res.text();

      console.log("DELETE USER RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        setError("Invalid JSON response");
        return;
      }

      if (!data.success) {
        setError(
          data.message || "Failed to delete user"
        );

        return;
      }

      setMessage(data.message || "User deleted");

      fetchUsers();
    } catch (error) {
      console.log(error);

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
                  error
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {error ? "Error" : "Success"}
              </div>

              <p className="text-gray-300 text-sm mb-5">
                {error || message}
              </p>

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
          <h2 className="text-2xl font-bold">
            Manage Users
          </h2>

          <div className="flex gap-3">
            <div className="flex items-center bg-gray-900 px-3 rounded-lg border border-gray-800">
              <Search
                size={16}
                className="text-gray-400"
              />

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
                <th className="text-left py-3 px-4">
                  ID
                </th>

                <th>User</th>

                <th>Email</th>

                <th>Referrals</th>

                <th>Status</th>

                <th className="text-right px-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 font-medium">
                      FN/NG/{user.id}
                    </td>

                    <td>
                      {user.full_name ||
                        user.name ||
                        "N/A"}
                    </td>

                    <td>{user.email}</td>

                    <td>{user.ref}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : user.status ===
                              "Suspended"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="text-right px-4 space-x-2">
                      <button
                        onClick={() => {
                          console.log(
                            "SELECTED USER:",
                            user
                          );

                          setSelectedUser(user);
                        }}
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
{filteredUsers.length > usersPerPage && (
  <div className="mt-6 flex flex-col gap-4">
    
    {/* Info */}
    <div className="text-sm text-gray-400">
      Showing{" "}
      <span className="text-white font-medium">
        {indexOfFirst + 1}
      </span>{" "}
      -{" "}
      <span className="text-white font-medium">
        {Math.min(indexOfLast, filteredUsers.length)}
      </span>{" "}
      of{" "}
      <span className="text-white font-medium">
        {filteredUsers.length}
      </span>
    </div>

    {/* Pagination Buttons */}
    <div className="flex flex-wrap items-center gap-2">
      
      {/* Prev */}
      <button
        onClick={() =>
          setCurrentPage((p) => Math.max(p - 1, 1))
        }
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Dynamic Pages */}
      {Array.from(
        { length: Math.min(totalPages, 10) },
        (_, i) => {
          let pageNumber;

          if (totalPages <= 10) {
            pageNumber = i + 1;
          } else if (currentPage <= 6) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 5) {
            pageNumber = totalPages - 9 + i;
          } else {
            pageNumber = currentPage - 5 + i;
          }

          return (
            <button
              key={pageNumber}
              onClick={() =>
                setCurrentPage(pageNumber)
              }
              className={`w-11 h-11 rounded-xl text-sm font-semibold transition ${
                currentPage === pageNumber
                  ? "bg-gradient-to-r from-blue-600 to-sky-400 text-white shadow-lg"
                  : "bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {pageNumber}
            </button>
          );
        }
      )}

      {/* Last Page */}
      {totalPages > 10 &&
        currentPage < totalPages - 5 && (
          <>
            <span className="text-gray-500 px-1">
              ...
            </span>

            <button
              onClick={() =>
                setCurrentPage(totalPages)
              }
              className="w-11 h-11 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {totalPages}
            </button>
          </>
        )}

      {/* Next */}
      <button
        onClick={() =>
          setCurrentPage((p) =>
            Math.min(p + 1, totalPages)
          )
        }
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>
)}
        </div>
      </div>

      {selectedUser && (
        <UserToggleModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
