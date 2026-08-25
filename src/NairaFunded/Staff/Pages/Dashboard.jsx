import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  CheckCircle,
  Clock3,
  Database,
  Plus,
  RefreshCw,
  Upload,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import StaffLayout from "../Components/Layout";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    uploaded_this_month: 0,
    available_accounts: 0,
    given_accounts: 0,
    total_accounts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const staff = JSON.parse(
    localStorage.getItem("staff") || "null"
  );

  const staffName =
    staff?.name ||
    staff?.full_name ||
    "Staff";

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("staff_token");

      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/dashboard.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        console.error(
          data.message || "Failed to load dashboard"
        );
        return;
      }

      setStats({
        uploaded_this_month:
          data.uploaded_this_month || 0,

        available_accounts:
          data.available_accounts || 0,

        given_accounts:
          data.given_accounts || 0,

        total_accounts:
          data.total_accounts || 0,
      });

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
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
      title: "Uploaded This Month",
      value: stats.uploaded_this_month,
      description: "Accounts uploaded this month",
      icon: Upload,
      iconBg:
        "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Available Accounts",
      value: stats.available_accounts,
      description: "Ready to be assigned",
      icon: CheckCircle,
      iconBg:
        "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Given Accounts",
      value: stats.given_accounts,
      description: "Already assigned accounts",
      icon: Clock3,
      iconBg:
        "bg-orange-500/10 border-orange-500/20",
      iconColor: "text-orange-400",
    },
    {
      title: "Total Accounts",
      value: stats.total_accounts,
      description: "All uploaded accounts",
      icon: Database,
      iconBg:
        "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <StaffLayout>

      <div className="min-h-screen bg-[#05070D] text-white">

        <div className="mx-auto max-w-7xl">

          {/* ================= HEADER ================= */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <Activity
                  size={16}
                  className="text-blue-400"
                />

                <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                  Staff Overview
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor your account upload activity
                and inventory.
              </p>

            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="
                flex items-center justify-center gap-2
                rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4 py-2.5
                text-sm text-gray-300
                transition
                hover:bg-white/[0.06]
                disabled:opacity-50
              "
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


          {/* ================= WELCOME ================= */}

          <div
            className="
              relative mb-7 overflow-hidden
              rounded-2xl
              border border-blue-500/10
              bg-gradient-to-r
              from-blue-500/[0.09]
              via-blue-500/[0.03]
              to-transparent
              p-5 sm:p-6
            "
          >

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-blue-500/20
                  bg-blue-500/10
                "
              >

                <ShieldCheck
                  size={23}
                  className="text-blue-400"
                />

              </div>

              <div>

                <h2 className="text-base font-semibold sm:text-lg">
                  Welcome back, {staffName} 👋
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Manage and upload trading accounts
                  from your staff workspace.
                </p>

              </div>

            </div>

          </div>


          {/* ================= STATS ================= */}

          {loading ? (

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (

                <div
                  key={item}
                  className="
                    h-36
                    animate-pulse
                    rounded-2xl
                    border border-white/[0.05]
                    bg-white/[0.025]
                  "
                />

              ))}

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {cards.map((card) => {

                const Icon = card.icon;

                return (

                  <div
                    key={card.title}
                    className="
                      group relative overflow-hidden
                      rounded-2xl
                      border border-white/[0.07]
                      bg-[#0B0F19]
                      p-5
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-white/[0.13]
                    "
                  >

                    {/* Glow */}

                    <div className="
                      absolute -right-8 -top-8
                      h-24 w-24
                      rounded-full
                      bg-blue-500/5
                      blur-2xl
                      opacity-0
                      transition
                      group-hover:opacity-100
                    " />

                    <div className="relative">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-xs text-gray-500 sm:text-sm">
                            {card.title}
                          </p>

                          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                            {Number(
                              card.value || 0
                            ).toLocaleString()}
                          </h3>

                        </div>

                        <div
                          className={`
                            flex h-11 w-11
                            items-center justify-center
                            rounded-xl border
                            ${card.iconBg}
                          `}
                        >

                          <Icon
                            size={20}
                            className={card.iconColor}
                          />

                        </div>

                      </div>

                      <div className="mt-5 flex items-center gap-2">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        <span className="text-[11px] text-gray-600">
                          {card.description}
                        </span>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          )}


          {/* ================= QUICK ACTIONS ================= */}

          <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Upload */}

            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-white/[0.07]
                bg-[#0B0F19]
                p-6
                xl:col-span-2
              "
            >

              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                <div>

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">

                    <Upload
                      size={19}
                      className="text-blue-400"
                    />

                  </div>

                  <h3 className="text-lg font-semibold">
                    Upload Trading Accounts
                  </h3>

                  <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
                    Add new trading accounts to the
                    platform inventory so they can be
                    assigned to traders.
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/staff/upload-account"
                    )
                  }
                  className="
                    flex shrink-0
                    items-center justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-blue-500
                  "
                >

                  <Plus size={18} />

                  Upload Account

                  <ArrowUpRight size={16} />

                </button>

              </div>

            </div>


            {/* Status */}

            <div
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-[#0B0F19]
                p-6
              "
            >

              <p className="text-xs uppercase tracking-widest text-gray-600">
                Workspace Status
              </p>

              <div className="mt-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">

                  <CheckCircle
                    size={19}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    System Operational
                  </p>

                  <p className="mt-0.5 text-xs text-gray-600">
                    Staff services are running normally
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= RECENT ACTIVITY ================= */}

          <div
            className="
              mt-6 overflow-hidden
              rounded-2xl
              border border-white/[0.07]
              bg-[#0B0F19]
            "
          >

            <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Latest account upload activity
                  </p>

                </div>

                <Activity
                  size={18}
                  className="text-gray-600"
                />

              </div>

            </div>


            <div className="px-5 py-10 text-center sm:px-6">

              <div className="
                mx-auto mb-3
                flex h-12 w-12
                items-center justify-center
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
              ">

                <Database
                  size={20}
                  className="text-gray-600"
                />

              </div>

              <p className="text-sm text-gray-400">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Newly uploaded accounts will appear
                here.
              </p>

            </div>

          </div>

        </div>

      </div>

    </StaffLayout>
  );
};

export default StaffDashboard;