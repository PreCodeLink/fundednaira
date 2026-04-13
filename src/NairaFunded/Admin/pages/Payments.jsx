import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";

const Payments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const perPage = 10;

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";

    const number = Number(value);
    if (Number.isNaN(number)) return `₦${value}`;

    return `₦${number.toLocaleString()}`;
  };

  const formatStatus = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "success") return "Successful";
    if (s === "pending") return "Pending";
    if (s === "failed") return "Failed";

    return status || "Unknown";
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://fundednaira.ng/api/admin/get-payments.php");
      const text = await res.text();
      console.log("payments raw response:", text);

      let data = [];
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("payments parse error:", error);
        data = [];
      }

      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchPayments error:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = payments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(payments.length / perPage);

  return (
    <AdminLayout>
      <div className="p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Transactions</h2>

          <p className="text-sm text-gray-400">Powered by Squad</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[950px]">
              <thead className="text-gray-400 border-b border-gray-800 bg-gray-950/40">
                <tr>
                  <th className="text-left px-4 py-3">Ref</th>
                  <th className="text-left">User</th>
                  <th className="text-left">Plan</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Gateway</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      Loading transactions...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-800 hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3 font-mono text-blue-400">
                        {p.reference}
                      </td>

                      <td>
                        <div>
                          <p className="font-medium">{p.user}</p>
                          <p className="text-xs text-gray-400">{p.email}</p>
                        </div>
                      </td>

                      <td>
                        <div>
                          <p>{p.plan_type || "N/A"}</p>
                          <p className="text-xs text-gray-400">
                            {p.plan_size ? `₦${Number(p.plan_size).toLocaleString()}` : "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="font-semibold">{formatMoney(p.amount)}</td>
                      <td className="capitalize text-gray-300">{p.gateway}</td>
                      <td className="text-gray-400">{p.date}</td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            String(p.status).toLowerCase() === "success"
                              ? "bg-green-500/20 text-green-400"
                              : String(p.status).toLowerCase() === "pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {formatStatus(p.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              Prev
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Payments;