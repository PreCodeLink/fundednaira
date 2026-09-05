import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Pencil,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  WalletCards,
  Users,
  Check,
} from "lucide-react";

const API = "https://api.fundednaira.net/api/admin";

const SIZES = [
  { value: "50000", label: "₦50,000" },
  { value: "100000", label: "₦100,000" },
  { value: "200000", label: "₦200,000" },
  { value: "300000", label: "₦300,000" },
  { value: "400000", label: "₦400,000" },
  { value: "600000", label: "₦600,000" },
  { value: "800000", label: "₦800,000" },
];

const EMPTY_FORM = {
  login: "",
  password: "",
  server: "",
  size: "",
};

const EMPTY_EDIT = {
  id: "",
  login: "",
  password: "",
  server: "",
  size: "",
  status: "",
};

const UploadAccount = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [showPassword, setShowPassword] = useState({});
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editData, setEditData] = useState(EMPTY_EDIT);

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const accountsPerPage = 10;

  /* =========================
     ALERT
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
     HELPERS
  ========================= */

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "₦0";
    }

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return `₦${number.toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "available") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (value === "given") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-gray-700 bg-gray-800 text-gray-400";
  };
  // =========================
// AUTH HELPERS
// =========================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/auth/admin", {
    replace: true,
  });
};

  /* =========================
     FETCH ACCOUNTS
  ========================= */

 const fetchAccounts = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    const res = await fetch(
      `${API}/get-trading-accounts.php`,
      {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(),
      }
    );

    if (res.status === 401 || res.status === 403) {
      handleUnauthorized();
      return;
    }

    const text = await res.text();

    console.log("Trading accounts response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Invalid JSON response from server"
      );
    }

    if (Array.isArray(data)) {
      setAccounts(data);
    } else if (data.success) {
      setAccounts(
        Array.isArray(data.accounts)
          ? data.accounts
          : []
      );
    } else {
      setAccounts([]);

      showMessage(
        "error",
        data.message ||
          "Failed to load trading accounts"
      );
    }
  } catch (error) {
    console.error("Fetch accounts error:", error);

    setAccounts([]);

    showMessage(
      "error",
      error.message ||
        "Unable to connect to server"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAccounts();
  }, []);

  /* =========================
     FILTERING
  ========================= */

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        String(acc.login || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(acc.server || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(acc.id || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        filter === "All" ||
        String(acc.status || "").toLowerCase() ===
          filter.toLowerCase();

      const matchesSize =
        sizeFilter === "All" ||
        String(acc.size || "") === sizeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSize
      );
    });
  }, [accounts, search, filter, sizeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sizeFilter]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredAccounts.length / accountsPerPage
  );

  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;

  const currentAccounts = filteredAccounts.slice(
    indexOfFirst,
    indexOfLast
  );

  /* =========================
     STATISTICS
  ========================= */

  const totalAccounts = accounts.length;

  const availableAccounts = accounts.filter(
    (acc) =>
      String(acc.status || "").toLowerCase() ===
      "available"
  ).length;

  const givenAccounts = accounts.filter(
    (acc) =>
      String(acc.status || "").toLowerCase() ===
      "given"
  ).length;

  /* =========================
     INPUT HANDLERS
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     ADD ACCOUNT
  ========================= */

  const handleAddAccount = async (e) => {
    e.preventDefault();

    if (
      !formData.login.trim() ||
      !formData.password.trim() ||
      !formData.server.trim() ||
      !formData.size
    ) {
      showMessage(
        "error",
        "Please complete all account fields"
      );
      return;
    }

    try {
      const res = await fetch(
  `${API}/add-trading-account.php`,
  {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }
);

if (res.status === 401 || res.status === 403) {
  handleUnauthorized();
  return;
}

      const text = await res.text();

      console.log("Add account response:", text);

      const data = JSON.parse(text);

      if (!data.success) {
        showMessage(
          "error",
          data.message || "Failed to add account"
        );
        return;
      }

      showMessage(
        "success",
        data.message || "Trading account added successfully"
      );

      setFormData(EMPTY_FORM);
      setOpenModal(false);

      await fetchAccounts();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        "Server error. Please try again."
      );
    }
  };

  /* =========================
     EDIT ACCOUNT
  ========================= */

  const handleEditAccount = async (e) => {
    e.preventDefault();

    if (
      !editData.login.trim() ||
      !editData.password.trim() ||
      !editData.server.trim() ||
      !editData.size ||
      !editData.status
    ) {
      showMessage(
        "error",
        "Please complete all account fields"
      );
      return;
    }

   try {
  const token = localStorage.getItem("token");

  if (!token) {
    handleUnauthorized();
    return;
  }

  const res = await fetch(
    `${API}/edit-trading-account.php`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    }
  );

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    return;
  }

  const text = await res.text();

  console.log("Edit account response:", text);

  const data = JSON.parse(text);

  if (!data.success) {
    showMessage(
      "error",
      data.message ||
        "Failed to update account"
    );
    return;
  }

  showMessage(
    "success",
    data.message ||
      "Trading account updated successfully"
  );

  setEditModal(false);
  setEditData(EMPTY_EDIT);

  await fetchAccounts();
} catch (error) {
  console.error(error);

  showMessage(
    "error",
    "Server error. Please try again."
  );
}
  };

  /* =========================
     OPEN EDIT
  ========================= */

  const openEdit = (account) => {
    setEditData({
      id: account.id || "",
      login: account.login || "",
      password: account.password || "",
      server: account.server || "",
      size: account.size || "",
      status: account.status || "available",
    });

    setShowEditPassword(false);
    setEditModal(true);
  };

  /* =========================
     PASSWORD
  ========================= */

  const togglePassword = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =========================
     MODAL
  ========================= */

  const closeAddModal = () => {
    setOpenModal(false);
    setFormData(EMPTY_FORM);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditData(EMPTY_EDIT);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-4 text-white md:p-6">

        {/* =========================
            ALERT
        ========================= */}

        {message.show && (
          <div className="fixed right-4 top-4 z-[200] w-[calc(100%-2rem)] max-w-md">
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
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

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold">
                  {message.type === "success"
                    ? "Success"
                    : "Error"}
                </h4>

                <p className="mt-1 text-sm opacity-90">
                  {message.text}
                </p>
              </div>

              <button
                onClick={closeMessage}
                className="text-gray-400 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600/10 p-3 text-blue-400">
                <WalletCards size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Trading Accounts
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Manage your available trading accounts
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchAccounts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/10 transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Account
            </button>

          </div>
        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Total Accounts
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {totalAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Available
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  {availableAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <Check size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Assigned
                </p>

                <h3 className="mt-2 text-2xl font-bold text-red-400">
                  {givenAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <Server size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* =========================
            FILTER BAR
        ========================= */}

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search by login, server or ID..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-blue-600"
              />
            </div>

            {/* Status */}

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="All">
                All Status
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Given">
                Given
              </option>
            </select>

            {/* Size */}

            <select
              value={sizeFilter}
              onChange={(e) =>
                setSizeFilter(e.target.value)
              }
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="All">
                All Sizes
              </option>

              {SIZES.map((size) => (
                <option
                  key={size.value}
                  value={size.value}
                >
                  {size.label}
                </option>
              ))}
            </select>

          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {currentAccounts.length} of{" "}
              {filteredAccounts.length} accounts
            </span>

            {(search ||
              filter !== "All" ||
              sizeFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                  setSizeFilter("All");
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

          <div className="overflow-x-auto">

            <table className="min-w-[1000px] w-full text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/70">

                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">

                  <th className="px-5 py-4">
                    Account
                  </th>

                  <th className="px-5 py-4">
                    Login
                  </th>

                  <th className="px-5 py-4">
                    Password
                  </th>

                  <th className="px-5 py-4">
                    Server
                  </th>

                  <th className="px-5 py-4">
                    Size
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  Array.from({ length: 5 }).map(
                    (_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800"
                      >
                        {Array.from({
                          length: 7,
                        }).map((_, i) => (
                          <td
                            key={i}
                            className="px-5 py-5"
                          >
                            <div className="h-4 animate-pulse rounded bg-gray-800" />
                          </td>
                        ))}
                      </tr>
                    )
                  )

                ) : currentAccounts.length > 0 ? (

                  currentAccounts.map((acc) => (

                    <tr
                      key={acc.id}
                      className="border-b border-gray-800 transition hover:bg-gray-800/40"
                    >

                      <td className="px-5 py-4">

                        <div>
                          <p className="font-semibold text-white">
                            ACC/{acc.id}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Trading Account
                          </p>
                        </div>

                      </td>

                      <td className="px-5 py-4 font-medium text-gray-200">
                        {acc.login || "—"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <span className="font-mono text-gray-300">
                            {showPassword[acc.id]
                              ? acc.password || "—"
                              : "••••••••"}
                          </span>

                          <button
                            onClick={() =>
                              togglePassword(acc.id)
                            }
                            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-white"
                          >
                            {showPassword[acc.id] ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {acc.server || "—"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-200">
                        {formatMoney(acc.size)}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            acc.status
                          )}`}
                        >
                          {acc.status || "Unknown"}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            openEdit(acc)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-200 transition hover:border-yellow-600/40 hover:bg-yellow-600/10 hover:text-yellow-400"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">

                        <div className="mb-4 rounded-2xl bg-gray-800 p-4 text-gray-500">
                          <WalletCards size={28} />
                        </div>

                        <h3 className="font-semibold text-gray-300">
                          No accounts found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          No trading accounts match your
                          current filters.
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

        {!loading && totalPages > 1 && (

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center justify-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(p - 1, 1)
                  )
                }
                className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              )
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, arr) => {

                  const previous = arr[index - 1];

                  return (
                    <React.Fragment key={page}>

                      {previous &&
                        page - previous > 1 && (
                          <span className="px-1 text-gray-600">
                            ...
                          </span>
                        )}

                      <button
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        {page}
                      </button>

                    </React.Fragment>
                  );
                })}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}

        {/* =========================
            ADD MODAL
        ========================= */}

        {openModal && (

          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">

                <div>
                  <h2 className="text-lg font-bold">
                    Add Trading Account
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a new account to your inventory
                  </p>
                </div>

                <button
                  onClick={closeAddModal}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={19} />
                </button>

              </div>

              <form
                onSubmit={handleAddAccount}
                className="space-y-5 p-6"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Login
                  </label>

                  <input
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    placeholder="Enter account login"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Password
                  </label>

                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter account password"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Server
                  </label>

                  <input
                    type="text"
                    name="server"
                    value={formData.server}
                    onChange={handleChange}
                    placeholder="Example: Broker-Server"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Account Size
                  </label>

                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                    required
                  >
                    <option value="">
                      Select account size
                    </option>

                    {SIZES.map((size) => (
                      <option
                        key={size.value}
                        value={size.value}
                      >
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="flex-1 rounded-xl border border-gray-800 bg-gray-800 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold transition hover:bg-blue-700"
                  >
                    Add Account
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* =========================
            EDIT MODAL
        ========================= */}

        {editModal && (

          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">

                <div>
                  <h2 className="text-lg font-bold">
                    Edit Trading Account
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update account credentials and status
                  </p>
                </div>

                <button
                  onClick={closeEditModal}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={19} />
                </button>

              </div>

              <form
                onSubmit={handleEditAccount}
                className="space-y-5 p-6"
              >

                <div className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                  <p className="text-xs text-gray-500">
                    Account ID
                  </p>

                  <p className="mt-1 font-semibold">
                    ACC/{editData.id}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Login
                  </label>

                  <input
                    type="text"
                    name="login"
                    value={editData.login}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showEditPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={editData.password}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-600"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowEditPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showEditPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Server
                  </label>

                  <input
                    type="text"
                    name="server"
                    value={editData.server}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Size
                    </label>

                    <select
                      name="size"
                      value={editData.size}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
                      required
                    >
                      {SIZES.map((size) => (
                        <option
                          key={size.value}
                          value={size.value}
                        >
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Status
                    </label>

                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
                      required
                    >
                      <option value="available">
                        Available
                      </option>

                      <option value="given">
                        Given
                      </option>
                    </select>
                  </div>

                </div>

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 rounded-xl border border-gray-800 bg-gray-800 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-yellow-600 py-3 text-sm font-semibold transition hover:bg-yellow-700"
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    </AdminLayout>
  );
};

export default UploadAccount;