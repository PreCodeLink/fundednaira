import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Pencil,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  Clock3,
  Filter,
} from "lucide-react";
import StaffLayout from "../Components/Layout";

const API_BASE = "https://api.fundednaira.net/api";

const ACCOUNT_SIZES = [
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "200000", label: "200K" },
  { value: "300000", label: "300K" },
  { value: "400000", label: "400K" },
  { value: "600000", label: "600K" },
  { value: "800000", label: "800K" },
];

const StaffUploadAccount = () => {
   const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [filter, setFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    server: "",
    size: "",
  });

  const [editData, setEditData] = useState({
    id: "",
    login: "",
    password: "",
    server: "",
    size: "",
    status: "",
  });

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const accountsPerPage = 10;

  // -----------------------------
  // Notifications
  // -----------------------------

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

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatMoney = (value) => {
    if (!value) return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return value;

    return `₦${number.toLocaleString()}`;
  };

  const getSizeLabel = (value) => {
    const found = ACCOUNT_SIZES.find(
      (item) => item.value === String(value)
    );

    return found ? found.label : formatMoney(value);
  };

  const getStatusClass = (status) => {
    const lower = String(status || "").toLowerCase();

    if (lower === "available") {
      return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (lower === "given") {
      return "border border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border border-gray-700 bg-gray-800 text-gray-400";
  };

  // -----------------------------
  // Fetch Accounts
  // -----------------------------

 const fetchAccounts = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("staff_token");

    if (!token) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const res = await fetch(
      `${API_BASE}/Staff/get-trading-accounts.php`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Token invalid/expired/not authorized
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid server response");
    }

    if (Array.isArray(data)) {
      setAccounts(data);
    } else if (data.success) {
      setAccounts(data.accounts || []);
    } else {
      setAccounts([]);

      showMessage(
        "error",
        data.message || "Failed to load trading accounts."
      );
    }
  } catch (error) {
    console.error(error);

    showMessage(
      "error",
      "Unable to connect to the server."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAccounts();
  }, []);

  // -----------------------------
  // Input handlers
  // -----------------------------

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // -----------------------------
  // Add Account
  // -----------------------------

  const handleAddAccount = async (e) => {
  e.preventDefault();

  if (
    !formData.login ||
    !formData.password ||
    !formData.server ||
    !formData.size
  ) {
    showMessage("error", "Please complete all fields.");
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem("staff_token");

    if (!token) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const res = await fetch(
      `${API_BASE}/Staff/add-trading-account.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid server response");
    }

    if (data.success) {
      showMessage(
        "success",
        data.message || "Trading account added successfully."
      );

      setFormData({
        login: "",
        password: "",
        server: "",
        size: "",
      });

      setShowPassword(false);
      setOpenModal(false);

      fetchAccounts();
    } else {
      showMessage(
        "error",
        data.message || "Failed to add account."
      );
    }
  } catch (error) {
    console.error(error);

    showMessage(
      "error",
      "Unable to connect to the server."
    );
  } finally {
    setSubmitting(false);
  }
};

  // -----------------------------
  // Edit Account
  // -----------------------------

 const handleEditAccount = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  try {
    const token = localStorage.getItem("staff_token");

    if (!token) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const res = await fetch(
      `${API_BASE}/Staff/edit-trading-account.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");
      navigate("/auth/staff", { replace: true });
      return;
    }

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid server response");
    }

    if (data.success) {
      showMessage(
        "success",
        data.message || "Account updated successfully."
      );

      setEditModal(false);
      setShowEditPassword(false);

      fetchAccounts();
    } else {
      showMessage(
        "error",
        data.message || "Failed to update account."
      );
    }
  } catch (error) {
    console.error(error);

    showMessage(
      "error",
      "Unable to connect to the server."
    );
  } finally {
    setSubmitting(false);
  }
};

  // -----------------------------
  // Filtering
  // -----------------------------

  const filteredAccounts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return accounts.filter((acc) => {
      const statusMatch =
        filter === "All"
          ? true
          : String(acc.status || "")
              .toLowerCase()
              .includes(filter.toLowerCase());

      const sizeMatch =
        sizeFilter === "All"
          ? true
          : String(acc.size || "").includes(sizeFilter);

      const searchMatch =
        !searchValue ||
        String(acc.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(acc.login || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(acc.server || "")
          .toLowerCase()
          .includes(searchValue);

      return statusMatch && sizeMatch && searchMatch;
    });
  }, [accounts, filter, sizeFilter, search]);

  // -----------------------------
  // Pagination
  // -----------------------------

  const totalPages = Math.ceil(
    filteredAccounts.length / accountsPerPage
  );

  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;

  const currentAccounts = filteredAccounts.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sizeFilter, search]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // -----------------------------
  // Statistics
  // -----------------------------

  const totalAccounts = accounts.length;

  const availableAccounts = accounts.filter(
    (acc) =>
      String(acc.status || "").toLowerCase() === "available"
  ).length;

  const givenAccounts = accounts.filter(
    (acc) =>
      String(acc.status || "").toLowerCase() === "given"
  ).length;

  // -----------------------------
  // Modal close
  // -----------------------------

  const closeAddModal = () => {
    if (submitting) return;

    setOpenModal(false);
    setShowPassword(false);
  };

  const closeEditModal = () => {
    if (submitting) return;

    setEditModal(false);
    setShowEditPassword(false);
  };

  return (
    <StaffLayout>
      <div className="min-h-screen text-white">
        {/* =========================
            ALERT
        ========================== */}

        {message.show && (
          <div className="fixed right-5 top-5 z-[200] w-[calc(100%-40px)] max-w-md">
            <div
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-xl ${
                message.type === "success"
                  ? "border-emerald-500/20 bg-emerald-950/95 text-emerald-200"
                  : "border-red-500/20 bg-red-950/95 text-red-200"
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
                className="text-gray-400 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <Database size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Trading Accounts
                </h1>

                <p className="text-sm text-gray-400">
                  Manage and monitor funded trading accounts
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold shadow-lg shadow-blue-600/10 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus size={19} />
            Add Trading Account
          </button>
        </div>

        {/* =========================
            STAT CARDS
        ========================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Total Accounts
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {totalAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Database size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Available
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                  {availableAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Given Accounts
                </p>

                <h3 className="mt-2 text-3xl font-bold text-red-400">
                  {givenAccounts}
                </h3>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <Clock3 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            FILTER BAR
        ========================== */}

        <div className="mb-5 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search by login, server or account ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-600"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-800 bg-gray-950 py-3 pl-9 pr-10 text-sm outline-none focus:border-blue-600 sm:w-40"
                >
                  <option value="All">All Status</option>
                  <option value="Available">
                    Available
                  </option>
                  <option value="Given">Given</option>
                </select>
              </div>

              <select
                value={sizeFilter}
                onChange={(e) =>
                  setSizeFilter(e.target.value)
                }
                className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600 sm:w-40"
              >
                <option value="All">All Sizes</option>

                {ACCOUNT_SIZES.map((size) => (
                  <option
                    key={size.value}
                    value={size.value}
                  >
                    {size.label}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchAccounts}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />

                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            TABLE
        ========================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Account Inventory
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Showing {currentAccounts.length} of{" "}
                {filteredAccounts.length} accounts
              </p>
            </div>

            {(search ||
              filter !== "All" ||
              sizeFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                  setSizeFilter("All");
                }}
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-sm">
              <thead className="border-b border-gray-800 bg-gray-950/50">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Account</th>
                  <th className="px-4 py-4">Login</th>
                  <th className="px-4 py-4">Password</th>
                  <th className="px-4 py-4">Server</th>
                  <th className="px-4 py-4">Size</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-20 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw
                          size={28}
                          className="animate-spin text-blue-500"
                        />

                        <p className="mt-4 font-medium text-gray-300">
                          Loading accounts
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Please wait...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentAccounts.length > 0 ? (
                  currentAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className="border-b border-gray-800/80 transition hover:bg-gray-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
                            #
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              ACC/{acc.id}
                            </p>

                            <p className="text-xs text-gray-500">
                              Trading Account
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-200">
                        {acc.login}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-gray-300">
                          {acc.password}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-300">
                        {acc.server}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-200">
                          {getSizeLabel(acc.size)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                            acc.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />

                          {acc.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditData({
                              id: acc.id,
                              login: acc.login,
                              password: acc.password,
                              server: acc.server,
                              size: acc.size,
                              status: acc.status,
                            });

                            setShowEditPassword(false);
                            setEditModal(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-200 transition hover:border-yellow-600/50 hover:bg-yellow-600/10 hover:text-yellow-400"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-20 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                          <Database size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-300">
                          No accounts found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your filters or add a
                          new trading account.
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
        ========================== */}

        {totalPages > 1 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <div className="hidden items-center gap-1 sm:flex">
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
                  .map((page, index, pages) => {
                    const previousPage =
                      pages[index - 1];

                    const showDots =
                      previousPage &&
                      page - previousPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showDots && (
                          <span className="px-1 text-gray-600">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() =>
                            setCurrentPage(page)
                          }
                          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
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
              </div>

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================
            ADD MODAL
        ========================== */}

        {openModal && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeAddModal();
              }
            }}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold">
                    Add Trading Account
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Add a new account to your inventory.
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

                  <div className="relative">
                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter account password"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-600"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
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
                    value={formData.server}
                    onChange={handleChange}
                    placeholder="e.g. FundedNaira-Live"
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

                    {ACCOUNT_SIZES.map((size) => (
                      <option
                        key={size.value}
                        value={size.value}
                      >
                        {size.label} —{" "}
                        {formatMoney(size.value)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 border-t border-gray-800 pt-5">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={submitting}
                    className="flex-1 rounded-xl border border-gray-800 bg-gray-800 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting && (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {submitting
                      ? "Adding..."
                      : "Add Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================
            EDIT MODAL
        ========================== */}

        {editModal && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeEditModal();
              }
            }}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold">
                    Edit Trading Account
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Update ACC/{editData.id}
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
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showEditPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Account Size
                    </label>

                    <select
                      name="size"
                      value={editData.size}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none focus:border-blue-600"
                      required
                    >
                      {ACCOUNT_SIZES.map((size) => (
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

                <div className="flex gap-3 border-t border-gray-800 pt-5">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={submitting}
                    className="flex-1 rounded-xl border border-gray-800 bg-gray-800 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-600 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:opacity-60"
                  >
                    {submitting && (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {submitting
                      ? "Updating..."
                      : "Update Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StaffUploadAccount;