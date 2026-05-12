import { useEffect, useState } from "react";
import AdminLayout from "../Layout";

const ReferralClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const API =
    "https://api.fundednaira.ng/api/admin/claim-referral-account.php";

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await fetch(API);

      const data = await res.json();

      if (data.success) {
        setClaims(data.claims || []);
      }

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "claimed":
        return "bg-green-500/20 text-green-400 border-green-500/30";

      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <AdminLayout>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-950 text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Referral Claims
            </h1>

            <p className="text-gray-400 mt-2">
              Manage affiliate reward account claims
            </p>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-3 rounded-2xl">
            Total Claims: {claims.length}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            Loading claims...
          </div>
        ) : claims.length === 0 ? (

          /* EMPTY */
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            No referral claims found
          </div>

        ) : (

          /* TABLE */
          <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-3xl">

            <table className="w-full min-w-[1200px]">

              <thead className="border-b border-gray-800 bg-gray-900">
                <tr className="text-left">

                  <th className="p-5 text-gray-400 font-medium">
                    User
                  </th>

                  <th className="p-5 text-gray-400 font-medium">
                    Email
                  </th>

                  <th className="p-5 text-gray-400 font-medium">
                    Referrals
                  </th>

                  <th className="p-5 text-gray-400 font-medium">
                    Login
                  </th>

                  <th className="p-5 text-gray-400 font-medium">
                    Server
                  </th>
                   <th className="p-5 text-gray-400 font-medium">
  Account Size
</th>
                  <th className="p-5 text-gray-400 font-medium">
                    Status
                  </th>

                  <th className="p-5 text-gray-400 font-medium">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {claims.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                  >

                    {/* USER */}
                    <td className="p-5">
                      <div className="font-semibold">
                        {item.name}
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="p-5 text-gray-300">
                      {item.email}
                    </td>

                    {/* REFERRALS */}
                    <td className="p-5">
                      <div className="inline-flex px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                        {item.total_referrals}
                      </div>
                    </td>

                    {/* LOGIN */}
                    <td className="p-5">
                      {item.account_login || (
                        <span className="text-yellow-400">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* SERVER */}
                    <td className="p-5 text-gray-300">
                      {item.server || "-"}
                    </td>
    <td className="p-5">
  <div className="inline-flex px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
    {item.size}
  </div>
</td>
                    {/* STATUS */}
                    <td className="p-5">
                      <div
                        className={`inline-flex px-4 py-2 rounded-xl border text-sm font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="p-5 text-gray-400">
                      {item.created_at}
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default ReferralClaims;
