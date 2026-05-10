import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import PhaseModal from "../components/PhaseModal";
import AdminLayout from "../Layout";

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();

  if (value === "approved") {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
        Approved
      </span>
    );
  }

  if (value === "rejected") {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
        Rejected
      </span>
    );
  }

  if (value === "suspended") {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
        Suspended
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
      Pending
    </span>
  );
};

const PhaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.ng/api/admin/get-phase-requests.php"
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setRequests(data);
        setFilteredRequests(data);
      } else {
        setRequests([]);
        setFilteredRequests([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error("fetchRequests error:", error);
      setRequests([]);
      setFilteredRequests([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = requests.filter((item) => {
      return (
        String(item.full_name || "").toLowerCase().includes(keyword) ||
        String(item.email || "").toLowerCase().includes(keyword) ||
        String(item.status || "").toLowerCase().includes(keyword) ||
        String(item.current_phase || "").toLowerCase().includes(keyword) ||
        String(item.requested_phase || "").toLowerCase().includes(keyword)
      );
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [search, requests]);

  const handleUpdated = (id, status, note) => {
    const updatedRequests = requests.map((item) =>
      item.id === id ? { ...item, status, admin_note: note } : item
    );

    setRequests(updatedRequests);

    const keyword = search.toLowerCase();
    const filtered = updatedRequests.filter((item) => {
      return (
        String(item.full_name || "").toLowerCase().includes(keyword) ||
        String(item.email || "").toLowerCase().includes(keyword) ||
        String(item.status || "").toLowerCase().includes(keyword) ||
        String(item.current_phase || "").toLowerCase().includes(keyword) ||
        String(item.requested_phase || "").toLowerCase().includes(keyword)
      );
    });

    setFilteredRequests(filtered);
    setSelectedRequest(null);
  };

  const totalPages = Math.ceil(filteredRequests.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredRequests.slice(indexOfFirst, indexOfLast);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-950 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Phase Requests</h1>
            <p className="text-gray-400 mt-2">
              View full login details and manage trader phase requests.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-800/70">
              <tr className="text-left text-sm text-gray-300">
                <th className="px-6 py-4">Trader</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Phase</th>
                <th className="px-6 py-4">Requested Phase</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    Loading phase requests...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-800 text-sm hover:bg-gray-800/40"
                  >
                    <td className="px-6 py-4 font-medium">{item.full_name}</td>
                    <td className="px-6 py-4 text-gray-300">{item.email}</td>
                    <td className="px-6 py-4 text-gray-300">{item.current_phase}</td>
                    <td className="px-6 py-4 text-gray-300">{item.requested_phase}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-300">{item.created_at}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRequest(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                      >
                        <Eye size={16} />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No phase requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {totalPages > 0 && (
  <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
    
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
      disabled={currentPage === 1}
    >
      Prev
    </button>

    <div className="flex items-center gap-2 flex-wrap justify-center">
      {Array.from(
        { length: Math.min(totalPages, 5) },
        (_, i) => {
          let pageNumber;

          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          );
        }
      )}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <span className="text-gray-500 px-1">...</span>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className="w-10 h-10 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

        {selectedRequest && (
          <PhaseModal
            data={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onUpdated={handleUpdated}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PhaseRequests;