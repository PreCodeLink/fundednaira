import { useEffect, useState } from "react";
import {
  FileText,
  Clock3,
  CheckCircle,
  XCircle,
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

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/Staff/mp2_dashboard.php"
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
      title: "Total Requests",
      value: stats.total_requests,
      icon: FileText,
      color: "bg-blue-600",
    },
    {
      title: "Pending Requests",
      value: stats.pending_requests,
      icon: Clock3,
      color: "bg-yellow-600",
    },
    {
      title: "Approved Requests",
      value: stats.approved_requests,
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      title: "Rejected Requests",
      value: stats.rejected_requests,
      icon: XCircle,
      color: "bg-red-600",
    },
  ];

  return (
    <MPLayout>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <div className="mx-auto max-w-7xl p-6">

          <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Phase Manager Dashboard
            </h2>

            <p className="mt-2 text-gray-400">
              Manage phase requests submitted by users.
            </p>
          </div>

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

          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-lg font-semibold mb-3">
              Phase Request Management Phase 2
            </h3>

            <p className="text-gray-400">
              Review, approve and reject user phase requests.
            </p>
          </div>
        </div>
      </div>
    </MPLayout>
  );
};

export default MPDashboard;