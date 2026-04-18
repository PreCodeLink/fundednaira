import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(true);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("email"); // email or notification
  const [sending, setSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("https://api.fundednaira.ng/api/admin/get-users.php");
      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        setResponseMsg(data.message || "Failed to fetch users.");
      }
    } catch (error) {
      setResponseMsg("Error loading users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredUsers.map((user) => user.id);
    const allVisibleSelected = visibleIds.every((id) => selectedUsers.includes(id));

    if (allVisibleSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMsg("");

    if (!subject.trim()) {
      setResponseMsg("Subject is required.");
      return;
    }

    if (!message.trim()) {
      setResponseMsg("Message is required.");
      return;
    }

    if (!sendToAll && selectedUsers.length === 0) {
      setResponseMsg("Please select at least one user.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        type,
        send_to: sendToAll ? "all" : "selected",
        user_ids: sendToAll ? [] : selectedUsers,
        subject,
        message,
      };

      const res = await fetch("https://api.fundednaira.ng/api/admin/send-bulk-message.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setResponseMsg(data.message || "Message sent successfully.");
        setSubject("");
        setMessage("");
        setSelectedUsers([]);
      } else {
        setResponseMsg(data.message || "Failed to send message.");
      }
    } catch (error) {
      setResponseMsg("Server error while sending.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Send Email / Notification</h1>
            <p className="text-gray-400 mt-1">
              Send email or notification to all users or selected users.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                    >
                      <option value="email">Email</option>
                      <option value="notification">Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Recipients</label>
                    <select
                      value={sendToAll ? "all" : "selected"}
                      onChange={(e) => setSendToAll(e.target.value === "all")}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                    >
                      <option value="all">All Users</option>
                      <option value="selected">Selected Users</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-300">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-300">Message</label>
                  <textarea
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                {responseMsg && (
                  <div className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300">
                    {responseMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="bg-sky-500 hover:bg-sky-600 transition px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Now"}
                </button>
              </form>
            </div>

            {/* User list */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Users</h2>
                {!sendToAll && (
                  <button
                    type="button"
                    onClick={toggleSelectAllVisible}
                    className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg"
                  >
                    Select Visible
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500 mb-4"
              />

              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                {loadingUsers ? (
                  <p className="text-gray-400 text-sm">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No users found.</p>
                ) : (
                  filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedUsers.includes(user.id)
                          ? "border-sky-500 bg-sky-500/10"
                          : "border-gray-800 bg-gray-950"
                      } ${sendToAll ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                        disabled={sendToAll}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
