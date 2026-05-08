import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import TopSection from "../companent/TopSection";

/* ================= PLAN CARD ================= */
const PlanCard = ({
  plan,
  formatMoney,
  buttonColor = "blue",
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const isLoading = Number(buyingPlanId) === Number(plan?.id);

  const buttonClass =
    buttonColor === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const badgeClass =
    buttonColor === "green"
      ? "bg-green-500/20 text-green-400"
      : "bg-blue-500/20 text-blue-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {formatMoney(plan?.size)} Account
        </h3>
        <span className={`text-xs px-3 py-1 rounded-lg ${badgeClass}`}>
          {plan?.type}
        </span>
      </div>

      <p className="text-3xl font-bold">{formatMoney(plan?.price)}</p>

      <ul className="mt-6 space-y-2 text-gray-400 text-sm">
        <li className="flex justify-between">
          <span>Profit Target</span>
          <span className="text-white">{plan?.target}%</span>
        </li>
        <li className="flex justify-between">
          <span>Max Loss</span>
          <span className="text-white">{plan?.loss}%</span>
        </li>
        <li className="flex justify-between">
          <span>Profit Split</span>
          <span className="text-white">{plan?.split}%</span>
        </li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${buttonClass}`}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const Accounts = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?.user_id || null;
    } catch {
      return null;
    }
  };

  /* ================= FETCH ACCOUNTS ================= */
  const fetchAccounts = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(
        `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
      );

      const data = await res.json();

      // SAFE PARSING (VERY IMPORTANT)
      const accountsData = data?.accounts || data || [];

      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    } catch (err) {
      console.error("Accounts error:", err);
      setAccounts([]);
    }
  };

  /* ================= FETCH PLANS ================= */
  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/get-plans.php"
      );
      const data = await res.json();

      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Plans error:", err);
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  /* ================= FORMAT MONEY ================= */
  const formatMoney = (value) => {
    const num = Number(String(value).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₦0" : `₦${num.toLocaleString()}`;
  };

  /* ================= BUY PLAN ================= */
  const handleBuyPlan = async (plan) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return navigate("/auth");

    try {
      setBuyingPlanId(plan?.id);

      const res = await fetch(
        "https://api.fundednaira.ng/api/payments/initialize-payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id || user.user_id,
            plan_id: plan.id,
          }),
        }
      );

      const result = await res.json();

      if (!result?.data) {
        setBuyingPlanId(null);
        return;
      }

      const squad = new window.squad({
        key: result.data.public_key,
        email: result.data.email,
        amount: result.data.amount,
        currency_code: result.data.currency,
        transaction_ref: result.data.reference,
        callback_url: result.data.callback_url,
        onClose: () => setBuyingPlanId(null),
        onSuccess: () =>
          (window.location.href = `/dashboard/payment/callback?reference=${result.data.reference}`),
      });

      squad.setup();
      squad.open();
    } catch (err) {
      console.error(err);
      setBuyingPlanId(null);
    }
  };

  /* ================= FILTER PLANS ================= */
  const challengePlans = plans.filter(
    (p) => String(p?.type).toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) =>
    ["instant", "instant funding"].includes(String(p?.type).toLowerCase())
  );

  return (
    <Layout>
      <div className="flex pt-16">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-950 text-white">
          <TopSection />

          <h1 className="text-3xl font-bold mb-8">Accounts Dashboard</h1>

          {/* ================= MY ACCOUNTS ================= */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {acc.type || "Account"}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      Balance:{" "}
                      <span className="text-white">
                        {formatMoney(acc.balance)}
                      </span>
                    </p>

                    <p className="text-gray-400 text-sm">
                      Equity:{" "}
                      <span className="text-white">
                        {formatMoney(acc.equity)}
                      </span>
                    </p>

                    <p className="text-gray-400 text-sm">
                      Phase:{" "}
                      <span className="text-white capitalize">
                        {acc.phase}
                      </span>
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                        String(acc.status).toLowerCase() === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No accounts found</div>
              )}
            </div>
          </div>

          {/* ================= BUY SECTION ================= */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">
                Buy Trading Account
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Choose your preferred account size and start your journey.
              </p>
            </div>

            {/* CHALLENGE */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-bold">Challenge Accounts</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {challengePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    formatMoney={formatMoney}
                    buttonText="Buy Challenge"
                    onBuy={handleBuyPlan}
                    buyingPlanId={buyingPlanId}
                  />
                ))}
              </div>
            </div>

            {/* INSTANT */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                <h3 className="text-2xl font-bold">
                  Instant Funding Accounts
                </h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {instantPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    formatMoney={formatMoney}
                    buttonText="Buy Instant"
                    buttonColor="green"
                    onBuy={handleBuyPlan}
                    buyingPlanId={buyingPlanId}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Accounts;
