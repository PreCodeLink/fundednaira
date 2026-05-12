import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";

const UploadAccount = () => {
  const [filter, setFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    server: "",
    size: "",
  });

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
    if (!value) return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return value;

    return `₦${number.toLocaleString()}`;
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/admin/get-trading-accounts.php"
      );

      const text = await res.text();

      console.log(text);

      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        setAccounts(data);
      } else if (data.success) {
        setAccounts(data.accounts || []);
      } else {
        setAccounts([]);
        showMessage("error", data.message || "Failed to fetch accounts");
      }
    } catch (error) {
      console.log(error);
      showMessage("error", "Server error");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/admin/add-trading-account.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const text = await res.text();

      console.log(text);

      const data = JSON.parse(text);

      if (data.success) {
        showMessage("success", data.message);

        setFormData({
          login: "",
          password: "",
          server: "",
          size: "",
        });

        setOpenModal(false);

        fetchAccounts();
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showMessage("error", "Server error");
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const statusMatch =
      filter === "All"
        ? true
        : String(acc.status || "")
            .toLowerCase()
            .includes(filter.toLowerCase());

    const sizeMatch =
      sizeFilter === "All"
        ? true
        : String(acc.size || "")
            .toLowerCase()
            .includes(sizeFilter.toLowerCase());

    return statusMatch && sizeMatch;
  });

  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;

  const currentAccounts = filteredAccounts.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredAccounts.length / accountsPerPage
  );

  const getStatusClass = (status) => {
    const lower = String(status || "").toLowerCase();

    if (lower === "available") {
      return "bg-green-600/20 text-green-400 border border-green-600/30";
    }

    if (lower === "given") {
      return "bg-red-600/20 text-red-400 border border-red-600/30";
    }

    return "bg-gray-700/20 text-gray-300 border border-gray-700/30";
  };

  return (
    <AdminLayout>
      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Add Trading Account
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddAccount}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Login
                </label>

                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Enter login"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Password
                </label>

                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Server
                </label>

                <input
                  type="text"
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  placeholder="Enter server"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Account Size
                </label>

                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="50000">50K</option>
                  <option value="100000">100K</option>
                  <option value="200000">200K</option>
                  <option value="300000">300K</option>
                  <option value="400000">400K</option>
                  <option value="600000">600K</option>
                  <option value="800000">800K</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
              >
                Add Account
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="relative p-6 text-white">

        {/* Alert */}
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
                  {message.type === "success"
                    ? "Success"
                    : "Error"}
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

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Trading Accounts
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage uploaded trading accounts
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Account
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <select
            className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 outline-none"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>Available</option>
            <option>Given</option>
          </select>

          <select
            className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 outline-none"
            value={sizeFilter}
            onChange={(e) => {
              setSizeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>50000</option>
            <option>100000</option>
            <option>200000</option>
            <option>300000</option>
            <option>400000</option>
            <option>600000</option>
            <option>800000</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="border-b border-gray-800 bg-gray-950/40 text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="text-left">Login</th>
                  <th className="text-left">Password</th>
                  <th className="text-left">Server</th>
                  <th className="text-left">Size</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {currentAccounts.length > 0 ? (
                  currentAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className="border-b border-gray-800 transition hover:bg-gray-800/70"
                    >
                      <td className="px-4 py-4">
                        ACC/{acc.id}
                      </td>

                      <td>{acc.login}</td>

                      <td>{acc.password}</td>

                      <td>{acc.server}</td>

                      <td>{formatMoney(acc.size)}</td>

                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            acc.status
                          )}`}
                        >
                          {acc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-400"
                    >
                      No accounts found
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

    {/* Prev */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="rounded-lg bg-gray-800 px-4 py-2 disabled:opacity-40"
    >
      Prev
    </button>

    {/* Pages */}
    {Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;

      // show only nearby pages (clean UI)
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-10 w-10 rounded-lg text-sm font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {page}
          </button>
        );
      }

      return null;
    })}

    {/* Next */}
    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
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

export default UploadAccount;