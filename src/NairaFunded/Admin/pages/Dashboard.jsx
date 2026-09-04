import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";


import {
  Users,
  UserCheck,
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowDownToLine,
  Gift,
  Package,
  ShoppingBag,
  UserPlus,
  RefreshCw,
  Activity,
  ShieldCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    monthly_payments: [],
    monthly_payouts: [],
    account_purchases: [],
    referral_withdrawals: [],
    most_purchased_accounts: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatMoney = (value) => {
    const number = Number(value || 0);
    return `₦${number.toLocaleString()}`;
  };

  const formatChartMoney = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000) {
      return `₦${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `₦${(number / 1000).toFixed(0)}K`;
    }

    return `₦${number}`;
  };

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || user.role !== "admin") {
        navigate("/admin");
        return;
      }

      const token = localStorage.getItem("token");

if (!token) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/admin");
  return;
}

const res = await fetch(
  "https://api.fundednaira.net/api/admin/dashboard.php",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

if (res.status === 401 || res.status === 403) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/admin");
  return;
}

      const data = await res.json();

      if (!data.success) {
        console.error(data.message || "Failed to load dashboard");
        return;
      }

      const s = data.stats || {};

      setStats([
        {
          title: "Total Traders",
          value: s.total_traders || 0,
          icon: Users,
          type: "users",
        },
        {
          title: "Active Accounts",
          value: s.active_accounts || 0,
          icon: UserCheck,
          type: "active",
        },
        {
          title: "Total Payout",
          value: formatMoney(s.total_payout),
          icon: ArrowDownToLine,
          type: "payout",
        },
        {
          title: "Total Payments",
          value: formatMoney(s.total_payments),
          icon: CreditCard,
          type: "payments",
        },
        {
          title: "Payout This Month -20%",
          value: formatMoney(s.total_payout_this_month),
          icon: TrendingUp,
          type: "payout",
        },
        {
          title: "Payments This Month",
          value: formatMoney(s.total_payments_this_month),
          icon: Wallet,
          type: "payments",
        },
        {
          title: "Referral Withdrawals",
          value: formatMoney(s.total_referral_withdrawals),
          icon: Gift,
          type: "referral",
        },
        {
          title: "Referral Withdrawals Month",
          value: formatMoney(
            s.total_referral_withdrawals_this_month
          ),
          icon: Gift,
          type: "referral",
        },
        {
          title: "Account Plans",
          value: s.total_account_plans || 0,
          icon: Package,
          type: "plans",
        },
        {
          title: "Purchased Accounts",
          value: s.total_purchased_accounts || 0,
          icon: ShoppingBag,
          type: "accounts",
        },
        {
          title: "Referral Earned Accounts",
          value: s.total_ref_earned_accounts || 0,
          icon: UserPlus,
          type: "referral",
        },
      ]);

      setUsers(
        Array.isArray(data.recent_traders)
          ? data.recent_traders
          : []
      );

      /*
       * ANALYTICS
       *
       * Expected API structure:
       *
       * analytics: {
       *   monthly_payments: [
       *     { month: "Jan", amount: 500000 }
       *   ],
       *
       *   monthly_payouts: [
       *     { month: "Jan", amount: 200000 }
       *   ],
       *
       *   account_purchases: [
       *     { month: "Jan", count: 15 }
       *   ],
       *
       *   referral_withdrawals: [
       *     { month: "Jan", amount: 50000 }
       *   ],
       *
       *   most_purchased_accounts: [
       *     { plan: "10K Account", count: 30 }
       *   ]
       * }
       */

      const a = data.analytics || {};

      setAnalytics({
        monthly_payments: Array.isArray(a.monthly_payments)
          ? a.monthly_payments
          : [],

        monthly_payouts: Array.isArray(a.monthly_payouts)
          ? a.monthly_payouts
          : [],

        account_purchases: Array.isArray(a.account_purchases)
          ? a.account_purchases
          : [],

        referral_withdrawals: Array.isArray(
          a.referral_withdrawals
        )
          ? a.referral_withdrawals
          : [],

        most_purchased_accounts: Array.isArray(
          a.most_purchased_accounts
        )
          ? a.most_purchased_accounts
          : [],
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const iconStyles = {
    users: {
      wrapper: "bg-blue-500/10 border-blue-500/20",
      icon: "text-blue-400",
    },

    active: {
      wrapper: "bg-emerald-500/10 border-emerald-500/20",
      icon: "text-emerald-400",
    },

    payout: {
      wrapper: "bg-orange-500/10 border-orange-500/20",
      icon: "text-orange-400",
    },

    payments: {
      wrapper: "bg-cyan-500/10 border-cyan-500/20",
      icon: "text-cyan-400",
    },

    referral: {
      wrapper: "bg-purple-500/10 border-purple-500/20",
      icon: "text-purple-400",
    },

    plans: {
      wrapper: "bg-yellow-500/10 border-yellow-500/20",
      icon: "text-yellow-400",
    },

    accounts: {
      wrapper: "bg-pink-500/10 border-pink-500/20",
      icon: "text-pink-400",
    },
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "active") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (value === "pending") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    if (value === "completed" || value === "funded") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  /*
   * COMBINE MONTHLY DATA
   *
   * This allows payments, payouts, purchases and referral
   * withdrawals to appear on the same chart.
   */

  const monthlyChartData = [];

  const months = new Set();

  analytics.monthly_payments.forEach((item) =>
    months.add(item.month)
  );

  analytics.monthly_payouts.forEach((item) =>
    months.add(item.month)
  );

  analytics.account_purchases.forEach((item) =>
    months.add(item.month)
  );

  analytics.referral_withdrawals.forEach((item) =>
    months.add(item.month)
  );

  Array.from(months).forEach((month) => {
    const payment = analytics.monthly_payments.find(
      (item) => item.month === month
    );

    const payout = analytics.monthly_payouts.find(
      (item) => item.month === month
    );

    const purchase = analytics.account_purchases.find(
      (item) => item.month === month
    );

    const referral = analytics.referral_withdrawals.find(
      (item) => item.month === month
    );

    monthlyChartData.push({
      month,

      payments: Number(payment?.amount || 0),

      payouts: Number(payout?.amount || 0),

      purchases: Number(purchase?.count || 0),

      referrals: Number(referral?.amount || 0),
    });
  });

  /*
   * CUSTOM TOOLTIP
   */

  const MoneyTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-medium mb-2">{label}</p>

        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-6 text-xs mb-1"
          >
            <span className="text-gray-400">
              {item.name}
            </span>

            <span className="text-white font-medium">
              {formatMoney(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PurchaseTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const item = payload[0];

    return (
      <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-medium">
          {item.payload.plan}
        </p>

        <p className="text-gray-400 text-xs mt-1">
          Purchases:{" "}
          <span className="text-white">
            {item.value}
          </span>
        </p>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#05070D] text-white">

        <main className="p-4 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <Activity
                  size={18}
                  className="text-blue-400"
                />

                <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
                  Overview
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-1 text-sm">
                Monitor your FundedNaira platform and trading activity.
              </p>

            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-gray-300 disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>


          {/* SECURITY BANNER */}

          <div className="mb-7 rounded-2xl border border-blue-500/10 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                <ShieldCheck
                  size={20}
                  className="text-blue-400"
                />

              </div>

              <div>

                <p className="text-sm font-medium text-white">
                  Admin Control Center
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Platform statistics and account activity are monitored here.
                </p>

              </div>

            </div>

          </div>


          {/* STATS */}

          {loading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

              {[...Array(8)].map((_, i) => (

                <div
                  key={i}
                  className="h-32 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse"
                />

              ))}

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

              {stats.map((stat, index) => {

                const Icon = stat.icon;

                const style =
                  iconStyles[stat.type] ||
                  iconStyles.users;

                return (

                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-[#0B0F19] border border-white/[0.07] p-5 transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5"
                  >

                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition" />

                    <div className="relative">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-xs sm:text-sm text-gray-500">
                            {stat.title}
                          </p>

                          <h3 className="text-xl sm:text-2xl font-bold mt-2 text-white break-words">
                            {stat.value}
                          </h3>

                        </div>

                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center ${style.wrapper}`}
                        >

                          <Icon
                            size={20}
                            className={style.icon}
                          />

                        </div>

                      </div>

                      <div className="mt-4 flex items-center gap-1.5">

                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                        <span className="text-[11px] text-gray-600">
                          Live platform data
                        </span>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          )}


          {/* ========================= */}
          {/* ANALYTICS */}
          {/* ========================= */}

          <div className="space-y-6 mb-8">


            {/* PAYMENT / PAYOUT ANALYTICS */}

            <div className="rounded-2xl bg-[#0B0F19] border border-white/[0.07] p-5 sm:p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                <div>

                  <h2 className="text-lg font-semibold">
                    Financial Overview
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Monthly payments, payouts and referral withdrawals
                  </p>

                </div>

                <div className="text-xs text-gray-600">
                  Monthly
                </div>

              </div>


              <div className="h-[350px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={monthlyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >

                    <defs>

                      <linearGradient
                        id="paymentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#22d3ee"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="95%"
                          stopColor="#22d3ee"
                          stopOpacity={0}
                        />

                      </linearGradient>


                      <linearGradient
                        id="payoutGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#fb923c"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="95%"
                          stopColor="#fb923c"
                          stopOpacity={0}
                        />

                      </linearGradient>


                      <linearGradient
                        id="referralGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff08"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />

                    <YAxis
                      stroke="#6b7280"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      tickFormatter={formatChartMoney}
                    />

                    <Tooltip
                      content={<MoneyTooltip />}
                    />

                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    />


                    <Area
                      type="monotone"
                      dataKey="payments"
                      name="Payments"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fill="url(#paymentGradient)"
                    />


                    <Area
                      type="monotone"
                      dataKey="payouts"
                      name="Payouts"
                      stroke="#fb923c"
                      strokeWidth={2}
                      fill="url(#payoutGradient)"
                    />


                    <Area
                      type="monotone"
                      dataKey="referrals"
                      name="Referral Withdrawals"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fill="url(#referralGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>


            {/* ACCOUNT PURCHASES + MOST PURCHASED */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


              {/* ACCOUNT PURCHASES */}

              <div className="rounded-2xl bg-[#0B0F19] border border-white/[0.07] p-5 sm:p-6">

                <div className="mb-6">

                  <h2 className="text-lg font-semibold">
                    Account Purchases
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Number of accounts purchased each month
                  </p>

                </div>


                <div className="h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={analytics.account_purchases}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -10,
                        bottom: 0,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff08"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />

                      <YAxis
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0B0F19",
                          border: "1px solid #ffffff12",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                      <Bar
                        dataKey="count"
                        name="Purchased Accounts"
                        fill="#ec4899"
                        radius={[6, 6, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* MOST PURCHASED ACCOUNTS */}

              <div className="rounded-2xl bg-[#0B0F19] border border-white/[0.07] p-5 sm:p-6">

                <div className="mb-6">

                  <h2 className="text-lg font-semibold">
                    Most Purchased Accounts
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Best-selling account plans
                  </p>

                </div>


                <div className="h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={
                        analytics.most_purchased_accounts
                      }
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff08"
                        horizontal={false}
                      />

                      <XAxis
                        type="number"
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />

                      <YAxis
                        type="category"
                        dataKey="plan"
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        width={100}
                      />

                      <Tooltip
                        content={<PurchaseTooltip />}
                      />

                      <Bar
                        dataKey="count"
                        name="Purchases"
                        fill="#3b82f6"
                        radius={[0, 6, 6, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* RECENT TRADERS */}
          {/* ========================= */}

          <div className="rounded-2xl bg-[#0B0F19] border border-white/[0.07] overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-white/[0.07]">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>

                  <h2 className="text-lg font-semibold text-white">
                    Recent Traders
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Latest trader activity on the platform
                  </p>

                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">

                  <span className="w-2 h-2 rounded-full bg-emerald-400" />

                  Live

                </div>

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead>

                  <tr className="border-b border-white/[0.07] text-left">

                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-gray-500">
                      Trader
                    </th>

                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-gray-500">
                      Account
                    </th>

                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-gray-500">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {users.length > 0 ? (

                    users.map((user, i) => (

                      <tr
                        key={i}
                        className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.025] transition"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-sky-400/10 border border-blue-500/10 flex items-center justify-center text-sm font-semibold text-blue-300">

                              {String(
                                user.name || "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <p className="text-sm font-medium text-white">
                                {user.name || "Unknown"}
                              </p>

                              <p className="text-[11px] text-gray-600">
                                Trader #{i + 1}
                              </p>

                            </div>

                          </div>

                        </td>


                        <td className="px-6 py-4 text-sm text-gray-400">
                          {user.email || "—"}
                        </td>


                        <td className="px-6 py-4">

                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">

                            {user.account || "—"}

                          </span>

                        </td>


                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                              user.status
                            )}`}
                          >

                            <span className="w-1.5 h-1.5 rounded-full bg-current" />

                            {user.status || "Unknown"}

                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">

                            <Users
                              size={20}
                              className="text-gray-600"
                            />

                          </div>

                          <p className="text-sm text-gray-400">
                            No traders found
                          </p>

                          <p className="text-xs text-gray-600 mt-1">
                            New trader activity will appear here.
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;