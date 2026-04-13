import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      const res = await fetch("https://fundednaira.ng/api/dashboard/get-plans.php");
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

  const PlanCard = ({ plan, color = "blue" }) => {
    const isGreen = color === "green";

    return (
      <div
        className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 transition hover:-translate-y-1 ${
          isGreen ? "hover:border-green-500" : "hover:border-blue-500"
        }`}
      >
        {plan.popular && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
            Popular
          </span>
        )}

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            isGreen
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {plan.type}
        </span>

        <h3 className="text-xl font-semibold mt-4">
          {formatMoney(plan.size)} Account
        </h3>

        <p className="mt-3 text-3xl font-bold">
          {formatMoney(plan.price)}
        </p>

        <ul className="mt-6 space-y-3 text-gray-400 text-sm">
          <li className="flex justify-between">
            <span>Profit Target</span>
            <span className="text-white">{plan.target}%</span>
          </li>
          <li className="flex justify-between">
            <span>Max Loss</span>
            <span className="text-white">{plan.loss}%</span>
          </li>
          <li className="flex justify-between">
            <span>Split</span>
            <span className="text-white">{plan.split}%</span>
          </li>
        </ul>

        <Link
          to="/auth"
          className={`mt-8 block text-center py-3 rounded-xl font-medium ${
            isGreen
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Buy Now
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Trading Account
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Start your trading journey with flexible funding options.
          </p>
        </div>

        {/* LOADING */}
        {loadingPlans && (
          <p className="text-center text-gray-400">Loading plans...</p>
        )}

        {/* CHALLENGE */}
        {!loadingPlans && (
          <>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500"></span>
              Challenge Accounts
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {challengePlans.map((plan, i) => (
                <PlanCard key={i} plan={plan} color="blue" />
              ))}
            </div>

            {/* INSTANT */}
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500"></span>
              Instant Funding Accounts
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instantPlans.map((plan, i) => (
                <PlanCard key={i} plan={plan} color="green" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pricing;