import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_accounts: 0,
    total_payout: "₦0",
    total_referrals: 0,
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatMoney = (value) => {
    const number = Number(value || 0);
    return `₦${number.toLocaleString()}`;
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!rawUser || !token) {
      navigate("/auth");
      return;
    }

    let savedUser = null;

    try {
      savedUser = JSON.parse(rawUser);
    } catch (error) {
      console.error("Invalid user in localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    if (!savedUser?.id) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    setUser(savedUser);

    fetch(
      `https://fundednaira.ng/api/dashboard/dashboard.php?user_id=${savedUser.id}`
    )
      .then((res) => res.text())
      .then((text) => {
        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON:", text);
          setLoading(false); // changed: do not redirect
          return;
        }

        if (!data.success) {
          console.error("Dashboard error:", data.message);
          setLoading(false); // changed: do not redirect
          return;
        }

        setStats({
          total_accounts: data.stats?.total_accounts || 0,
          total_payout: formatMoney(data.stats?.total_payout || 0),
          total_referrals: data.stats?.total_referrals || 0,
        });
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard fetch error:", error);
        setLoading(false); // changed: do not redirect
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-[#0B0F19] w-full max-w-md mx-auto text-white p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#111827] p-4 md:p-5 rounded-xl border border-gray-800 hover:border-blue-500 transition">
              <p className="text-gray-400 text-xs md:text-sm">Total Accounts</p>
              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2">
                {stats.total_accounts}
              </h2>
            </div>

            <div className="bg-[#111827] p-4 md:p-5 rounded-xl border border-gray-800 hover:border-green-500 transition">
              <p className="text-gray-400 text-xs md:text-sm">
                Total Payout
              </p>
              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-green-400">
                {stats.total_payout}
              </h2>
            </div>

            <div className="bg-[#111827] p-4 md:p-5 rounded-xl border border-gray-800 hover:border-purple-500 transition">
              <p className="text-gray-400 text-xs md:text-sm">
                Total Referrals
              </p>
              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2">
                {stats.total_referrals}
              </h2>
            </div>
          </div>

          <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-gray-800 overflow-x-auto">
            <h2 className="mb-4 font-semibold text-sm md:text-base">
              My Trading Accounts
            </h2>

            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 text-left">Account ID</th>
                  <th className="text-left">Login</th>
                  <th className="text-left">Server</th>
                  <th className="text-left">Phase</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((acc, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-3">{acc.id}</td>
                      <td>{acc.login || "Not Assigned"}</td>
                      <td>{acc.server || "Not Assigned"}</td>
                      <td>{acc.phase || "N/A"}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            String(acc.status).toLowerCase() === "active"
                              ? "bg-green-500/20 text-green-400"
                              : String(acc.status).toLowerCase() === "pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
