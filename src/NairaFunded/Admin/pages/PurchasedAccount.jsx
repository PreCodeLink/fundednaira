import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout";
import AccountModal from "../components/AccountModal";
import {
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  RefreshCw,
  WalletCards,
  Activity,
  Clock3,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays,
} from "lucide-react";

const Accounts = () => {
  const API_BASE =
    "https://api.fundednaira.net/api/admin";

  const [filter, setFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedAccount, setSelectedAccount] =
    useState(null);

  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
 
  const accountsPerPage = 10;
  const getNigeriaDate = (createdAt) => {
  if (!createdAt) return "";

  const date = new Date(
    String(createdAt).replace(" ", "T") + "Z"
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  /* =========================
     MESSAGE
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
    }, 3000);
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
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₦0";
    }

    const cleanValue = String(value).replace(
      /[^0-9.]/g,
      ""
    );

    const number = Number(cleanValue);

    if (Number.isNaN(number)) {
      return `₦${value}`;
    }

    return `₦${number.toLocaleString()}`;
  };

  const getValue = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return "";
  };

  const normalizeAccount = (acc) => ({
    ...acc,

    user: getValue(
      acc.user,
      acc.full_name,
      acc.name
    ),

    email: getValue(
      acc.email,
      acc.user_email
    ),

    login: getValue(
      acc.login,
      acc.account_login
    ),

    password: getValue(
      acc.password,
      acc.account_password
    ),

    server: getValue(
      acc.server,
      acc.account_server
    ),

    phase: getValue(
      acc.phase,
      acc.current_phase
    ),

    type: getValue(
      acc.type,
      acc.plan_type
    ),

    size: getValue(
      acc.size,
      acc.plan_size
    ),

    failure_reason: getValue(
      acc.failure_reason
    ),
  });

  /* =========================
     FETCH ACCOUNTS
  ========================= */

  const fetchAccounts = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(
        `${API_BASE}/get-accounts.php`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setAccounts(
          data.map(normalizeAccount)
        );
      } else {
        setAccounts([]);
        showMessage(
          "error",
          "Invalid accounts response"
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        "Failed to fetch accounts"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  /* =========================
     SAVE ACCOUNT
  ========================= */

  const handleSave = async () => {
    if (!selectedAccount) return;

    if (
      !selectedAccount.login?.trim() ||
      !selectedAccount.password?.trim() ||
      !selectedAccount.server?.trim()
    ) {
      showMessage(
        "error",
        "Login, password and server are required"
      );

      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/update-account.php`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: selectedAccount.id,

            login:
              selectedAccount.login,

            account_login:
              selectedAccount.login,

            password:
              selectedAccount.password,

            account_password:
              selectedAccount.password,

            server:
              selectedAccount.server,

            account_server:
              selectedAccount.server,

            status: "active",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);

        await fetchAccounts();

        showMessage(
          "success",
          data.message ||
            "Account activated and details sent to user"
        );
      } else {
        showMessage(
          "error",
          data.message ||
            "Failed to update account"
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        "Server error"
      );
    }
  };

  /* =========================
     CHANGE STATUS
  ========================= */

  const changeStatus = async (
    status,
    reason = ""
  ) => {
    if (!selectedAccount) return;

    try {
      const payload = {
        id: selectedAccount.id,
        status,
      };

      if (status === "failed") {
        payload.reason = reason;
      }

      const res = await fetch(
        `${API_BASE}/update-account-status.php`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSelectedAccount(null);

        await fetchAccounts();

        showMessage(
          "success",
          data.message ||
            `Account marked as ${status}`
        );
      } else {
        showMessage(
          "error",
          data.message ||
            "Failed to change status"
        );
      }
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        "Server error"
      );
    }
  };

  /* =========================
     FILTER ACCOUNTS
  ========================= */

  const filteredAccounts = useMemo(() => {

  return accounts.filter((acc) => {

    const matchesStatus =
      filter === "All" ||
      String(acc.status || "")
        .toLowerCase() ===
        filter.toLowerCase();


    const searchValue =
      search.toLowerCase().trim();


    const matchesSearch =
      !searchValue ||
      String(acc.user || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(acc.email || "")
        .toLowerCase()
        .includes(searchValue);


    const matchesSize =
      sizeFilter === "All" ||
      String(acc.size)
        .replace(/[^0-9]/g, "") ===
        sizeFilter;


    /*
    |--------------------------------------------------------------------------
    | DATE FILTER
    |--------------------------------------------------------------------------
    */

    const matchesDate =
      !dateFilter ||
      getNigeriaDate(acc.created_at) ===
        dateFilter;


    return (
      matchesStatus &&
      matchesSearch &&
      matchesSize &&
      matchesDate
    );

  });

}, [
  accounts,
  filter,
  search,
  sizeFilter,
  dateFilter,
]);

  /* =========================
     STATISTICS
  ========================= */

  const totalAccounts = accounts.length;

  const activeAccounts = accounts.filter(
    (acc) =>
      String(acc.status).toLowerCase() ===
      "active"
  ).length;

  const pendingAccounts = accounts.filter(
    (acc) =>
      String(acc.status).toLowerCase() ===
      "pending"
  ).length;

  const failedAccounts = accounts.filter(
    (acc) =>
      String(acc.status).toLowerCase() ===
      "failed"
  ).length;

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredAccounts.length /
      accountsPerPage
  );

  const indexOfLast =
    currentPage * accountsPerPage;

  const indexOfFirst =
    indexOfLast - accountsPerPage;

  const currentAccounts =
    filteredAccounts.slice(
      indexOfFirst,
      indexOfLast
    );

  /* =========================
     STATUS STYLE
  ========================= */

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "active") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (value === "pending") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    if (value === "failed") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  /* =========================
     RESET PAGE WHEN FILTERING
  ========================= */

  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 text-white">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          

          <div>

            <div className="flex items-center gap-2 mb-2">

              <WalletCards
                size={18}
                className="text-blue-400"
              />

              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                Account Management
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Account Plans
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage trading accounts, credentials
              and account status.
            </p>

          </div>

          <button
            onClick={() =>
              fetchAccounts(true)
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


        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">

          <StatCard
            title="Total Accounts"
            value={totalAccounts}
            icon={WalletCards}
            style="text-blue-400 bg-blue-500/10 border-blue-500/20"
          />

          <StatCard
            title="Active"
            value={activeAccounts}
            icon={Activity}
            style="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          />

          <StatCard
            title="Pending"
            value={pendingAccounts}
            icon={Clock3}
            style="text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
          />

          <StatCard
            title="Failed"
            value={failedAccounts}
            icon={XCircle}
            style="text-red-400 bg-red-500/10 border-red-500/20"
          />

        </div>


        {/* ================= FILTER BAR ================= */}

        <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl p-4 mb-5">

  <div className="flex flex-col lg:flex-row gap-3">

    {/* SEARCH */}

    <div className="relative flex-1">

      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
      />

      <input
        type="text"
        placeholder="Search by user or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#070A11] border border-white/10 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/50 transition"
      />

    </div>


    {/* DATE */}

    <div className="relative">

      <CalendarDays
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
      />

      <input
        type="date"
        value={dateFilter}
        onChange={(e) => {
          setDateFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="h-11 pl-9 pr-3 rounded-xl bg-[#070A11] border border-white/10 text-sm text-gray-300 outline-none focus:border-blue-500/50 transition"
      />

    </div>


    {/* SIZE */}

    <div className="relative">

      <Filter
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
      />

      <select
        value={sizeFilter}
        onChange={(e) => {
          setSizeFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="h-11 pl-9 pr-8 rounded-xl bg-[#070A11] border border-white/10 text-sm text-gray-300 outline-none focus:border-blue-500/50"
      >

        <option value="All">
          All Sizes
        </option>

        <option value="50000">
          50K
        </option>

        <option value="100000">
          100K
        </option>

        <option value="200000">
          200K
        </option>

        <option value="300000">
          300K
        </option>

        <option value="400000">
          400K
        </option>

        <option value="600000">
          600K
        </option>

        <option value="800000">
          800K
        </option>

      </select>

    </div>


    {/* STATUS */}

    <select
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="h-11 px-4 rounded-xl bg-[#070A11] border border-white/10 text-sm text-gray-300 outline-none focus:border-blue-500/50"
    >

      <option value="All">
        All Status
      </option>

      <option value="Active">
        Active
      </option>

      <option value="Pending">
        Pending
      </option>

      <option value="Failed">
        Failed
      </option>

    </select>

  </div>

</div>


        {/* ================= TABLE ================= */}

        <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-white/[0.07]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Trading Accounts
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {filteredAccounts.length} accounts found
                </p>

              </div>

              <WalletCards
                size={20}
                className="text-blue-400"
              />

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="min-w-[950px] w-full text-sm">

              <thead>

                <tr className="border-b border-white/[0.07] text-gray-500">

                  <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider">
                    Account
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Type
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Size
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Phase
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] uppercase tracking-wider">
                    Action
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

                      <RefreshCw
                        size={24}
                        className="mx-auto mb-3 text-blue-400 animate-spin"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading accounts...
                      </p>

                    </td>

                  </tr>

                ) : currentAccounts.length > 0 ? (

                  currentAccounts.map(
                    (acc) => (

                      <tr
                        key={acc.id}
                        className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.025] transition"
                      >

                        {/* ACCOUNT */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                              <WalletCards
                                size={18}
                                className="text-blue-400"
                              />

                            </div>

                            <div>

                              <p className="font-medium text-white">
                                {acc.user ||
                                  "N/A"}
                              </p>

                              <p className="text-[11px] text-gray-600">
                                AC/{acc.id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* TYPE */}

                        <td className="px-4 py-4">

                          <span className="text-gray-300">
                            {acc.type ||
                              "N/A"}
                          </span>

                        </td>


                        {/* SIZE */}

                        <td className="px-4 py-4">

                          <span className="font-medium text-gray-200">
                            {formatMoney(
                              acc.size
                            )}
                          </span>

                        </td>


                        {/* PHASE */}

                        <td className="px-4 py-4">

                          <span className="text-gray-400 capitalize">

                            {acc.type ===
                            "Challenge"
                              ? acc.phase ||
                                "N/A"
                              : acc.type ||
                                "N/A"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                              acc.status
                            )}`}
                          >

                            <span className="w-1.5 h-1.5 rounded-full bg-current" />

                            {acc.status ||
                              "N/A"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              setSelectedAccount(
                                normalizeAccount(
                                  acc
                                )
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-xs font-medium"
                          >

                            <Eye
                              size={15}
                            />

                            Manage

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-16 text-center"
                    >

                      <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">

                        <WalletCards
                          size={20}
                          className="text-gray-600"
                        />

                      </div>

                      <p className="text-gray-400 text-sm">
                        No accounts found
                      </p>

                      <p className="text-gray-600 text-xs mt-1">
                        Try changing your search
                        or filters.
                      </p>

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
                    filteredAccounts.length
                  )}
                </span>

                {" of "}

                <span className="text-gray-300">
                  {filteredAccounts.length}
                </span>

              </p>


              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setCurrentPage(
                      (p) =>
                        Math.max(
                          p - 1,
                          1
                        )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 disabled:opacity-30"
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
                  (_, i) => {

                    let page;

                    if (
                      totalPages <= 5
                    ) {
                      page = i + 1;
                    } else if (
                      currentPage <= 3
                    ) {
                      page = i + 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      page =
                        totalPages -
                        4 +
                        i;
                    } else {
                      page =
                        currentPage -
                        2 +
                        i;
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
                      (p) =>
                        Math.min(
                          p + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 disabled:opacity-30"
                >

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>

            </div>

          )}

        </div>


        {/* ================= ACCOUNT MODAL ================= */}

        <AccountModal
          selectedAccount={
            selectedAccount
          }
          setSelectedAccount={
            setSelectedAccount
          }
          handleSave={handleSave}
          changeStatus={changeStatus}
        />


        {/* ================= TOAST ================= */}

        {message.show && (

          <div className="fixed right-5 top-5 z-[9999]">

            <div
              className={`flex w-[320px] max-w-[calc(100vw-40px)] items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-xl ${
                message.type ===
                "success"
                  ? "border-emerald-500/20 bg-[#071711]/95 text-emerald-200"
                  : "border-red-500/20 bg-[#190909]/95 text-red-200"
              }`}
            >

              <div
                className={`mt-0.5 ${
                  message.type ===
                  "success"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >

                {message.type ===
                "success" ? (
                  <CheckCircle2
                    size={20}
                  />
                ) : (
                  <AlertCircle
                    size={20}
                  />
                )}

              </div>


              <div className="flex-1">

                <h4 className="font-semibold mb-1">
                  {message.type ===
                  "success"
                    ? "Success"
                    : "Error"}
                </h4>

                <p className="text-sm text-gray-400">
                  {message.text}
                </p>

              </div>


              <button
                onClick={closeMessage}
                className="text-gray-500 hover:text-white"
              >

                <X size={17} />

              </button>

            </div>

          </div>

        )}

      </div>
    </AdminLayout>
  );
};


/* =========================
   STAT CARD
========================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  style,
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
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${style}`}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
};

export default Accounts;