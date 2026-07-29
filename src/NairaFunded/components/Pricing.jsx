import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Crown,
  Zap,
  Trophy,
} from "lucide-react";
const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const formatMoney = (value) => {
    if (!value) return "₦0";
    const number = Number(String(value).replace(/[^0-9.]/g, ""));
    return `₦${number.toLocaleString()}`;
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("https://api.fundednaira.ng/api/dashboard/get-plans.php");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const challengePlans = plans.filter(
    (p) => String(p.type).toLowerCase() === "challenge"
  );

  const instantPlans = plans.filter((p) => {
    const t = String(p.type).toLowerCase();
    return t === "instant" || t === "instant funding";
  });
const premiumPlans = plans.filter((p) => {
  const t = String(p.type).toLowerCase();

  return (
    t === "instant premium" ||
    t === "premium" ||
    t === "premium funding"
  );
});
const Feature = ({ label, value }) => (
  <div className="flex justify-between items-center">

    <div className="flex items-center gap-2">

      <Check
        size={16}
        className="text-green-400"
      />

      <span className="text-slate-400">
        {label}
      </span>

    </div>

    <span className="font-semibold text-white">
      {value}
    </span>

  </div>
);
 const PlanCard = ({ plan, color = "blue" }) => {
  const type = String(plan.type).toLowerCase();

  const isChallenge = type === "challenge";
  const isPremium =
    type === "premium" ||
    type === "instant premium" ||
    type === "premium funding";

  const accent = isPremium
    ? "from-yellow-400 to-orange-500"
    : color === "green"
    ? "from-green-400 to-emerald-500"
    : "from-sky-400 to-blue-600";

  const badge = isPremium ? (
    <Crown size={16} />
  ) : isChallenge ? (
    <Trophy size={16} />
  ) : (
    <Zap size={16} />
  );

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-2xl
      transition-all
      duration-500
      hover:-translate-y-3
      hover:border-sky-400/40
      "
    >
      {/* Glow */}

      <div
        className="
        absolute
        -top-32
        -right-32
        w-64
        h-64
        rounded-full
        bg-sky-500/10
        blur-3xl
        opacity-0
        group-hover:opacity-100
        transition
        duration-700
        "
      />

      {/* Top */}

      <div className="p-8">

        <div className="flex justify-between items-center">

          <div
            className={`
            flex
            items-center
            gap-2
            px-3
            py-1
            rounded-full
            text-sm
            bg-gradient-to-r
            ${accent}
            text-white
            `}
          >
            {badge}
            {plan.type}
          </div>

          {plan.popular && (
            <div className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold">
              POPULAR
            </div>
          )}

        </div>

        <h2 className="mt-8 text-5xl font-black">
          {formatMoney(plan.size)}
        </h2>

        <p className="text-slate-400 mt-2">
          Trading Capital
        </p>

        <div className="mt-8">

          <h3 className="text-4xl font-bold">
            {formatMoney(plan.price)}
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            One-Time Fee
          </p>

        </div>

      </div>

      {/* Features */}

      <div className="border-y border-white/10 p-8">

        <div className="space-y-5">

          <Feature
            label="Profit Target"
            value={`${plan.target}%`}
          />

          <Feature
            label="Max Drawdown"
            value={`${plan.loss}%`}
          />

          <Feature
            label="Profit Split"
            value="100%"
          />

          <Feature
            label="Minimum Days"
            value={
              isPremium
                ? "Unlimited"
                : isChallenge
                ? "5 Days"
                : "Instant"
            }
          />

          <Feature
            label="Weekend Holding"
            value={
              isPremium
                ? "Allowed"
                : "Available"
            }
          />

        </div>

      </div>

      {/* Button */}

      <div className="p-8">

        <Link
          to="/auth"
          className={`
          group
          flex
          justify-center
          items-center
          gap-3
          rounded-2xl
          py-4
          font-semibold
          text-white
          bg-gradient-to-r
          ${accent}
          transition-all
          duration-300
          hover:scale-[1.03]
          `}
        >
          Start Now

          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition"
          />

        </Link>

      </div>

    </div>
  );
};

  return (
  <section className="relative overflow-hidden bg-[#050816] py-24">

    {/* Background */}
    <div className="absolute inset-0">

      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[180px] rounded-full" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:55px_55px]" />

    </div>

    <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

      {/* Heading */}

      <div className="text-center max-w-3xl mx-auto">

        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2 text-sky-300 text-sm">

          FUNDING PROGRAMS

        </span>

        <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black text-white">

          Choose Your

          <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">

            Trading Account

          </span>

        </h2>

        <p className="mt-6 text-slate-400 text-lg leading-relaxed">

          Whether you're a beginner or an experienced trader,
          choose the funding model that fits your strategy and
          start trading with FundedNaira capital.

        </p>

      </div>

      {/* Benefits */}

      <div className="mt-14 flex flex-wrap justify-center gap-4">

        {[
          "Up To ₦800,000 Capital",
          "Fast Naira Payouts",
          "100% Profit Split",
          "Instant Funding",
          "24/7 Support",
        ].map((item) => (

          <div
            key={item}
            className="
            px-5
            py-3
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-slate-300
            backdrop-blur-xl
            "
          >
            ✓ {item}
          </div>

        ))}

      </div>

      {/* Loading */}

      {loadingPlans && (

        <div className="text-center mt-20">

          <div className="inline-block h-10 w-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>

          <p className="mt-5 text-slate-400">
            Loading trading accounts...
          </p>

        </div>

      )}

      {!loadingPlans && (
        <>

          {/* Challenge */}

          <section className="mt-24">

            <div className="flex items-center gap-3 mb-10">

              <div className="w-2 h-10 rounded-full bg-blue-500" />

              <div>

                <h3 className="text-3xl font-bold text-white">

                  Challenge Accounts

                </h3>

                <p className="text-slate-400">

                  Complete the evaluation and get funded.

                </p>

              </div>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {challengePlans.map((plan, index) => (

                <PlanCard
                  key={index}
                  plan={plan}
                  color="blue"
                />

              ))}

            </div>

          </section>

          {/* Instant */}

          <section className="mt-24">

            <div className="flex items-center gap-3 mb-10">

              <div className="w-2 h-10 rounded-full bg-green-500" />

              <div>

                <h3 className="text-3xl font-bold text-white">

                  Instant Funding

                </h3>

                <p className="text-slate-400">

                  Skip evaluation and trade immediately.

                </p>

              </div>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {instantPlans.map((plan, index) => (

                <PlanCard
                  key={index}
                  plan={plan}
                  color="green"
                />

              ))}

            </div>

          </section>

          {/* Premium */}

          <section className="mt-24">

            <div className="flex items-center gap-3 mb-10">

              <div className="w-2 h-10 rounded-full bg-yellow-500" />

              <div>

                <h3 className="text-3xl font-bold text-white">

                  Premium Funding

                </h3>

                <p className="text-slate-400">

                  Maximum flexibility with premium benefits.

                </p>

              </div>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {premiumPlans.map((plan, index) => (

                <PlanCard
                  key={index}
                  plan={plan}
                  color="gold"
                />

              ))}

            </div>

          </section>

        </>
      )}

    </div>

  </section>
);
};

export default Pricing;
