import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock3,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Activity,
} from "lucide-react";
import MPLayout from "../Components/Layout2";

const MPDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 const fetchDashboard = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const token = localStorage.getItem("staff_token");

    // No token
    if (!token) {
      localStorage.removeItem("staff_token");
      localStorage.removeItem("staff");

      navigate("/auth/staff", { replace: true });
      return;
    }

    const res = await fetch(
      "https://api.fundednaira.net/api/Staff/mp_dashboard.php",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Token invalid / expired / forbidden
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
      setStats({
        total_requests: Number(data.total_requests || 0),
        pending_requests: Number(data.pending_requests || 0),
        approved_requests: Number(data.approved_requests || 0),
        rejected_requests: Number(data.rejected_requests || 0),
      });
    } else {
      console.error(
        data.message || "Failed to load dashboard"
      );
    }
  } catch (err) {
    console.error("Dashboard error:", err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Requests",
      value: stats.total_requests,
      description: "All phase requests",
      icon: FileText,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      border: "border-blue-500/10",
    },
    {
      title: "Pending Requests",
      value: stats.pending_requests,
      description: "Awaiting review",
      icon: Clock3,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      border: "border-yellow-500/10",
    },
    {
      title: "Approved Requests",
      value: stats.approved_requests,
      description: "Successfully approved",
      icon: CheckCircle,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      border: "border-green-500/10",
    },
    {
      title: "Rejected Requests",
      value: stats.rejected_requests,
      description: "Requests rejected",
      icon: XCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      border: "border-red-500/10",
    },
  ];

  const getPercentage = (value) => {
    if (!stats.total_requests) return 0;

    return Math.round((value / stats.total_requests) * 100);
  };

  return (
    <MPLayout>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10">
                  <Activity size={17} className="text-blue-400" />
                </div>

                <span className="text-sm font-medium text-blue-400">
                  Management Overview
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Phase Manager Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Monitor and manage trader phase requests from one place.
              </p>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Stat Cards */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-gray-800 bg-gray-900 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-28 rounded bg-gray-800" />
                      <div className="h-9 w-20 rounded bg-gray-800" />
                      <div className="h-3 w-32 rounded bg-gray-800" />
                    </div>

                    <div className="h-12 w-12 rounded-xl bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const percentage = getPercentage(card.value);

                return (
                  <div
                    key={index}
                    className={`group rounded-2xl border ${card.border} bg-gray-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-gray-700 hover:bg-gray-900/80`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">
                          {card.title}
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          {card.value.toLocaleString()}
                        </h2>

                        <p className="mt-2 text-xs text-gray-500">
                          {card.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                      >
                        <Icon
                          size={23}
                          className={card.iconColor}
                        />
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Share of requests
                        </span>

                        <span className={card.iconColor}>
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${card.iconBg.replace(
                            "/10",
                            ""
                          )}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Management Overview */}
          {!loading && (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">

              {/* Main Overview */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Request Overview
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Current phase request activity.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 p-2.5">
                    <FileText
                      size={20}
                      className="text-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-5">

                  {/* Pending */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-400">
                        Pending
                      </span>

                      <span className="font-medium text-yellow-400">
                        {stats.pending_requests}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                        style={{
                          width: `${getPercentage(
                            stats.pending_requests
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Approved */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-400">
                        Approved
                      </span>

                      <span className="font-medium text-green-400">
                        {stats.approved_requests}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-700"
                        style={{
                          width: `${getPercentage(
                            stats.approved_requests
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Rejected */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-400">
                        Rejected
                      </span>

                      <span className="font-medium text-red-400">
                        {stats.rejected_requests}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-red-500 transition-all duration-700"
                        style={{
                          width: `${getPercentage(
                            stats.rejected_requests
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Status */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Management
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Phase request controls
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-500/10 p-2.5">
                    <CheckCircle
                      size={20}
                      className="text-green-400"
                    />
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />

                    <div>
                      <p className="text-sm font-medium">
                        System Active
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Request management is available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Total requests
                    </span>

                    <span className="font-semibold">
                      {stats.total_requests.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Pending Review
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Requests waiting for action.
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-blue-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Information */}
          <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Phase Request Management
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review, approve and reject trader phase requests
                  submitted through the platform.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Live
              </div>
            </div>
          </div>

        </div>
      </div>
    </MPLayout>
  );
};

export default MPDashboard;