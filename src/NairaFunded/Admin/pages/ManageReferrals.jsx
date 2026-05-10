import { useEffect, useState } from "react";
import AdminLayout from "../Layout";

const ManageReferrals = () => {
  const API_BASE = "https://api.fundednaira.ng/api/admin";

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/referral-withdrawals.php`
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.log(text);
        setError("Invalid server response");
        return;
      }

      if (!data.success) {
        setError(data.message);
        return;
      }

      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(
        `${API_BASE}/update-referral-withdrawal.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setMessage(data.message);

      setWithdrawals((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

      setShowModal(false);
    } catch {
      setError("Failed to update request");
    }
  };

  const totalPages = Math.ceil(
    withdrawals.length / limit
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = withdrawals.slice(start, end);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-950 min-h-screen text-white">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Manage Referrals
          </h1>

          <div className="text-sm text-gray-400">
            Total Requests: {withdrawals.length}
          </div>
        </div>

        {(message || error) && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              error
                ? "bg-red-500/10 border border-red-500 text-red-400"
                : "bg-green-500/10 border border-green-500 text-green-400"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-4 text-left">
                    User
                  </th>

                  <th className="p-4 text-left">
                    Bank
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-gray-400"
                    >
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  paginated.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-800"
                    >
                      <td className="p-4">
                        {item.user_name}
                      </td>

                      <td className="p-4">
                        {item.bank_name}
                      </td>

                      <td className="p-4 text-yellow-400 font-semibold">
                        ₦{item.amount}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            item.status === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {item.created_at}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelected(item);
                            setShowModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-center gap-3 mt-8">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-800 px-4 py-2 rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <div className="text-gray-400">
            Page {page} of {totalPages || 1}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-800 px-4 py-2 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* MODAL */}

        {showModal && selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-[95%] max-w-lg">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Withdrawal Details
                </h2>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm">

                <div>
                  <p className="text-gray-400">
                    User Name
                  </p>

                  <h3 className="font-semibold">
                    {selected.user_name}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">
                    Account Name
                  </p>

                  <h3 className="font-semibold">
                    {selected.account_name}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">
                    Account Number
                  </p>

                  <h3 className="font-semibold">
                    {selected.account_number}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">
                    Bank Name
                  </p>

                  <h3 className="font-semibold">
                    {selected.bank_name}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">
                    Amount
                  </p>

                  <h3 className="font-semibold text-yellow-400">
                    ₦{selected.amount}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">
                    Status
                  </p>

                  <h3 className="font-semibold">
                    {selected.status}
                  </h3>
                </div>
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3 mt-8">

                  <button
                    onClick={() =>
                      handleAction(
                        selected.id,
                        "paid"
                      )
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl"
                  >
                    Mark as Paid
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        selected.id,
                        "cancelled"
                      )
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageReferrals;