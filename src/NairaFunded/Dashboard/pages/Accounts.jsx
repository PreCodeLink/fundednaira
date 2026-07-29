import { useEffect, useState } from "react";
import Layout from "../companent/Layout";
import Sidebar from "../companent/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  Crown,
  Trophy,
  Zap,
} from "lucide-react";
import TopSection from "../companent/TopSection";

const Feature = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Check size={15} className="text-emerald-400" />
      <span className="text-sm text-[#93A0B4]">{label}</span>
    </div>

    <span className="font-mono text-sm font-semibold text-[#F3EFE6]">
      {value}
    </span>
  </div>
);

const PlanCard = ({ plan, color = "sky", onBuy, buyingPlanId, formatMoney }) => {
  const type = String(plan.type).toLowerCase();

  const isChallenge = type === "challenge";

  const isPremium =
    type === "premium" ||
    type === "instant premium" ||
    type === "premium funding";

  const isLoading = Number(buyingPlanId) === Number(plan.id);

  const accent = isPremium
    ? "from-amber-400 to-orange-500"
    : color === "green"
    ? "from-emerald-400 to-emerald-600"
    : "from-[#38BDF8] to-blue-600";

  const glow = isPremium
    ? "hover:shadow-[0_0_40px_rgba(251,191,36,0.15)] hover:border-amber-400/40"
    : color === "green"
    ? "hover:shadow-[0_0_40px_rgba(52,211,153,0.15)] hover:border-emerald-400/40"
    : "hover:shadow-[0_0_40px_rgba(56,189,248,0.15)] hover:border-[#38BDF8]/40";

  const orb = isPremium
    ? "bg-amber-400/10"
    : color === "green"
    ? "bg-emerald-400/10"
    : "bg-[#38BDF8]/10";

  const badge = isPremium ? (
    <Crown size={15} />
  ) : isChallenge ? (
    <Trophy size={15} />
  ) : (
    <Zap size={15} />
  );

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${glow}`}
    >
      <div
        className={`absolute -right-24 -top-24 h-56 w-56 rounded-full ${orb} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white ${accent}`}
          >
            {badge}
            {plan.type}
          </div>

          {plan.popular && (
            <div className="rounded-full bg-amber-400 px-3 py-1 text-[0.65rem] font-bold text-black">
              POPULAR
            </div>
          )}
        </div>

        <h2 className="mt-7 font-mono text-3xl font-bold text-[#F3EFE6] md:text-4xl">
          {formatMoney(plan.size)}
        </h2>
        <p className="mt-1 text-sm text-[#5B6B82]">Trading Capital</p>

        <div className="mt-6">
          <h3 className="font-mono text-2xl font-semibold text-[#F3EFE6]">
            {formatMoney(plan.price)}
          </h3>
          <p className="mt-0.5 text-xs text-[#5B6B82]">One-Time Fee</p>
        </div>
      </div>

      <div className="relative space-y-4 border-y border-white/[0.06] p-6 md:p-7">
        <Feature label="Profit Target" value={`${plan.target}%`} />
        <Feature label="Max Drawdown" value={`${plan.loss}%`} />
        <Feature label="Profit Split" value={`${plan.split}%`} />
        <Feature
          label="Minimum Days"
          value={isPremium ? "Unlimited" : isChallenge ? "5 Days" : "Instant"}
        />
        <Feature
          label="Weekend Holding"
          value={isPremium ? "Allowed" : "Available"}
        />
      </div>

      <div className="relative p-6 md:p-7">
        <button
          onClick={() => onBuy(plan)}
          disabled={isLoading}
          className={`group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r py-3.5 font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${accent}`}
        >
          {isLoading ? "Processing..." : "Buy Account"}

          {!isLoading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, accentColor }) => (
  <div className="mb-6 flex items-center gap-3">
    <div className={`h-8 w-1 rounded-full ${accentColor}`} />
    <div>
      <h3 className="text-xl font-semibold text-[#F3EFE6] md:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[#93A0B4]">{subtitle}</p>
    </div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center font-mono text-xs text-[#5B6B82]">
    {text}
  </div>
);

const Accounts = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [buyingPlanId, setBuyingPlanId] = useState(null);

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text });
    setTimeout(() => {
      setMessage({ show: false, type: "", text: "" });
    }, 3000);
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";
    const clean = String(value).replace(/[^0-9.]/g, "");
    const number = Number(clean);
    if (Number.isNaN(number)) return `₦${value}`;
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

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://api.fundednaira.net/api/dashboard/get-plans.php"
      );
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchPlans error:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleBuyPlan = async (plan) => {
    const user = getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!window.squad) {
      showMessage("error", "Squad payment script not loaded");
      return;
    }

    try {
      setBuyingPlanId(plan.id);

      const res = await fetch(
        "https://api.fundednaira.net/api/payments/initialize-payment.php",
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

      const text = await res.text();
      console.log("initialize payment raw:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        showMessage("error", "Invalid server response");
        return;
      }

      if (!result.success) {
        showMessage("error", result.message || "Failed to initialize payment");
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
      showMessage("error", "Server error while starting payment");
      setBuyingPlanId(null);
    }
  };

  const challengePlans = plans.filter(
    (plan) => String(plan.type || "").toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter(
    (plan) =>
      String(plan.type || "").toLowerCase() === "instant" ||
      String(plan.type || "").toLowerCase() === "instant funding"
  );

  const premiumPlans = plans.filter((plan) => {
    const t = String(plan.type).toLowerCase();
    return (
      t === "instant premium" || t === "premium" || t === "instant-premium"
    );
  });

  return (
    <Layout>
      <div
        className="relative flex min-h-screen pt-16"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.12), transparent), #05070D",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Sidebar />

        <div className="relative z-10 mx-auto w-full flex-1 md:ml-72 p-4 text-[#F3EFE6] md:max-w-6xl md:p-8">
          <TopSection />

          {/* TOAST */}
          {message.show && (
            <div className="fixed right-5 top-5 z-[100]">
              <div
                className={`flex min-w-[300px] max-w-[420px] items-start gap-3 rounded-2xl border px-4 py-4 backdrop-blur-xl ${
                  message.type === "success"
                    ? "border-emerald-400/30 bg-[#0B0F19]/95 text-emerald-200"
                    : "border-red-400/30 bg-[#0B0F19]/95 text-red-200"
                }`}
              >
                <div className="mt-0.5">
                  {message.type === "success" ? (
                    <CheckCircle2 size={20} className="text-emerald-300" />
                  ) : (
                    <AlertCircle size={20} className="text-red-300" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="mb-1 font-semibold">
                    {message.type === "success" ? "Success" : "Error"}
                  </h4>
                  <p className="text-sm text-[#93A0B4]">{message.text}</p>
                </div>

                <button
                  onClick={() =>
                    setMessage({ show: false, type: "", text: "" })
                  }
                  className="text-[#5B6B82] transition hover:text-[#F3EFE6]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <section className="relative mt-6 overflow-hidden">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#38BDF8]/70">
                Funding Plans
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-[#38BDF8] via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Trading Account
                </span>
              </h2>
            </div>

            {loadingPlans ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#5B6B82]">
                Loading plans
              </div>
            ) : (
              <>
                <div className="mb-14">
                  <SectionHeader
                    title="Challenge Accounts"
                    subtitle="Pass the evaluation and move to the next phase."
                    accentColor="bg-[#38BDF8]"
                  />

                  {challengePlans.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {challengePlans.map((plan, index) => (
                        <PlanCard
                          key={plan.id || index}
                          plan={plan}
                          color="sky"
                          formatMoney={formatMoney}
                          onBuy={handleBuyPlan}
                          buyingPlanId={buyingPlanId}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No challenge plans available" />
                  )}
                </div>

                <div className="mb-14">
                  <SectionHeader
                    title="Instant Funding Accounts"
                    subtitle="Get faster access with instant funding options."
                    accentColor="bg-emerald-400"
                  />

                  {instantPlans.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {instantPlans.map((plan, index) => (
                        <PlanCard
                          key={plan.id || index}
                          plan={plan}
                          color="green"
                          formatMoney={formatMoney}
                          onBuy={handleBuyPlan}
                          buyingPlanId={buyingPlanId}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No instant funding plans available" />
                  )}
                </div>

                <div className="mb-10">
                  <SectionHeader
                    title="Instant Premium Accounts"
                    subtitle="Premium funding accounts with exclusive benefits."
                    accentColor="bg-amber-400"
                  />

                  {premiumPlans.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {premiumPlans.map((plan, index) => (
                        <PlanCard
                          key={plan.id || index}
                          plan={plan}
                          color="gold"
                          formatMoney={formatMoney}
                          onBuy={handleBuyPlan}
                          buyingPlanId={buyingPlanId}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No premium plans available" />
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Accounts;