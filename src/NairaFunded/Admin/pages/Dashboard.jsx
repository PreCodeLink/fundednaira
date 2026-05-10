import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { title: "Total Traders", value: "0" },
    { title: "Active Accounts", value: "0" },
    { title: "Total Payout", value: "₦0" },
    { title: "Total Payments", value: "₦0" },
    { title: "Total Payout This Month", value: "₦0" },
    { title: "Total Payments This Month", value: "₦0" },
    { title: "Referral Withdrawals", value: "₦0" },
    { title: "Referral Withdrawals This Month", value: "₦0" },
    { title: "Total Account Plans", value: "0" },
    { title: "Total Purchased Accounts", value: "0" },
  ]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatMoney = (value) => {
    const number = Number(value || 0);
    return `₦${number.toLocaleString()}`;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/admin");
      return;
    }

    fetch("https://api.fundednaira.ng/api/admin/dashboard.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.message || "Failed to load dashboard");
          setLoading(false);
          return;
        }

        setStats([
          {
            title: "Total Traders",
            value: data.stats.total_traders || 0,
          },

          {
            title: "Active Accounts",
            value: data.stats.active_accounts || 0,
          },

          {
            title: "Total Payout",
            value: formatMoney(data.stats.total_payout),
          },

          {
            title: "Total Payments",
            value: formatMoney(data.stats.total_payments),
          },

          {
            title: "Total Payout This Month",
            value: formatMoney(
              data.stats.total_payout_this_month
            ),
          },

          {
            title: "Total Payments This Month",
            value: formatMoney(
              data.stats.total_payments_this_month
            ),
          },

          {
            title: "Referral Withdrawals",
            value: formatMoney(
              data.stats.total_referral_withdrawals
            ),
          },

          {
            title: "Referral Withdrawals This Month",
            value: formatMoney(
              data.stats.total_referral_withdrawals_this_month
            ),
          },

          {
            title: "Total Account Plans",
            value: data.stats.total_account_plans || 0,
          },

          {
            title: "Total Purchased Accounts",
            value:
              data.stats.total_purchased_accounts || 0,
          },
        ]);

        setUsers(
          Array.isArray(data.recent_traders)
            ? data.recent_traders
            : []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col">
        <main className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Admin Dashboard
          </h2>

          {loading ? (
            <div className="text-gray-400">
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow"
                  >
                    <p className="text-gray-400 text-sm">
                      {stat.title}
                    </p>

                    <h3 className="text-2xl font-bold mt-2 text-white break-words">
                      {stat.value}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Recent Traders
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="text-gray-400 border-b border-gray-800">
                      <tr>
                        <th className="text-left py-2">
                          Name
                        </th>

                        <th className="text-left py-2">
                          Email
                        </th>

                        <th className="text-left py-2">
                          Account
                        </th>

                        <th className="text-left py-2">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-800 text-white"
                          >
                            <td className="py-3">
                              {user.name}
                            </td>

                            <td>{user.email}</td>

                            <td>{user.account}</td>

                            <td>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  String(
                                    user.status
                                  ).toLowerCase() ===
                                  "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : String(
                                        user.status
                                      ).toLowerCase() ===
                                      "pending"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-6 text-center text-gray-400"
                          >
                            No traders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;