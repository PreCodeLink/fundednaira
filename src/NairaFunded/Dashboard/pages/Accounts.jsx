import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import TopSection from "../companent/TopSection";
import { useNavigate } from "react-router-dom";

/* ================= ACCOUNT MODAL ================= */
const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!isOpen || !account) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?.user_id;

  const normalizePhase = (p) => {
    const v = String(p || "").toLowerCase();
    if (v.includes("instant")) return "Instant";
    if (v.includes("funded")) return "Funded";
    if (v.includes("2")) return "Phase 2";
    return "Phase 1";
  };

  const currentPhase = normalizePhase(account.phase);

  const getNextPhase = () => {
    if (currentPhase === "Phase 1") return "Phase 2";
    if (currentPhase === "Phase 2") return "Funded";
    return null;
  };

  const requestPhase = async () => {
    setMsg("");
    setErr("");

    if (!userId) return setErr("Login required");
    if (currentPhase === "Instant")
      return setErr("Instant accounts cannot request phase");

    const payload = {
      user_id: userId,
      account_id: account.id,
      current_phase: currentPhase,
      requested_phase: getNextPhase(),
    };

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.fundednaira.ng/api/dashboard/request-phase.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) setErr(data.message);
      else setMsg(data.message);
    } catch {
      setErr("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl text-white border border-gray-800">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {msg && <p className="text-green-400 mb-3">{msg}</p>}
        {err && <p className="text-red-400 mb-3">{err}</p>}

        <div className="space-y-2 mb-5">
          <p>Type: {account.type}</p>
          <p>Balance: ₦{account.balance}</p>
          <p>Equity: ₦{account.equity}</p>
          <p>Phase: {currentPhase}</p>
          <p>Status: {account.status}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>Login: {account.login}</p>
          <p>Password: {account.password}</p>
          <p>Server: {account.server}</p>
        </div>

        {currentPhase === "Instant" ? (
          <p className="text-yellow-400 text-sm">
            Instant accounts do not require phase request
          </p>
        ) : (
          <button
            onClick={requestPhase}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
          >
            {loading ? "Loading..." : `Request ${getNextPhase()}`}
          </button>
        )}
      </div>
    </div>
  );
};

/* ================= PLAN CARD ================= */
const PlanCard = ({
  plan,
  formatMoney,
  buttonColor,
  buttonText,
  onBuy,
  buyingPlanId,
}) => {
  const isLoading = Number(buyingPlanId) === Number(plan.id);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {formatMoney(plan.size)} Account
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-lg ${
            buttonColor === "green"
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {plan.type}
        </span>
      </div>

      <p className="text-3xl font-bold">{formatMoney(plan.price)}</p>

      <ul className="mt-6 space-y-2 text-gray-400 text-sm">
        <li className="flex justify-between">
          <span>Profit Target</span>
          <span className="text-white">{plan.target}%</span>
        </li>
        <li className="flex justify-between">
          <span>Max Loss</span>
          <span className="text-white">{plan.loss}%</span>
        </li>
        <li className="flex justify-between">
          <span>Profit Split</span>
          <span className="text-white">{plan.split}%</span>
        </li>
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-xl text-white font-medium ${
          buttonColor === "green"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
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
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?.user_id;

  /* FETCH ACCOUNTS */
  const fetchAccounts = async () => {
    if (!userId) return;

    const res = await fetch(
      `https://api.fundednaira.ng/api/dashboard/get-user-accounts.php?user_id=${userId}`
    );

    const data = await res.json();
    setAccounts(data.accounts || []);
  };

  /* FETCH PLANS */
  const fetchPlans = async () => {
    const res = await fetch(
      "https://api.fundednaira.ng/api/dashboard/get-plans.php"
    );
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const formatMoney = (v) =>
    isNaN(Number(v)) ? "₦0" : `₦${Number(v).toLocaleString()}`;

  const handleBuyPlan = async (plan) => {
    if (!user) return navigate("/auth");

    try {
      setBuyingPlanId(plan.id);

      const res = await fetch(
        "https://api.fundednaira.ng/api/payments/initialize-payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            plan_id: plan.id,
          }),
        }
      );

      const result = await res.json();

      const squad = new window.squad({
        key: result.data.public_key,
        email: result.data.email,
        amount: result.data.amount,
        currency_code: result.data.currency,
        transaction_ref: result.data.reference,
        callback_url: result.data.callback_url,
        onClose: () => setBuyingPlanId(null),
        onSuccess: () =>
          (window.location.href =
            `/dashboard/payment/callback?reference=${result.data.reference}`),
      });

      squad.setup();
      squad.open();
    } catch (err) {
      console.error(err);
      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter(
    (p) => String(p.type).toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) =>
    ["instant", "instant funding"].includes(String(p.type).toLowerCase())
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

            <div className="grid md:grid-cols-3 gap-6">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                >
                  <h3>{acc.type}</h3>
                  <p>{formatMoney(acc.balance)}</p>

                  <button
                    onClick={() => {
                      setSelected(acc);
                      setOpen(true);
                    }}
                    className="mt-4 bg-blue-600 w-full py-2 rounded-lg"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUY SECTION UI ================= */}
          <section className="mt-16">

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">
                Buy Trading Account
              </h2>

              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Choose your preferred account size and start your journey to becoming a funded trader.
              </p>
            </div>

            {/* CHALLENGE */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-blue-500"></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Challenge Accounts
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Pass the evaluation and move to the next phase.
                  </p>
                </div>
              </div>

              {challengePlans.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {challengePlans.map((plan, index) => (
                    <PlanCard
                      key={plan.id || index}
                      plan={plan}
                      formatMoney={formatMoney}
                      buttonColor="blue"
                      buttonText="Buy Challenge"
                      onBuy={handleBuyPlan}
                      buyingPlanId={buyingPlanId}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
                  No challenge plans available
                </div>
              )}
            </div>

            {/* INSTANT */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Instant Funding Accounts
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Get faster access with instant funding options.
                  </p>
                </div>
              </div>

              {instantPlans.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {instantPlans.map((plan, index) => (
                    <PlanCard
                      key={plan.id || index}
                      plan={plan}
                      formatMoney={formatMoney}
                      buttonColor="green"
                      buttonText="Buy Instant"
                      onBuy={handleBuyPlan}
                      buyingPlanId={buyingPlanId}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
                  No instant funding plans available
                </div>
              )}
            </div>

          </section>
        </div>
      </div>

      <AccountDetailsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        account={selected}
      />
    </Layout>
  );
};

export default Accounts;<section className="mt-16">

  {/* ================= HEADER ================= */}
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-5xl font-bold">
      Buy Trading Account
    </h2>

    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
      Choose your preferred account size and start your journey to becoming a funded trader.
    </p>
  </div>

  {/* ================= CHALLENGE ACCOUNTS ================= */}
  <div className="mb-16">

    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-1 rounded-full bg-blue-500"></div>

      <div>
        <h3 className="text-2xl md:text-3xl font-bold">
          Challenge Accounts
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Pass the evaluation and move to the next phase.
        </p>
      </div>
    </div>

    {challengePlans?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {challengePlans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            formatMoney={formatMoney}
            buttonColor="blue"
            buttonText="Buy Challenge"
            onBuy={handleBuyPlan}
            buyingPlanId={buyingPlanId}
          />
        ))}

      </div>
    ) : (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No challenge plans available
      </div>
    )}

  </div>

  {/* ================= INSTANT ACCOUNTS ================= */}
  <div className="mb-10">

    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-1 rounded-full bg-green-500"></div>

      <div>
        <h3 className="text-2xl md:text-3xl font-bold">
          Instant Funding Accounts
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Get faster access with instant funding options.
        </p>
      </div>
    </div>

    {instantPlans?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {instantPlans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            formatMoney={formatMoney}
            buttonColor="green"
            buttonText="Buy Instant"
            onBuy={handleBuyPlan}
            buyingPlanId={buyingPlanId}
          />
        ))}

      </div>
    ) : (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No instant funding plans available
      </div>
    )}

  </div>

</section>
