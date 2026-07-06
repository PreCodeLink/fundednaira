import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  CheckCircle,
  Clock3,
  Database,
  LogOut,
  Plus,
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

  const logout = () => {
    localStorage.removeItem("staff");
    localStorage.removeItem("staff_token");
    navigate("/auth/staff");
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/dashboard.php"
      );

      const data = await res.json();

      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Uploaded This Month",
      value: stats.uploaded_this_month,
      icon: Wallet,
      color: "bg-blue-600",
    },
    {
      title: "Available Accounts",
      value: stats.available_accounts,
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      title: "Given Accounts",
      value: stats.given_accounts,
      icon: Clock3,
      color: "bg-red-600",
    },
    {
      title: "Total Accounts",
      value: stats.total_accounts,
      icon: Database,
      color: "bg-purple-600",
    },
  ];

  return (
    <StaffLayout>
        <div className="min-h-screen bg-[#0B0F19] text-white">
     

      <div className="mx-auto max-w-7xl p-6">
        {/* Welcome */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-gray-400">
            Manage and upload trading accounts from
            your staff dashboard.
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div>Loading dashboard...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">
                        {card.title}
                      </p>

                      <h3 className="mt-3 text-4xl font-bold">
                        {card.value}
                      </h3>
                    </div>

                    <div
                      className={`${card.color} rounded-xl p-3`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Quick Actions
          </h3>

          <button
            onClick={() =>
              navigate("/staff/upload-account")
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            <Plus size={18} />
            Upload Trading Account
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Recent Activity
          </h3>

          <p className="text-gray-400">
            Latest uploaded trading accounts will
            appear here.
          </p>
        </div>
      </div>
    </div>
    </StaffLayout>
  );
};

export default StaffDashboard;