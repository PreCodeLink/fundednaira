import { useEffect, useState } from "react";
import {
  FileText,
  Clock3,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Activity,
} from "lucide-react";

import MPLayout from "../Components/Layout2";

const MPDashboard = () => {
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/mp2_dashboard.php"
      );

      const data = await res.json();

      if (data.success) {
        setStats({
          total_requests: data.total_requests || 0,
          pending_requests: data.pending_requests || 0,
          approved_requests: data.approved_requests || 0,
          rejected_requests: data.rejected_requests || 0,
        });
      }
    } catch (err) {
      console.log(err);
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
      description: "Rejected requests",
      icon: XCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      border: "border-red-500/10",
    },
  ];

  return (
    <MPLayout>
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Activity
                size={18}
                className="text-blue-400"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Management Overview
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Phase Manager Dashboard
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Monitor and manage phase requests submitted by
              users.
            </p>
          </div>

          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-white/5
              bg-white/[0.03]
              px-4 py-3
              text-sm font-medium text-gray-300
              transition
              hover:bg-white/[0.06]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* ================= STATS ================= */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  border border-white/5
                  bg-[#0D121C]
                  p-6
                "
              >
                <div className="animate-pulse">

                  <div className="flex items-center justify-between">

                    <div className="space-y-3">
                      <div className="h-3 w-28 rounded bg-white/5" />
                      <div className="h-9 w-16 rounded bg-white/5" />
                    </div>

                    <div className="h-12 w-12 rounded-xl bg-white/5" />

                  </div>

                  <div className="mt-5 h-3 w-32 rounded bg-white/5" />

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`
                    group relative overflow-hidden
                    rounded-2xl
                    border ${card.border}
                    bg-[#0D121C]
                    p-6
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-white/10
                    hover:shadow-xl
                  `}
                >

                  {/* Background glow */}
                  <div
                    className={`
                      pointer-events-none
                      absolute -right-8 -top-8
                      h-24 w-24
                      rounded-full
                      ${card.iconBg}
                      blur-2xl
                    `}
                  />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-sm font-medium text-gray-500">
                          {card.title}
                        </p>

                        <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                          {card.value.toLocaleString()}
                        </h3>

                      </div>

                      <div
                        className={`
                          flex h-12 w-12
                          items-center justify-center
                          rounded-xl
                          ${card.iconBg}
                          ${card.iconColor}
                        `}
                      >
                        <Icon size={22} />
                      </div>

                    </div>

                    <div className="mt-5 flex items-center gap-2">

                      <span className="text-xs text-gray-600">
                        {card.description}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ================= MANAGEMENT CARD ================= */}
        <div className="mt-8">

          <div
            className="
              relative overflow-hidden
              rounded-2xl
              border border-white/5
              bg-[#0D121C]
              p-6
              lg:p-7
            "
          >

            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-600/5 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FileText size={22} />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    Phase Request Management
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                    Review submitted requests, verify account
                    information, and approve or reject phase
                    requests.
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  (window.location.href =
                    "/staff/phase-requests")
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-600/10
                  transition
                  hover:bg-blue-500
                "
              >
                View Requests
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>

        {/* ================= SUMMARY ================= */}
        {!loading && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-white/5 bg-[#0D121C] p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                    Request Activity
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Total requests currently recorded
                  </p>
                </div>

                <FileText
                  size={20}
                  className="text-gray-600"
                />

              </div>

              <p className="mt-4 text-2xl font-bold">
                {stats.total_requests.toLocaleString()}
              </p>

            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0D121C] p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                    Pending Attention
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Requests waiting for management review
                  </p>
                </div>

                <Clock3
                  size={20}
                  className="text-yellow-500"
                />

              </div>

              <p className="mt-4 text-2xl font-bold text-yellow-400">
                {stats.pending_requests.toLocaleString()}
              </p>

            </div>

          </div>
        )}

      </div>
    </MPLayout>
  );
};

export default MPDashboard;