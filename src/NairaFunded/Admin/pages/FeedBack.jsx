import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageSquare,
  Star,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import FeedbackModal from "../components/FeedbackModal";

const API =
  "https://api.fundednaira.net/api/admin/get-feedbacks.php";

const Feedback = () => {
  const navigate = useNavigate();

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const perPage = 10;

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

  // =========================
  // FETCH FEEDBACK
  // =========================

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(API, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      // =========================
      // AUTH FAILURE
      // =========================

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const text = await res.text();

      let data = [];

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON:", text);
        data = [];
      }

      setFeedbacks(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("fetchFeedbacks error:", error);
      setFeedbacks([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // =========================
  // FILTER TYPES
  // =========================

  const feedbackTypes = useMemo(() => {
    const types = feedbacks
      .map((item) => item.type)
      .filter(Boolean)
      .map((item) => String(item));

    return ["All", ...new Set(types)];
  }, [feedbacks]);

  // =========================
  // FILTER DATA
  // =========================

  const filteredFeedbacks = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return feedbacks.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.message || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.type || "")
          .toLowerCase()
          .includes(keyword);

      const matchesType =
        typeFilter === "All" ||
        String(item.type || "").toLowerCase() ===
          typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [feedbacks, search, typeFilter]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredFeedbacks.length / perPage
  );

  const safePage =
    totalPages > 0
      ? Math.min(currentPage, totalPages)
      : 1;

  const indexOfLast = safePage * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filteredFeedbacks.slice(
    indexOfFirst,
    indexOfLast
  );

  // =========================
  // STATISTICS
  // =========================

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : "0.0";

  const positiveFeedback = feedbacks.filter(
    (item) => Number(item.rating || 0) >= 4
  ).length;

  const positivePercentage =
    feedbacks.length > 0
      ? Math.round(
          (positiveFeedback / feedbacks.length) * 100
        )
      : 0;

  // =========================
  // HELPERS
  // =========================

  const getTypeClass = (type) => {
    const value = String(type || "").toLowerCase();

    if (
      value.includes("complaint") ||
      value.includes("issue") ||
      value.includes("problem")
    ) {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (
      value.includes("suggest") ||
      value.includes("feature")
    ) {
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }

    if (
      value.includes("support") ||
      value.includes("question")
    ) {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const getRatingClass = (rating) => {
    const value = Number(rating || 0);

    if (value >= 4) {
      return "text-green-400";
    }

    if (value === 3) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  // =========================
  // PAGE BUTTONS
  // =========================

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (safePage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (safePage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        safePage - 1,
        safePage,
        safePage + 1,
        "...",
        totalPages
      );
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`dots-${index}`}
            className="px-2 text-gray-500"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-medium transition ${
            safePage === page
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "border border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <MessageSquare size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  User Feedback
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Review feedback and understand your users.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={fetchFeedbacks}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Feedback
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {feedbacks.length}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  All user submissions
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <MessageSquare size={22} />
              </div>

            </div>

          </div>

          {/* RATING */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Average Rating
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <h3 className="text-3xl font-bold">
                    {averageRating}
                  </h3>

                  <Star
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />

                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Out of 5.0
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <Star size={22} />
              </div>

            </div>

          </div>

          {/* POSITIVE */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Positive Feedback
                </p>

                <h3 className="mt-2 text-3xl font-bold text-green-400">
                  {positivePercentage}%
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Ratings of 4 stars or higher
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <Users size={22} />
              </div>

            </div>

          </div>

        </div>

        {/* ================= FILTER BAR ================= */}

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email or message..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            {/* TYPE */}

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
            >
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All"
                    ? "All Feedback Types"
                    : type}
                </option>
              ))}
            </select>

            {(search || typeFilter !== "All") && (
              <button
                onClick={resetFilters}
                className="rounded-xl border border-gray-800 bg-gray-950 px-5 py-3 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                Clear
              </button>
            )}

          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">

            <span>
              Showing {filteredFeedbacks.length} feedback
              {filteredFeedbacks.length !== 1 ? "s" : ""}
            </span>

            {search && (
              <span>
                Search results for{" "}
                <span className="text-gray-300">
                  "{search}"
                </span>
              </span>
            )}

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/60">

                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">

                  <th className="px-5 py-4">
                    User
                  </th>

                  <th className="px-5 py-4">
                    Type
                  </th>

                  <th className="px-5 py-4">
                    Rating
                  </th>

                  <th className="px-5 py-4">
                    Feedback
                  </th>

                  <th className="px-5 py-4">
                    Date
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
                        <td
                          colSpan="6"
                          className="px-5 py-4"
                        >
                          <div className="h-10 animate-pulse rounded-xl bg-gray-800/60" />
                        </td>
                      </tr>
                    )
                  )

                ) : currentData.length > 0 ? (

                  currentData.map((feedback) => (

                    <tr
                      key={feedback.id}
                      className="border-b border-gray-800 transition hover:bg-gray-800/30"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 font-semibold text-blue-400">
                            {String(
                              feedback.name || "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-white">
                              {feedback.name ||
                                "Unknown User"}
                            </p>

                            <p className="max-w-[220px] truncate text-xs text-gray-500">
                              {feedback.email ||
                                "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getTypeClass(
                            feedback.type
                          )}`}
                        >
                          {feedback.type ||
                            "General"}
                        </span>

                      </td>

                      {/* RATING */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5">

                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span
                            className={`font-semibold ${getRatingClass(
                              feedback.rating
                            )}`}
                          >
                            {feedback.rating || 0}
                          </span>

                          <span className="text-gray-600">
                            /5
                          </span>

                        </div>

                      </td>

                      {/* MESSAGE */}

                      <td className="max-w-[400px] px-5 py-4">

                        <p
                          title={feedback.message}
                          className="truncate text-gray-300"
                        >
                          {feedback.message ||
                            "No message provided"}
                        </p>

                      </td>

                      {/* DATE */}

                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {feedback.created_at ||
                          "N/A"}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            setSelectedFeedback(
                              feedback
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={16} />

                          View
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                        <MessageSquare size={25} />
                      </div>

                      <h3 className="mt-4 font-semibold text-white">
                        No feedback found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or
                        filter.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================= PAGINATION ================= */}

        {totalPages > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-medium text-gray-300">
                {safePage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-300">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center justify-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(p - 1, 1)
                  )
                }
                disabled={safePage === 1}
                className="flex h-10 items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />

                <span className="hidden sm:inline">
                  Previous
                </span>
              </button>

              <div className="flex items-center gap-1">
                {renderPageNumbers()}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={
                  safePage === totalPages
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">
                  Next
                </span>

                <ChevronRight size={16} />
              </button>

            </div>

          </div>
        )}

        {/* ================= MODAL ================= */}

        <FeedbackModal
          feedback={selectedFeedback}
          setFeedback={setSelectedFeedback}
        />

      </div>
    </AdminLayout>
  );
};

export default Feedback;