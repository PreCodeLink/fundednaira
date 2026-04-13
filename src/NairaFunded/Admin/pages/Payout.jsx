import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import PayoutModal from "../components/PayOutModal";

const Payouts = () => {
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const perPage = 10;

  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://fundednaira.ng/api/admin/get-payout-requests.php"
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setPayouts(data);
      } else {
        setPayouts([]);
      }
    } catch (error) {
      console.error("fetchPayouts error:", error);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = payouts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(payouts.length / perPage);

  const updatePayout = (id, updates) => {
    const updated = payouts.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    setPayouts(updated);
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 text-white min-h-screen bg-gray-950">
        <h2 className="text-2xl font-bold mb-6">Payout Requests</h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-gray-400 border-b border-gray-800 bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="text-left">Bank</th>
                  <th className="text-left">Account No.</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                  <th className="text-right px-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      Loading payout requests...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-800 hover:bg-gray-800/60"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{p.user}</p>
                          <p className="text-xs text-gray-400">{p.email}</p>
                        </div>
                      </td>

                      <td>{p.bank_name || "N/A"}</td>
                      <td>{p.account_number || "N/A"}</td>
                      <td>{p.amount}</td>
                      <td>{p.date}</td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            p.status === "Paid"
                              ? "bg-green-500/20 text-green-400"
                              : p.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="text-right px-4">
                        <button
                          onClick={() => setSelected(p)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      No payout requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-800 rounded-lg"
            >
              Prev
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600" : "bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              className="px-4 py-2 bg-gray-800 rounded-lg"
            >
              Next
            </button>
          </div>
        )}
 
        <PayoutModal
          payout={selected}
          setPayout={setSelected}
          updatePayout={updatePayout}
        />
      </div>
    </AdminLayout>
  );
};

export default Payouts;