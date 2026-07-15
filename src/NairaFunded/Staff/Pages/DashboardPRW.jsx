import { Wallet, Users, AlertCircle } from "lucide-react";
import { useState,useEffect } from "react";
import StaffLayoutPR from "../Components/LayoutPR";

const DashboardPRW = () => {
  const [stats, setStats] = useState({
  pending_payouts: 0,
  pending_referral_withdrawals: 0,
});

const fetchDashboard = async () => {
  try {
    const res = await fetch(
      "https://api.fundednaira.net/api/Staff/pr_dashboard.php"
    );

    const data = await res.json();

    if (data.success) {
      setStats(data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchDashboard();
}, []);

  return (
    <StaffLayoutPR>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Payments Dashboard
            </h1>

            <p className="mt-2 text-gray-400">
              Monitor pending payout and referral withdrawal requests.
            </p>
          </div>

          {/* Main Cards */}
          <div className="grid gap-6 md:grid-cols-2">

            <div className="group rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 hover:border-blue-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Pending Payouts
                  </p>

                  <h2 className="mt-4 text-6xl font-bold">
                    {stats.pending_payouts}
                  </h2>

                  <p className="mt-3 text-sm text-yellow-400">
                    Awaiting review
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-600/20 p-4">
                  <Wallet size={36} className="text-blue-400" />
                </div>
              </div>
            </div>

            <div className="group rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 hover:border-purple-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Pending Referral Withdrawals
                  </p>

                  <h2 className="mt-4 text-6xl font-bold">
                    {stats.pending_referral_withdrawals}
                  </h2>

                  <p className="mt-3 text-sm text-yellow-400">
                    Awaiting review
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-600/20 p-4">
                  <Users size={36} className="text-purple-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Summary */}
          <div className="mt-8 rounded-3xl border border-gray-800 bg-gray-900/70 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-400" size={22} />

              <div>
                <h3 className="font-semibold">
                  Total Pending Actions
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {stats.pending_payouts +
                    stats.pending_referral_withdrawals}{" "}
                  requests require attention.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
   </StaffLayoutPR>
  );
};

export default DashboardPRW;