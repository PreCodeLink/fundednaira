import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import AccountModal from "../components/AccountModal";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const Accounts = () => {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const accountsPerPage = 10;

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
    if (value === null || value === undefined || value === "") return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return `₦${value}`;
    return `₦${number.toLocaleString()}`;
  };

  const getValue = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return "";
  };

  const normalizeAccount = (acc) => ({
    ...acc,
    user: getValue(acc.user, acc.full_name, acc.name),
    email: getValue(acc.email, acc.user_email),
    login: getValue(acc.login, acc.account_login),
    password: getValue(acc.password, acc.account_password),
    server: getValue(acc.server, acc.account_server),
    phase: getValue(acc.phase, acc.current_phase),
    type: getValue(acc.type, acc.plan_type),
    size: getValue(acc.size, acc.plan_size),
    failure_reason: getValue(acc.failure_reason),
  });

  const fetchAccounts = async () => {
    try {
      const res = await fetch("https://api.fundednaira.ng/api/admin/get-accounts.php");
      const data = await res.json();

      if (Array.isArray(data)) {
        setAccounts(data.map(normalizeAccount));
      } else {
        setAccounts([]);
        showMessage("error", "Invalid accounts response");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Failed to fetch accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSave = async () => {
    if (!selectedAccount) return;

    if (
      !selectedAccount.login?.trim() ||
      !selectedAccount.password?.trim() ||
      !selectedAccount.server?.trim()
    ) {
      showMessage("error", "Login, password and server are required");
      return;
    }

    try {
      const res = await fetch("https://api.fundednaira.ng/api/admin/update-account.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedAccount.id,
          login: selectedAccount.login,
          account_login: selectedAccount.login,
          password: selectedAccount.password,
          account_password: selectedAccount.password,
          server: selectedAccount.server,
          account_server: selectedAccount.server,
          status: "active",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);
        await fetchAccounts();
        showMessage(
          "success",
          data.message || "Account activated and details sent to user"
        );
      } else {
        showMessage("error", data.message || "Failed to update account");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const changeStatus = async (status, reason = "") => {
    if (!selectedAccount) return;

    try {
      const payload = {
        id: selectedAccount.id,
        status,
      };

      if (status === "failed") {
        payload.reason = reason;
      }

      const res = await fetch("https://api.fundednaira.ng/api/admin/update-account-status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);
        await fetchAccounts();
        showMessage("success", data.message || `Account marked as ${status}`);
      } else {
        showMessage("error", data.message || "Failed to change status");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    if (filter === "All") return true;
    return String(acc.status || "").toLowerCase() === filter.toLowerCase();
  });

  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  const getStatusClass = (status) => {
    const lower = String(status || "").toLowerCase();

    if (lower === "active") {
      return "bg-green-600/20 text-green-400 border border-green-600/30";
    }

    if (lower === "pending") {
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    }

    if (lower === "failed") {
      return "bg-red-600/20 text-red-400 border border-red-600/30";
    }

    return "bg-gray-700/20 text-gray-300 border border-gray-700/30";
  };

  return (
    <AdminLayout>
      <div className="relative p-6 text-white">
        {message.show && (
          <div className="fixed right-5 top-5 z-[100]">
            <div
              className={`flex min-w-[300px] max-w-[420px] items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl ${
                message.type === "success"
                  ? "border-green-700 bg-green-950/90 text-green-200"
                  : "border-red-700 bg-red-950/90 text-red-200"
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
                <h4 className="mb-1 font-semibold">
                  {message.type === "success" ? "Success" : "Error"}
                </h4>
                <p className="text-sm">{message.text}</p>
              </div>

              <button
                onClick={closeMessage}
                className="text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Accounts</h2>

          <select
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 outline-none"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-sm">
              <thead className="border-b border-gray-800 bg-gray-950/40 text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="text-left">User</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Size</th>
                  <th className="text-left">Phase</th>
                  <th className="text-left">Status</th>
                  <th className="text-right px-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b border-gray-800 transition hover:bg-gray-800/70"
                  >
                    <td className="px-4 py-3">AC/{acc.id}</td>
                    <td>{acc.user || "N/A"}</td>
                    <td>{acc.type || "N/A"}</td>
                    <td>{formatMoney(acc.size)}</td>
                    <td className="capitalize">{acc.phase || "N/A"}</td>
                    <td className="capitalize">{acc.type === "Instant" ? "Instant" : acc.phase || "N/A"}</td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          acc.status
                        )}`}
                      >
                        {acc.status || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 text-right">
                      <button
                        onClick={() => setSelectedAccount(normalizeAccount(acc))}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 transition hover:bg-blue-700"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentAccounts.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              No accounts found
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="rounded-lg bg-gray-800 px-4 py-2 transition hover:bg-gray-700"
          >
            Prev
          </button>

          <div className="flex gap-2">
           {totalPages > 0 && (
  <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
    
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
      disabled={currentPage === 1}
    >
      Prev
    </button>

    <div className="flex items-center gap-2 flex-wrap justify-center">
      {Array.from(
        { length: Math.min(totalPages, 5) },
        (_, i) => {
          let pageNumber;

          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          );
        }
      )}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <span className="text-gray-500 px-1">...</span>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className="w-10 h-10 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}
          </div>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages || 1))
            }
            className="rounded-lg bg-gray-800 px-4 py-2 transition hover:bg-gray-700"
          >
            Next
          </button>
        </div>

        <AccountModal
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          handleSave={handleSave}
          changeStatus={changeStatus}
        />
      </div>
    </AdminLayout>
  );
};

export default Accounts;
