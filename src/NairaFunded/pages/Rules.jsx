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
  FaCheckCircle,
} from "react-icons/fa";

const Rules = () => {
  const rules = [
    {
      icon: <FaShieldAlt />,
      title: "20% Maximum Drawdown",
      desc: "Your account equity must never fall below the 20% maximum drawdown limit. This is calculated from your highest account balance including floating profits.",
    },

    {
      icon: <FaChartLine />,
      title: "10% Profit Target",
      desc: "Traders are required to achieve a 10% profit target in both evaluation phases before qualifying for a funded account.",
    },

    {
      icon: <FaClock />,
      title: "Minimum 1 Trading Day",
      desc: "You must trade for at least 1 trading day before completing any challenge phase.",
    },

    {
      icon: <FaPercent />,
      title: "Up To 80% Profit Split",
      desc: "Funded traders can earn up to 80% of generated profits based on payout structure and account type.",
    },

    {
      icon: <FaHourglassHalf />,
      title: "No Fast Scalping",
      desc: "Trades opened and closed within 1–2 minutes may be considered invalid and treated as a rule violation.",
    },

    {
      icon: <FaBolt />,
      title: "Trade Every 7 Days",
      desc: "At least one trade must be placed every 7 days to keep your account active and avoid restrictions.",
    },

    {
      icon: <FaBalanceScale />,
      title: "20% Consistency Rule",
      desc: "Your biggest single trading day must not exceed 20% of your total accumulated profits.",
    },

    {
      icon: <FaWallet />,
      title: "50% Maximum Payout",
      desc: "You may withdraw up to 50% of total profits during a payout cycle based on account payout rules.",
    },

    {
      icon: <FaNewspaper />,
      title: "Restricted Instruments",
      desc: "Some instruments such as crypto, stocks, indices, or energy pairs may be restricted depending on the account type.",
    },
  ];

  const consistencyExamples = [
    {
      title: "Bad Example",
      text: [
        "Total Profit = $100",
        "Day 1 = $70",
        "Day 2 = $30",
        "Biggest Day = $70",
        "70% of profit came from one day.",
        "Result: Failed consistency rule.",
      ],
      color: "red",
    },

    {
      title: "Near Example",
      text: [
        "Total Profit = $100",
        "Day 1 = $20",
        "Day 2 = $25",
        "Day 3 = $30",
        "Day 4 = $25",
        "Largest day = 30%",
        "Result: Still above the 20% limit.",
      ],
      color: "yellow",
    },

    {
      title: "Perfect Example",
      text: [
        "Total Profit = $100",
        "Day 1 = $20",
        "Day 2 = $20",
        "Day 3 = $20",
        "Day 4 = $20",
        "Day 5 = $20",
        "Every day contributes equally.",
        "Result: Passed consistency rule.",
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
      <section className="relative overflow-hidden bg-[#0B0F19] text-white py-24 px-6 min-h-screen">
        {/* Background Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[450px] h-[450px] bg-sky-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* HERO */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-2 rounded-full text-sm font-medium">
              <FaCheckCircle />
              Trading Evaluation Rules
            </div>

            <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
              Rules & Objectives
            </h1>

            <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">
              Read and understand all trading rules carefully before
              starting your challenge. These rules are designed to
              promote disciplined trading, proper risk management,
              and long-term consistency.
            </p>
          </div>

          {/* QUICK RULES */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur">
              <div className="text-sky-400 text-3xl mb-5">
                <FaShieldAlt />
              </div>

              <h3 className="text-2xl font-bold">20%</h3>

              <p className="text-gray-400 mt-2">
                Maximum Drawdown
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur">
              <div className="text-sky-400 text-3xl mb-5">
                <FaChartLine />
              </div>

              <h3 className="text-2xl font-bold">10%</h3>

              <p className="text-gray-400 mt-2">
                Profit Target
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur">
              <div className="text-sky-400 text-3xl mb-5">
                <FaClock />
              </div>

              <h3 className="text-2xl font-bold">1 Day</h3>

              <p className="text-gray-400 mt-2">
                Minimum Trading Days
              </p>
            </div>
          </div>

          {/* RULES GRID */}
          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Trading Rules
            </h2>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur border border-white/10 p-7 rounded-3xl hover:border-sky-400/50 hover:bg-white/[0.07] transition duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 text-2xl mb-5">
                    {rule.icon}
                  </div>

                  <h3 className="text-xl font-semibold">
                    {rule.title}
                  </h3>

                  <p className="mt-3 text-gray-400 text-sm leading-7">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CONSISTENCY */}
          <div className="mt-24 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur">
            <h2 className="text-3xl md:text-4xl font-bold">
              Consistency Rule Explained
            </h2>

            <p className="mt-5 text-gray-400 leading-8">
              The 20% consistency rule means your largest trading
              day must not contribute more than 20% of your total
              profits. This encourages stable, disciplined, and
              repeatable trading performance instead of relying on
              one oversized trading day.
            </p>

            <div className="mt-8 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
              <p className="text-gray-300 leading-8">
                <span className="text-sky-400 font-semibold">
                  Example:
                </span>{" "}
                If your total profit is{" "}
                <span className="font-semibold text-white">
                  $100
                </span>
                , then your biggest trading day must not exceed{" "}
                <span className="font-semibold text-white">
                  $20
                </span>
                .
              </p>
            </div>

            {/* EXAMPLES */}
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

          {/* DISCLAIMER */}
          <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur text-center">
            <p className="text-gray-300 leading-8 max-w-4xl mx-auto">
              Traders are expected to maintain disciplined risk
              management and responsible trading behavior at all
              times. Violating trading rules may result in account
              breach, payout restriction, suspension, or permanent
              account termination.
            </p>
          </div>

          {/* RISK */}
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 text-red-400 text-lg font-semibold">
              <FaExclamationTriangle />

              <h3>Risk Disclaimer</h3>
            </div>

            <p className="mt-4 text-gray-400 text-sm max-w-3xl mx-auto leading-8">
              Forex and CFD trading involve substantial risk and may
              not be suitable for all traders. Past performance does
              not guarantee future results. Trade responsibly and
              always stay within approved risk limits.
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
