import {
  Wallet,
  Users,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import StaffLayoutPR from "../Components/LayoutPR";

const DashboardPRW = () => {
  const [stats, setStats] = useState({
    pending_payouts: 0,
    pending_referral_withdrawals: 0,
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
        "https://api.fundednaira.net/api/Staff/pr_dashboard.php"
      );

      const data = await res.json();

      if (data.success) {
        setStats({
          pending_payouts: Number(data.pending_payouts || 0),
          pending_referral_withdrawals: Number(
            data.pending_referral_withdrawals || 0
          ),
        });
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalPending =
    stats.pending_payouts +
    stats.pending_referral_withdrawals;

  return (
    <StaffLayoutPR>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium text-blue-400">
                PAYMENT MANAGEMENT
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Payments Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Monitor and manage pending payout and referral withdrawal requests.
              </p>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-2xl border border-gray-800 bg-gray-900"
                />
              ))}

            </div>
          ) : (
            <>
              {/* Main Cards */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* Payout Card */}
                <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-800/80">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-400">
                        Pending Payouts
                      </p>

                      <h2 className="mt-4 text-4xl font-bold tracking-tight">
                        {stats.pending_payouts.toLocaleString()}
                      </h2>

                      <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        Awaiting review
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
                      <Wallet size={28} />
                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                    <span className="text-xs text-gray-500">
                      Payout management
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="text-gray-500 transition group-hover:text-blue-400"
                    />
                  </div>

                </div>

                {/* Referral Card */}
                <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-gray-800/80">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-400">
                        Pending Referral Withdrawals
                      </p>

                      <h2 className="mt-4 text-4xl font-bold tracking-tight">
                        {stats.pending_referral_withdrawals.toLocaleString()}
                      </h2>

                      <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        Awaiting review
                      </div>
                    </div>

                    <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-400">
                      <Users size={28} />
                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                    <span className="text-xs text-gray-500">
                      Referral management
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="text-gray-500 transition group-hover:text-purple-400"
                    />
                  </div>

                </div>

              </div>

              {/* Total Pending */}
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-gray-900 to-yellow-950/10 p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-yellow-500/10 p-3">
                      <AlertCircle
                        size={22}
                        className="text-yellow-400"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Total Pending Actions
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Requests currently requiring staff attention.
                      </p>
                    </div>

                  </div>

                  <div className="sm:text-right">
                    <p className="text-3xl font-bold text-yellow-400">
                      {totalPending.toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      Pending requests
                    </p>
                  </div>

                </div>

              </div>

              {/* Quick Summary */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Payout Queue
                    </span>

                    <Wallet
                      size={18}
                      className="text-blue-400"
                    />
                  </div>

                  <p className="mt-3 text-xl font-semibold">
                    {stats.pending_payouts}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Pending payout requests
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Referral Queue
                    </span>

                    <Users
                      size={18}
                      className="text-purple-400"
                    />
                  </div>

                  <p className="mt-3 text-xl font-semibold">
                    {stats.pending_referral_withdrawals}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Pending referral withdrawals
                  </p>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </StaffLayoutPR>
  );
};

export default DashboardPRW;