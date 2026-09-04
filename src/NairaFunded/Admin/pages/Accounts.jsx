import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  WalletCards,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingDown,
} from "lucide-react";

import AddPlanModal from "../components/AddPlanModal";
import EditPlanModal from "../components/EditPlanModal";

const API_BASE =
  "https://api.fundednaira.net/api/admin";

const AccountPlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const plansPerPage = 10;

  const [newPlan, setNewPlan] = useState({
    size: "",
    price: "",
    type: "",
    loss: "",
    target: "",
    split: "",
  });

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  /* =========================
     AUTH
  ========================= */

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

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth/admin");
  };

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
     FORMATTERS
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

  const formatPercent = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0%";
    }

    const cleanValue = String(value)
      .replace("%", "")
      .trim();

    return `${cleanValue}%`;
  };

  /* =========================
     FETCH PLANS
  ========================= */

  const fetchPlans = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const headers = getAuthHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(
        `${API_BASE}/get-plans.php`,
        {
          method: "GET",
          headers,
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      console.log(
        "PLANS RESPONSE:",
        res.status,
        text
      );

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from server"
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message || "Failed to fetch plans"
        );
      }

      /*
       * Supports:
       *
       * [...]
       *
       * {
       *   success: true,
       *   plans: [...]
       * }
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       */

      if (Array.isArray(data)) {
        setPlans(data);
      } else if (Array.isArray(data.plans)) {
        setPlans(data.plans);
      } else if (Array.isArray(data.data)) {
        setPlans(data.data);
      } else {
        setPlans([]);

        showMessage(
          "error",
          data.message ||
            "No plans returned from server"
        );
      }
    } catch (error) {
      console.error(
        "FETCH PLANS ERROR:",
        error
      );

      setPlans([]);

      showMessage(
        "error",
        error.message ||
          "Failed to fetch plans"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* =========================
     ADD PLAN
  ========================= */

  const addPlan = async () => {
    if (
      !newPlan.size ||
      !newPlan.price ||
      !newPlan.type ||
      !newPlan.loss ||
      !newPlan.target ||
      !newPlan.split
    ) {
      showMessage(
        "error",
        "All fields are required"
      );

      return;
    }

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(
        `${API_BASE}/add-plan.php`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(newPlan),
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from server"
        );
      }

      console.log(
        "ADD PLAN RESPONSE:",
        data
      );

      if (data.success) {
        setShowModal(false);

        setNewPlan({
          size: "",
          price: "",
          type: "",
          loss: "",
          target: "",
          split: "",
        });

        await fetchPlans();

        showMessage(
          "success",
          data.message ||
            "Plan added successfully"
        );
      } else {
        showMessage(
          "error",
          data.message ||
            "Failed to add plan"
        );
      }
    } catch (error) {
      console.error(
        "ADD PLAN ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Server error"
      );
    }
  };

  /* =========================
     UPDATE PLAN
  ========================= */

  const updatePlan = async () => {
    if (!editPlan) return;

    if (
      !editPlan.size ||
      !editPlan.price ||
      !editPlan.type ||
      !editPlan.loss ||
      !editPlan.target ||
      !editPlan.split
    ) {
      showMessage(
        "error",
        "All fields are required"
      );

      return;
    }

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(
        `${API_BASE}/update-plan.php`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(editPlan),
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from server"
        );
      }

      console.log(
        "UPDATE PLAN RESPONSE:",
        data
      );

      if (data.success) {
        setShowEditModal(false);
        setEditPlan(null);

        await fetchPlans();

        showMessage(
          "success",
          data.message ||
            "Plan updated successfully"
        );
      } else {
        showMessage(
          "error",
          data.message ||
            "Failed to update plan"
        );
      }
    } catch (error) {
      console.error(
        "UPDATE PLAN ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Server error"
      );
    }
  };

  /* =========================
     DELETE PLAN
  ========================= */

  const deletePlan = async (id) => {
    if (!id) {
      showMessage(
        "error",
        "Invalid plan ID"
      );

      return;
    }

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(
        `${API_BASE}/delete-plan.php`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            id,
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from server"
        );
      }

      console.log(
        "DELETE PLAN RESPONSE:",
        data
      );

      if (data.success) {
        setShowEditModal(false);
        setEditPlan(null);

        await fetchPlans();

        showMessage(
          "success",
          data.message ||
            "Plan deleted successfully"
        );
      } else {
        showMessage(
          "error",
          data.message ||
            "Failed to delete plan"
        );
      }
    } catch (error) {
      console.error(
        "DELETE PLAN ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Server error"
      );
    }
  };

  /* =========================
     STATISTICS
  ========================= */

  const totalPlans = plans.length;

  const challengePlans = plans.filter(
    (plan) =>
      String(plan.type)
        .toLowerCase() ===
      "challenge"
  ).length;

  const instantPlans = plans.filter(
    (plan) =>
      String(plan.type)
        .toLowerCase() !==
      "challenge"
  ).length;

  const totalPlanValue = useMemo(() => {
    return plans.reduce(
      (total, plan) =>
        total +
        Number(
          String(plan.size || 0).replace(
            /[^0-9.]/g,
            ""
          )
        ),
      0
    );
  }, [plans]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    plans.length / plansPerPage
  );

  const indexOfLast =
    currentPage * plansPerPage;

  const indexOfFirst =
    indexOfLast - plansPerPage;

  const currentPlans = plans.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =========================
     RETURN
  ========================= */

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

              <span className="text-xs uppercase tracking-widest font-semibold text-blue-400">
                Trading Configuration
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Account Plans
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Create and manage trading account
              plans available to traders.
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                fetchPlans(true)
              }
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition disabled:opacity-50"
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

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white font-medium shadow-lg shadow-blue-500/10 hover:opacity-90 transition"
            >

              <Plus size={17} />

              Add Plan

            </button>

          </div>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-7">

          <PlanStat
            title="Total Plans"
            value={totalPlans}
            icon={WalletCards}
            iconClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
          />

          <PlanStat
            title="Challenge Plans"
            value={challengePlans}
            icon={Target}
            iconClass="text-purple-400 bg-purple-500/10 border-purple-500/20"
          />

          <PlanStat
            title="Instant Plans"
            value={instantPlans}
            icon={TrendingDown}
            iconClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          />

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-[#0B0F19] border border-white/[0.07] rounded-2xl overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-white/[0.07]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Available Plans
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {plans.length} plan
                  {plans.length !== 1
                    ? "s"
                    : ""}{" "}
                  configured
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
                    Account Size
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Price
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Type
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Max Loss
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Target
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] uppercase tracking-wider">
                    Profit Split
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
                      colSpan="7"
                      className="py-16 text-center"
                    >

                      <RefreshCw
                        size={25}
                        className="mx-auto mb-3 text-blue-400 animate-spin"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading plans...
                      </p>

                    </td>

                  </tr>

                ) : currentPlans.length > 0 ? (

                  currentPlans.map(
                    (plan) => (

                      <tr
                        key={plan.id}
                        className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.025] transition"
                      >

                        {/* SIZE */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                              <WalletCards
                                size={18}
                                className="text-blue-400"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-white">
                                {formatMoney(
                                  plan.size
                                )}
                              </p>

                              <p className="text-[11px] text-gray-600">
                                PLAN/{plan.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PRICE */}

                        <td className="px-4 py-4">

                          <span className="font-semibold text-gray-200">
                            {formatMoney(
                              plan.price
                            )}
                          </span>

                        </td>

                        {/* TYPE */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium border ${
                              String(
                                plan.type
                              ).toLowerCase() ===
                              "challenge"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >

                            {plan.type ||
                              "N/A"}

                          </span>

                        </td>

                        {/* LOSS */}

                        <td className="px-4 py-4">

                          <span className="text-red-400 font-medium">
                            {formatPercent(
                              plan.loss
                            )}
                          </span>

                        </td>

                        {/* TARGET */}

                        <td className="px-4 py-4">

                          <span className="text-emerald-400 font-medium">
                            {formatPercent(
                              plan.target
                            )}
                          </span>

                        </td>

                        {/* SPLIT */}

                        <td className="px-4 py-4">

                          <span className="text-blue-400 font-medium">
                            {formatPercent(
                              plan.split
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() => {
                              setEditPlan(plan);
                              setShowEditModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition text-xs font-medium"
                          >

                            <Pencil
                              size={14}
                            />

                            Edit

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="py-16 text-center"
                    >

                      <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">

                        <WalletCards
                          size={20}
                          className="text-gray-600"
                        />

                      </div>

                      <p className="text-gray-400 text-sm">
                        No account plans found
                      </p>

                      <p className="text-gray-600 text-xs mt-1">
                        Create your first plan
                        using the Add Plan button.
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
                    plans.length
                  )}
                </span>

                {" of "}

                <span className="text-gray-300">
                  {plans.length}
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

        {/* ================= MODALS ================= */}

        <AddPlanModal
          show={showModal}
          setShow={setShowModal}
          addPlan={addPlan}
          newPlan={newPlan}
          setNewPlan={setNewPlan}
        />

        <EditPlanModal
          show={showEditModal}
          setShow={setShowEditModal}
          editPlan={editPlan}
          setEditPlan={setEditPlan}
          updatePlan={updatePlan}
          deletePlan={deletePlan}
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

const PlanStat = ({
  title,
  value,
  icon: Icon,
  iconClass,
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
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconClass}`}
        >

          <Icon size={19} />

        </div>

      </div>

    </div>
  );
};

export default AccountPlans;