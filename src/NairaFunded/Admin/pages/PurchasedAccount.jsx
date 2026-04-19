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

  const fetchAccounts = async () => {
    try {
      const res = await fetch("https://api.fundednaira.ng/api/admin/get-accounts.php");
      const data = await res.json();

      if (Array.isArray(data)) {
        setAccounts(data);
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
      !selectedAccount.login ||
      !selectedAccount.password ||
      !selectedAccount.server
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
          ...selectedAccount,
          status: "active",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);
        fetchAccounts();
        showMessage("success", "Account activated successfully");
      } else {
        showMessage("error", data.message || "Failed to update account");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const changeStatus = async (status) => {
    if (!selectedAccount) return;

    try {
      const res = await fetch("https://api.fundednaira.ng/api/admin/update-account-status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedAccount.id,
          status,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);
        fetchAccounts();
        showMessage("success", `Account marked as ${status}`);
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
    return String(acc.status).toLowerCase() === filter.toLowerCase();
  });

  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  const getStatusClass = (status) => {
    const lower = String(status).toLowerCase();

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
                    <td>{acc.user}</td>
                    <td>{acc.type || "N/A"}</td>
                    <td>{formatMoney(acc.size)}</td>
                    <td className="capitalize">{acc.phase}</td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          acc.status
                        )}`}
                      >
                        {acc.status}
                      </span>
                    </td>

                    <td className="px-4 text-right">
                      <button
                        onClick={() => setSelectedAccount(acc)}
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
            {[...Array(totalPages || 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`rounded px-3 py-1 transition ${
                  currentPage === i + 1
                    ? "bg-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
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
