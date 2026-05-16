import { Link } from "react-router-dom";
import Layout from "../layout/Layout";

import {
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaPercent,
  FaNewspaper,
  FaBalanceScale,
  FaWallet,
  FaHourglassHalf,
  FaBolt,
  FaExclamationTriangle,
} from "react-icons/fa";

const Rules = () => {
  const rules = [
    {
      icon: <FaShieldAlt />,
      title: "Maximum Drawdown — 20%",
      desc: "Your account equity must never fall below the allowed 20% maximum drawdown limit. The drawdown is based on your highest account balance, including floating profits. Breaching this limit will result in account failure.",
    },

    {
      icon: <FaChartLine />,
      title: "Profit Target — 10%",
      desc: "Traders must achieve a 10% profit target in each evaluation phase before progressing to the next stage or qualifying for a funded account.",
    },

    {
      icon: <FaClock />,
      title: "Minimum Trading Days",
      desc: "You must trade for at least 1 trading day before completing a phase. Consistent participation is required to qualify for funding.",
    },

    {
      icon: <FaPercent />,
      title: "Profit Split — Up To 80%",
      desc: "Funded traders can receive up to 80% profit split depending on their account type and payout structure.",
    },

    {
      icon: <FaHourglassHalf />,
      title: "No Fast Scalping",
      desc: "Trades must not be opened and closed within 1–2 minutes. Extremely short-duration trades may be considered rule violations.",
    },

    {
      icon: <FaBolt />,
      title: "Active Trading Requirement",
      desc: "You must place at least one trade every 7 days to keep your account active. Inactive accounts may be suspended or restricted.",
    },

    {
      icon: <FaBalanceScale />,
      title: "Consistency Rule — 20%",
      desc: "Your biggest single trading day must not exceed 20% of your total accumulated profit. This ensures stable and disciplined trading performance.",
    },

    {
      icon: <FaWallet />,
      title: "Maximum Payout — 50%",
      desc: "You can withdraw up to 50% of total account profit in one payout cycle. Remaining profits stay in the account according to payout rules.",
    },

    {
      icon: <FaNewspaper />,
      title: "Restricted Instruments",
      desc: "Trading certain instruments such as crypto pairs, stocks, or restricted assets may not be allowed depending on the account type.",
    },
  ];

  const consistencyExamples = [
    {
      title: "Bad Example",
      text: [
        "Total profit = $100",
        "Day 1 = $70",
        "Day 2 = $30",
        "Biggest day = $70",
        "This means one day produced 70% of the total profit.",
        "Result: You do not pass the consistency rule.",
      ],
      color: "red",
    },

    {
      title: "Near Example",
      text: [
        "Total profit = $100",
        "Day 1 = $20",
        "Day 2 = $25",
        "Day 3 = $30",
        "Day 4 = $25",
        "Biggest day = $30",
        "This is 30% of total profit, which is still above the 20% limit.",
      ],
      color: "yellow",
    },

    {
      title: "Perfect Example",
      text: [
        "Total profit = $100",
        "Day 1 = $20",
        "Day 2 = $20",
        "Day 3 = $20",
        "Day 4 = $20",
        "Day 5 = $20",
        "Each day contributes 20% of total profit.",
        "Result: You pass the consistency rule.",
      ],
      color: "green",
    },
  ];

  const exampleCardClass = {
    red: "border-red-500/30 bg-red-500/10",
    yellow: "border-yellow-500/30 bg-yellow-500/10",
    green: "border-green-500/30 bg-green-500/10",
  };

  const exampleTitleClass = {
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] text-white py-24 px-6 relative overflow-hidden min-h-screen">
        {/* Background Blur */}
        <div className="absolute w-[450px] h-[450px] bg-sky-500 opacity-20 blur-3xl top-[-120px] left-[-120px] rounded-full"></div>

        <div className="absolute w-[350px] h-[350px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center">
            <div className="inline-block bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Trading Evaluation Rules
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Trading Rules
            </h1>

            <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">
              Read and understand all trading rules carefully before
              starting your evaluation. These rules are designed to
              encourage disciplined trading, proper risk management,
              and long-term consistency.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-3xl hover:border-sky-400/60 hover:bg-white/[0.07] transition duration-300"
              >
                <div className="text-sky-400 text-2xl mb-5 bg-sky-500/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                  {rule.icon}
                </div>

                <h2 className="text-xl font-semibold">
                  {rule.title}
                </h2>

                <p className="text-gray-400 mt-3 text-sm leading-7">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Consistency Rule */}
          <div className="mt-24 bg-white/5 backdrop-blur border border-white/10 p-8 md:p-10 rounded-3xl">
            <h2 className="text-3xl font-bold mb-5">
              Consistency Rule Explained
            </h2>

            <p className="text-gray-400 leading-8 text-[15px]">
              The 20% consistency rule means that your biggest
              single trading day must not be more than 20% of your
              total profit. This rule prevents traders from passing
              the challenge based on one oversized day and encourages
              balanced, repeatable performance.
            </p>

            <div className="mt-8 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
              <p className="text-gray-300 leading-8">
                <span className="text-sky-400 font-semibold">
                  Example:
                </span>{" "}
                If your total profit is{" "}
                <span className="text-white font-semibold">
                  $100
                </span>
                , then 20% of that is{" "}
                <span className="text-white font-semibold">
                  $20
                </span>
                . This means your biggest single day profit must be{" "}
                <span className="text-white font-semibold">
                  $20 or less
                </span>
                .
              </p>
            </div>

            {/* Examples */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {consistencyExamples.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-3xl border p-6 ${exampleCardClass[item.color]}`}
                >
                  <h3
                    className={`text-xl font-semibold mb-4 ${exampleTitleClass[item.color]}`}
                  >
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-300 leading-7">
                    {item.text.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Notice */}
          <div className="mt-16 bg-white/5 backdrop-blur border border-white/10 p-8 rounded-3xl text-center">
            <p className="text-gray-300 leading-8 max-w-4xl mx-auto">
              Traders are expected to maintain disciplined risk
              management and responsible trading behavior at all
              times. Any violation of the trading rules may result
              in account breach, payout restriction, suspension,
              or permanent termination of the account.
            </p>
          </div>

          {/* Risk Disclaimer */}
          <div className="mt-8 bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold text-lg">
              <FaExclamationTriangle />

              <h3>Risk Disclaimer</h3>
            </div>

            <p className="mt-4 text-gray-400 text-sm max-w-3xl mx-auto leading-8">
              Forex and CFD trading involve substantial risk and may
              not be suitable for all individuals. Past performance
              does not guarantee future results. Traders should
              carefully evaluate their financial situation and trade
              responsibly within approved risk limits.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-sky-400 hover:bg-sky-300 text-black px-10 py-4 rounded-2xl text-lg font-semibold transition duration-300 hover:scale-105 shadow-lg shadow-sky-500/20"
            >
              Start Your Challenge
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Rules;
