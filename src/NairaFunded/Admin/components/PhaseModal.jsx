import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const PhaseModal = ({ data, onClose, onUpdated }) => {
  const [note, setNote] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [details, setDetails] = useState({
    login: "",
    password: "",
    server: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!data?.account_id) return;

      try {
        setLoadingDetails(true);

        const res = await fetch(
          `https://api.fundednaira.ng/api/admin/get-phase-request-account-details.php?account_id=${data.account_id}`
        );

        const text = await res.text();
        console.log("PHASE MODAL DETAILS RAW:", text);

        const result = JSON.parse(text);

        if (result.success) {
          setDetails({
            login: result.login || "",
            password: result.password || "",
            server: result.server || "",
          });
        } else {
          setDetails({
            login: "",
            password: "",
            server: "",
          });
        }
      } catch (error) {
        console.error("fetchDetails error:", error);
        setDetails({
          login: "",
          password: "",
          server: "",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [data]);

  const handleAction = async (action) => {
    try {
      setLoadingAction(true);

      const payload = {
        request_id: data.id,
        action, // approved or rejected
        admin_note: note,
      };

      console.log("PHASE ACTION PAYLOAD:", payload);

      const res = await fetch(
        "https://api.fundednaira.ng/api/admin/update-phase-request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      console.log("PHASE ACTION RAW:", text);

      const result = JSON.parse(text);

      if (result.success) {
        onUpdated(data.id, action, note);
        onClose();
      } else {
        alert(result.message || "Failed to update request");
      }
    } catch (error) {
      console.error("handleAction error:", error);
      alert("Server error");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Manage Phase Request</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">Trader Name</p>
            <p className="mt-1 font-semibold">{data.full_name || "N/A"}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">Email</p>
            <p className="mt-1 font-semibold">{data.email || "N/A"}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">Current Phase</p>
            <p className="mt-1 font-semibold">{data.current_phase || "N/A"}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">Requested Phase</p>
            <p className="mt-1 font-semibold">{data.requested_phase || "N/A"}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 md:col-span-2">
            <p className="text-sm text-gray-400 mb-3">Login Details</p>

            {loadingDetails ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Loading account details...
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  Login:{" "}
                  <span className="text-green-400">
                    {details.login || "Not assigned"}
                  </span>
                </p>
                <p>
                  Password:{" "}
                  <span className="text-green-400">
                    {details.password || "Not assigned"}
                  </span>
                </p>
                <p>
                  Server:{" "}
                  <span className="text-green-400">
                    {details.server || "Not assigned"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Admin note..."
          className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none mb-6"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={loadingAction}
            onClick={() => handleAction("approved")}
            className="rounded-xl bg-green-600 py-3 font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loadingAction ? "Please wait..." : "Approve"}
          </button>

          <button
            disabled={loadingAction}
            onClick={() => handleAction("rejected")}
            className="rounded-xl bg-red-600 py-3 font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loadingAction ? "Please wait..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhaseModal;
