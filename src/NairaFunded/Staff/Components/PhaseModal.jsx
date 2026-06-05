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
  account_size: "",
});

  /*
  |--------------------------------------------------------------------------
  | Fetch Current Account Details
  |--------------------------------------------------------------------------
  */

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
    account_size: result.account_size || "",
  })}else {
          setDetails({
            login: "",
            password: "",
            server: "",
            account_size: "",
          });
        }
      } catch (error) {
        console.error("fetchDetails error:", error);

        setDetails({
          login: "",
          password: "",
          server: "",
          account_size: "",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [data]);

  /*
  |--------------------------------------------------------------------------
  | Approve / Reject Action
  |--------------------------------------------------------------------------
  */

  const handleAction = async (action) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      if (action === "approved") {
        if (
          !details.login ||
          !details.password ||
          !details.server
        ) {
          alert("Please provide login, password and server.");
          return;
        }
      }

      setLoadingAction(true);

      const payload = {
        request_id: data.id,
        action,
        admin_note: note,

        login: details.login,
        password: details.password,
        server: details.server,
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
<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md overflow-y-auto">

  <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4">

    <div
      className="
        relative
        w-full
        h-auto
        min-h-[95vh]
        sm:min-h-0
        sm:max-w-3xl
        rounded-2xl
        border
        border-gray-700
        bg-gradient-to-br
        from-gray-900
        to-gray-800
        p-4
        sm:p-6
        text-white
        shadow-2xl
      "
    >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6">
          Manage Phase Request
        </h2>

        {/* USER DETAILS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          {/* Trader */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Trader Name
            </p>

            <p className="mt-1 font-semibold">
              {data.full_name || "N/A"}
            </p>
          </div>

          {/* Email */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Email
            </p>

            <p className="mt-1 font-semibold break-all">
              {data.email || "N/A"}
            </p>
          </div>

          {/* Current Phase */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Current Phase
            </p>

            <p className="mt-1 font-semibold">
              {data.current_phase || "N/A"}
            </p>
          </div>

          {/* Requested Phase */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Requested Phase
            </p>

            <p className="mt-1 font-semibold">
              {data.requested_phase || "N/A"}
            </p>
          </div>

          {/* Account ID */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Account ID
            </p>

            <p className="mt-1 font-semibold">
              {data.account_id || "N/A"}
            </p>
          </div>
                   {/* Account Size */}
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              Account Size
            </p>

            <p className="mt-1 font-semibold">
              {details.account_size || "N/A"}
            </p>
          </div>
          {/* LOGIN DETAILS */}
          <div className="bg-gray-800 rounded-xl p-4 md:col-span-2">
            <p className="text-sm text-gray-400 mb-4">
              Trading Account Details
            </p>

            {loadingDetails ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Loading account details...
              </div>
            ) : (
              <div className="space-y-4">

                {/* LOGIN */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Login
                  </label>

                  <input
                    type="text"
                    value={details.login}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        login: e.target.value,
                      })
                    }
                    placeholder="Enter MT5 login"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Password
                  </label>

                  <input
                    type="text"
                    value={details.password}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter MT5 password"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* SERVER */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Server
                  </label>

                  <input
                    type="text"
                    value={details.server}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        server: e.target.value,
                      })
                    }
                    placeholder="Enter MT5 server"
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ADMIN NOTE */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Admin note..."
          rows={4}
          className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none mb-6 focus:border-blue-500"
        />

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3">

          {/* APPROVE */}
          <button
            disabled={loadingAction}
            onClick={() => handleAction("approved")}
            className="rounded-xl bg-green-600 py-3 font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loadingAction ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Please wait...
              </span>
            ) : (
              "Approve"
            )}
          </button>

          {/* REJECT */}
          <button
            disabled={loadingAction}
            onClick={() => handleAction("rejected")}
            className="rounded-xl bg-red-600 py-3 font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {loadingAction ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Please wait...
              </span>
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  
    </div>
  );
};

export default PhaseModal;
