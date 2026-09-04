import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Banknote,
  UsersRound,
  Clock3,
  RefreshCw,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import StaffLayout from "../Components/LayoutPS";

const PendingDashboard = () => {
  const [stats, setStats] = useState({
    pending_purchased_accounts: 0,
    pending_payouts: 0,
    pending_referral_withdrawals: 0,
    total_pending: 0,
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

      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/pending-dashboard.php"
      );

      const data = await res.json();

      if (data.success) {
        setStats({
          pending_purchased_accounts: Number(
            data.stats?.pending_purchased_accounts || 0
          ),

          pending_payouts: Number(
            data.stats?.pending_payouts || 0
          ),

          pending_referral_withdrawals: Number(
            data.stats?.pending_referral_withdrawals || 0
          ),

          total_pending: Number(
            data.stats?.total_pending || 0
          ),
        });
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
      title: "Pending Purchased Accounts",
      value: stats.pending_purchased_accounts,
      description: "Accounts waiting for processing",
      icon: ShoppingCart,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      border: "border-blue-500/10",
    },

    {
      title: "Pending Payouts",
      value: stats.pending_payouts,
      description: "Payouts waiting for processing",
      icon: Banknote,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      border: "border-yellow-500/10",
    },

    {
      title: "Pending Referral Withdrawals",
      value: stats.pending_referral_withdrawals,
      description: "Referral withdrawals waiting",
      icon: UsersRound,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      border: "border-purple-500/10",
    },

    {
      title: "Total Pending",
      value: stats.total_pending,
      description: "All pending requests",
      icon: Clock3,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      border: "border-red-500/10",
    },
  ];

  return (
    <StaffLayout>
      <div className="min-h-screen bg-[#0B0F19] text-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* ================= HEADER ================= */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10">
                  <Activity
                    size={17}
                    className="text-blue-400"
                  />
                </div>

                <span className="text-sm font-medium text-blue-400">
                  Staff Overview
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Pending Requests Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Monitor pending account purchases, payouts and referral withdrawals.
              </p>

            </div>


            {/* Refresh */}

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-gray-800
                bg-gray-900
                px-4 py-2.5
                text-sm font-medium
                text-gray-300
                transition
                hover:border-gray-700
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}

            </button>

          </div>


          {/* ================= STAT CARDS ================= */}

          {loading ? (

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (

                <div
                  key={item}
                  className="
                    animate-pulse
                    rounded-2xl
                    border border-gray-800
                    bg-gray-900
                    p-6
                  "
                >

                  <div className="flex items-start justify-between">

                    <div className="space-y-3">

                      <div className="h-4 w-36 rounded bg-gray-800" />

                      <div className="h-9 w-20 rounded bg-gray-800" />

                      <div className="h-3 w-40 rounded bg-gray-800" />

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

                return (

                  <div
                    key={index}
                    className={`
                      group
                      rounded-2xl
                      border
                      ${card.border}
                      bg-gray-900
                      p-6
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-gray-700
                      hover:bg-gray-900/80
                    `}
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
                        className={`
                          flex h-12 w-12
                          items-center justify-center
                          rounded-xl
                          ${card.iconBg}
                        `}
                      >

                        <Icon
                          size={23}
                          className={card.iconColor}
                        />

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          )}


          {/* ================= PENDING OVERVIEW ================= */}

          {!loading && (

            <div className="mt-8 grid gap-6 lg:grid-cols-3">

              {/* Main Overview */}

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">
                      Pending Request Overview
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Current requests waiting for staff action.
                    </p>

                  </div>

                  <div className="rounded-xl bg-blue-500/10 p-2.5">

                    <Clock3
                      size={20}
                      className="text-blue-400"
                    />

                  </div>

                </div>


                <div className="mt-8 space-y-6">

                  {/* Purchased Accounts */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-gray-400">
                        Purchased Accounts
                      </span>

                      <span className="font-medium text-blue-400">
                        {stats.pending_purchased_accounts}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">

                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-700"
                        style={{
                          width:
                            stats.total_pending > 0
                              ? `${(
                                  stats.pending_purchased_accounts /
                                  stats.total_pending
                                ) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>


                  {/* Payouts */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-gray-400">
                        Payouts
                      </span>

                      <span className="font-medium text-yellow-400">
                        {stats.pending_payouts}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">

                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                        style={{
                          width:
                            stats.total_pending > 0
                              ? `${(
                                  stats.pending_payouts /
                                  stats.total_pending
                                ) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>


                  {/* Referral Withdrawals */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-gray-400">
                        Referral Withdrawals
                      </span>

                      <span className="font-medium text-purple-400">
                        {stats.pending_referral_withdrawals}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">

                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-700"
                        style={{
                          width:
                            stats.total_pending > 0
                              ? `${(
                                  stats.pending_referral_withdrawals /
                                  stats.total_pending
                                ) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* ================= QUICK STATUS ================= */}

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">
                      Staff Workspace
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Pending request status
                    </p>

                  </div>

                  <div className="rounded-xl bg-green-500/10 p-2.5">

                    <Activity
                      size={20}
                      className="text-green-400"
                    />

                  </div>

                </div>


                {/* System */}

                <div className="mt-7 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">

                  <div className="flex items-center gap-3">

                    <div className="
                      h-2.5 w-2.5
                      rounded-full
                      bg-green-500
                      shadow-[0_0_10px_rgba(34,197,94,0.6)]
                    " />

                    <div>

                      <p className="text-sm font-medium">
                        System Active
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Staff request management is available.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Total Pending */}

                <div className="mt-4 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-gray-400">
                      Total Pending
                    </span>

                    <span className="font-semibold text-white">
                      {stats.total_pending.toLocaleString()}
                    </span>

                  </div>

                </div>


                {/* Action Notice */}

                <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-sm font-medium text-blue-300">
                        Pending Review
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Requests are waiting for staff action.
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


          {/* ================= BOTTOM INFORMATION ================= */}

          <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-lg font-semibold">
                  Pending Request Management
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review and process pending purchased accounts,
                  payouts and referral withdrawals.
                </p>

              </div>

              <div className="
                flex items-center gap-2
                rounded-full
                border border-green-500/20
                bg-green-500/5
                px-3 py-1.5
                text-xs text-green-400
              ">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                Live

              </div>

            </div>

          </div>

        </div>

      </div>
    </StaffLayout>
  );
};

export default PendingDashboard;