import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import FeedbackModal from "../components/FeedbackModal";

const Feedback = () => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const perPage = 10;

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.ng/api/admin/get-feedbacks.php"
      );

      const text = await res.text();
      let data = [];

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON:", text);
        data = [];
      }

      const finalData = Array.isArray(data) ? data : [];
      setFeedbacks(finalData);

      // Reset page if current page becomes invalid
      setCurrentPage(1);
    } catch (error) {
      console.error("fetchFeedbacks error:", error);
      setFeedbacks([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const totalPages = Math.ceil(feedbacks.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = feedbacks.slice(indexOfFirst, indexOfLast);

  return (
    <AdminLayout>
      <div className="p-6 text-white min-h-screen bg-gray-950">
        <h2 className="text-2xl font-bold mb-6">User Feedback</h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Rating</th>
                  <th className="text-left px-4 py-3">Message</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      Loading feedback...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-gray-800 hover:bg-gray-800/60"
                    >
                      <td className="px-4 py-3">{f.name}</td>
                      <td className="px-4 py-3">{f.email}</td>
                      <td className="px-4 py-3">{f.type}</td>
                      <td className="px-4 py-3">{f.rating}/5</td>
                      <td className="px-4 py-3 max-w-[250px] truncate">{f.message}</td>
                      <td className="px-4 py-3">{f.created_at}</td>
                      <td className="text-right px-4 py-3">
                        <button
                          onClick={() => setSelectedFeedback(f)}
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
                      No feedback found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 gap-4 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Prev
            </button>

            <div className="flex gap-2 flex-wrap">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        )}

        <FeedbackModal
          feedback={selectedFeedback}
          setFeedback={setSelectedFeedback}
        />
      </div>
    </AdminLayout>
  );
};

export default Feedback;