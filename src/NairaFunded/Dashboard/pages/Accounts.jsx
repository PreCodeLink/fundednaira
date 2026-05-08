import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import TopSection from "../companent/TopSection";

const AccountDetailsModal = ({
  isOpen,
  onClose,
  account,
  requestPhase,
  loadingRequest,
}) => {
  if (!isOpen || !account) return null;

  const currentPhase = String(account.phase || "").toLowerCase();

  const canRequestPhase =
    String(account.status || "").toLowerCase() === "active" &&
    !currentPhase.includes("funded");

  const nextPhase = currentPhase.includes("1")
    ? "2"
    : currentPhase.includes("2")
    ? "funded"
    : "";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-800 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Account Details</h2>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-400">
            Type: <span className="text-white">{account.type || "N/A"}</span>
          </p>

          <p className="text-gray-400">
            Balance:{" "}
            <span className="text-white">
              {account.balance || "₦0"}
            </span>
          </p>

          <p className="text-gray-400">
            Equity:{" "}
            <span className="text-white">
              {account.equity || "₦0"}
            </span>
          </p>

          <p className="text-gray-400">
            Phase:{" "}
            <span className="text-white capitalize">
              {account.phase}
            </span>
          </p>

          <p className="text-gray-400">
            Status:{" "}
            <span className="text-white capitalize">
              {account.status}
            </span>
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-5">
          <h3 className="text-sm text-gray-400 mb-3">
            MT5 Login Details
          </h3>

          <p className="text-sm">
            Login:{" "}
            <span className="text-green-400">
              {account.login || "Not assigned"}
            </span>
          </p>

          <p className="text-sm">
            Password:{" "}
            <span className="text-green-400">
              {account.password || "Not assigned"}
            </span>
          </p>

          <p className="text-sm">
            Server:{" "}
            <span className="text-green-400">
              {account.server || "Not assigned"}
            </span>
          </p>
        </div>

        {canRequestPhase ? (
          <button
            onClick={() => requestPhase(account, nextPhase)}
            disabled={loadingRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-medium"
          >
            {loadingRequest
              ? "Submitting..."
              : `Request Phase ${nextPhase}`}
          </button>
        ) : (
          <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
            {currentPhase.includes("funded")
              ? "This account is already funded."
              : "Only active accounts can request the next phase."}
          </div>
        )}
      </div>
    </div>
  );
};

const PlanCard = ({
  plan,
  formatMoney,
  buttonColor = "blue",
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const buttonClass =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const badgeClass =
    buttonColor === "green"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-blue-500/20 text-blue-400 border border-blue-500/30";

  const isLoading = Number(buyingPlanId) === Number(plan.id);

  return (
    <div
      className={`relative bg-gray-900 border border-gray-800 rounded-2xl p-6 transition hover:-translate-y-1 ${
        buttonColor === "green"
          ? "hover:border-green-500"
          : "hover:border-blue-500"
      } ${plan.popular ? "scale-[1.02]" : ""}`}
    >
      {plan.popular && (
        <div className="absolute top-[-10px] right-4 bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {formatMoney(plan.size)} Account
        </h3>

        <span className={`text-xs px-3 py-1 rounded-full ${badgeClass}`}>
          {plan.type}
        </span>
      </div>

      <p className="mt-2 text-3xl font-bold">
        {formatMoney(plan.price)}
      </p>

      <ul className="mt-6 space-y-3 text-gray-400 text-sm">
        <li className="flex justify-between">
          <span>Profit Target</span>
          <span className="text-white font-medium">
            {plan.target}%
          </span>
        </li>

        <li className="flex justify-between">
          <span>Max Loss</span>
          <span className="text-white font-medium">
            {plan.loss}%
          </span>
        </li>

        <li className="flex justify-between">
          <span>Profit Split</span>
          <span className="text-white font-medium">
            {plan.split}%
          </span>
        </li>

        <li className="flex justify-between">
          <span>Type</span>
          <span className="text-white font-medium">
            {plan.type}
          </span>
        </li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-8 w-full py-3 rounded-xl transition text-white font-medium disabled:opacity-50 ${buttonClass}`}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
};

const Accounts = () => {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text });

    setTimeout(() => {
      setMessage({
        show: false,
        type: "",
        text: "",
      });
    }, 3000);
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "₦0";
    }

    const clean = String(value).replace(/[^0-9.]/g, "");
    const number = Number(clean);

    if (Number.isNaN(number)) {
      return `₦${value}`;
    }

    return `₦${number.toLocaleString()}`;
  };

  const getUser = () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) return null;

      return JSON.parse(rawUser);
    } catch (error) {
      console.error("getUser error:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getUser();
    return user?.id || user?.user_id || null;
  };

  const fetchAccounts = async () => {
    const userId = getUserId();

    if (!userId) {
      setAccounts([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const data = await res.json();

      console.log("Accounts Response:", data);

      if (data.success && Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("fetchAccounts error:", error);

      showMessage(
        "error",
        "Server error while loading accounts"
      );
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/get-plans.php"
      );

      const data = await res.json();

      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchPlans error:", error);
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const handleViewDetails = (acc) => {
    setSelectedAccount(acc);
    setOpenModal(true);
  };

  const requestPhase = async (account, requestedPhase) => {
    const userId = getUserId();

    if (!userId) {
      showMessage("error", "User not logged in");
      return;
    }

    try {
      setLoadingRequest(true);

      const payload = {
        user_id: userId,
        account_id: account.id,
        current_phase: String(account.phase),
        requested_phase: String(requestedPhase),
      };

      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        showMessage(
          "success",
          data.message || "Phase request submitted"
        );

        setOpenModal(false);
        setSelectedAccount(null);

        fetchAccounts();
      } else {
        showMessage(
          "error",
          data.message || "Failed to submit request"
        );
      }
    } catch (error) {
      console.error(error);

      showMessage("error", "Server error");
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleBuyPlan = async (plan) => {
    const user = getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!window.squad) {
      showMessage(
        "error",
        "Squad payment script not loaded"
      );
      return;
    }

    try {
      setBuyingPlanId(plan.id);

      const res = await fetch(
        "https://api.fundednaira.ng/api/payments/initialize-payment.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id || user.user_id,
            plan_id: plan.id,
          }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        showMessage(
          "error",
          result.message || "Failed to initialize payment"
        );

        return;
      }

      const payment = result.data;

      const squadInstance = new window.squad({
        key: payment.public_key,
        email: payment.email,
        amount: payment.amount,
        currency_code: payment.currency,
        transaction_ref: payment.reference,
        customer_name: payment.customer_name,
        callback_url: payment.callback_url,
        payment_channels: payment.payment_channels,
        metadata: payment.metadata,

        onClose: () => {
          setBuyingPlanId(null);
        },

        onLoad: () => {
          console.log("Squad modal loaded");
        },

        onSuccess: () => {
          window.location.href = `/dashboard/payment/callback?reference=${payment.reference}`;
        },
      });

      squadInstance.setup();
      squadInstance.open();
    } catch (error) {
      console.error("handleBuyPlan error:", error);

      showMessage(
        "error",
        "Server error while starting payment"
      );

      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter(
    (plan) =>
      String(plan.type || "").toLowerCase() ===
      "challenge"
  );

  const instantPlans = plans.filter(
    (plan) =>
      String(plan.type || "").toLowerCase() ===
        "instant" ||
      String(plan.type || "").toLowerCase() ===
        "instant funding"
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 md:p-10 bg-gray-950 min-h-screen text-white relative">
          <TopSection />

          {message.show && (
            <div className="fixed top-5 right-5 z-[100]">
              <div
                className={`flex items-start gap-3 min-w-[300px] max-w-[420px] rounded-2xl border px-4 py-4 shadow-2xl ${
                  message.type === "success"
                    ? "bg-green-950/90 border-green-700 text-green-200"
                    : "bg-red-950/90 border-red-700 text-red-200"
                }`}
              >
                <div className="mt-0.5">
                  {message.type === "success" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold mb-1">
                    {message.type === "success"
                      ? "Success"
                      : "Error"}
                  </h4>

                  <p className="text-sm">
                    {message.text}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setMessage({
                      show: false,
                      type: "",
                      text: "",
                    })
                  }
                  className="text-gray-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold mb-8">
            Accounts Dashboard
          </h1>
        </div>
      </div>

      <AccountDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        account={selectedAccount}
        requestPhase={requestPhase}
        loadingRequest={loadingRequest}
      />
    </Layout>
  );
};

export default Accounts;
