import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layout/Layout";

import {
  FaShieldAlt,
  FaBolt,
  FaClock,
  FaChartLine,
  FaWallet,
  FaCheckCircle,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

const Rules = () => {
  const [activeTab, setActiveTab] = useState("rules");

  const rulesData = [
    {
      icon: <FaShieldAlt />,
      title: "20% Overall Max DD",
      desc: "Your maximum loss limit is 20% of your original account size, with no daily drawdown pressure. Example: On a ₦200k account, your balance must not fall below ₦160k.",
    },

    {
      icon: <FaChartLine />,
      title: "10% Profit Target",
      desc: "Reach 10% profit while staying within the drawdown limit to progress to the next phase or funded account.",
    },

    {
      icon: <FaBolt />,
      title: "No Daily Drawdown",
      desc: "Unlike traditional prop firms, there is no daily drawdown rule. Focus on trading freely without daily pressure.",
    },

    {
      icon: <FaClock />,
      title: "5 Days Activity Rule",
      desc: "Place at least one trade every 5 days to keep your account active and avoid broker inactivity restrictions.",
    },

    {
      icon: <FaExclamationTriangle />,
      title: "No 1–2 Minute Scalping",
      desc: "Trades opened and closed within 1–2 minutes are not allowed on more than 5 positions. Hold trades for at least 2 minutes.",
    },
  ];

  const payoutData = [
    {
      title: "Minimum Payout",
      value: "10% Profit",
    },

    {
      title: "Maximum Payout Cap",
      value: "50% Profit",
    },

    {
      title: "Profit Split",
      value: "80% Trader / 20% Firm",
    },

    {
      title: "Processing Time",
      value: "Within 12 Hours",
    },
  ];

  const steps = [
    "Buy an account to trade any pair or commodity.",
    "Hit 10% profit and migrate to the next phase.",
    "Pass KYC using only your bank account number.",
    "Request payout and continue trading confidently.",
  ];

  return (
    <Layout>
      <section className="bg-[#0B0F19] text-white min-h-screen py-24 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[450px] h-[450px] bg-sky-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* HERO */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-2 rounded-full text-sm font-medium">
              <FaCheckCircle />
              Simple Prop Trading Rules
            </div>

            <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
              Trading Rules
            </h1>

            <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">
              The prop firm with just 2 simple rules. We removed the
              noise from traditional prop trading so you can focus on
              getting funded and paid.
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-5 gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur">
              <h3 className="text-3xl font-bold text-sky-400">
                10%
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Profit Target
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur">
              <h3 className="text-3xl font-bold text-sky-400">
                20%
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Overall Max DD
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur">
              <h3 className="text-3xl font-bold text-sky-400">
                No
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Daily DD
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur">
              <h3 className="text-3xl font-bold text-sky-400">
                5 Days
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Activity Rule
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur">
              <h3 className="text-3xl font-bold text-sky-400">
                5 Min
              </h3>

              <p className="text-gray-400 mt-2 text-sm">
                Instant Payout
              </p>
            </div>
          </div>

          {/* FAST PAYOUT */}
          <div className="mt-16 bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  We Pay Within 5 Minutes
                </h2>

                <p className="mt-4 text-gray-400 leading-8 max-w-2xl">
                  Trading profits and affiliate commissions are paid
                  instantly or within 5 minutes. As you sabi trade,
                  we sabi pay.
                </p>
              </div>

              <div className="text-6xl">
                💰
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="mt-20">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab("rules")}
                className={`px-6 py-3 rounded-2xl font-medium transition ${
                  activeTab === "rules"
                    ? "bg-sky-400 text-black"
                    : "bg-white/5 border border-white/10 text-gray-300"
                }`}
              >
                Rules
              </button>

              <button
                onClick={() => setActiveTab("how")}
                className={`px-6 py-3 rounded-2xl font-medium transition ${
                  activeTab === "how"
                    ? "bg-sky-400 text-black"
                    : "bg-white/5 border border-white/10 text-gray-300"
                }`}
              >
                How It Works
              </button>

              <button
                onClick={() => setActiveTab("payout")}
                className={`px-6 py-3 rounded-2xl font-medium transition ${
                  activeTab === "payout"
                    ? "bg-sky-400 text-black"
                    : "bg-white/5 border border-white/10 text-gray-300"
                }`}
              >
                Payout
              </button>
            </div>

            {/* RULES TAB */}
            {activeTab === "rules" && (
              <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rulesData.map((rule, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur hover:border-sky-400/40 transition"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 text-2xl mb-5">
                      {rule.icon}
                    </div>

                    <h3 className="text-xl font-semibold">
                      {rule.title}
                    </h3>

                    <p className="mt-3 text-gray-400 leading-7 text-sm">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* HOW IT WORKS */}
            {activeTab === "how" && (
              <div className="mt-14">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur">
                  <h2 className="text-3xl font-bold">
                    🚀 Simple Trader Journey
                  </h2>

                  <p className="mt-4 text-gray-400 leading-8">
                    Buy, trade, pass, verify, and withdraw.
                  </p>

                  <div className="mt-10 space-y-6">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-5 bg-white/[0.03] border border-white/5 rounded-2xl p-5"
                      >
                        <div className="w-12 h-12 rounded-xl bg-sky-500 text-black flex items-center justify-center font-bold text-lg shrink-0">
                          {index + 1}
                        </div>

                        <div>
                          <p className="text-gray-300 leading-7">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FUNDED */}
                  <div className="mt-10 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold">
                      ✅ Phase 2 / Funded
                    </h3>

                    <p className="mt-3 text-gray-400 leading-7">
                      Hit the 10% profit target and stay within the
                      20% max drawdown to progress. Every new phase
                      gives you fresh login details, resetting your
                      drawdown and scalping count back to zero.
                    </p>
                  </div>

                  {/* INACTIVE */}
                  <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-yellow-400">
                      🪪 Inactive Rule
                    </h3>

                    <p className="mt-3 text-gray-400 leading-7">
                      Place at least one trade every 5 days to keep
                      your account active. This is not a platform
                      rule; inactive accounts may be removed by the
                      broker.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PAYOUT TAB */}
            {activeTab === "payout" && (
              <div className="mt-14">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur">
                  <h2 className="text-3xl font-bold">
                    💰 Payout Policy
                  </h2>

                  <p className="mt-4 text-gray-400 leading-8">
                    Designed to keep withdrawals clear, simple,
                    and fair.
                  </p>

                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payoutData.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-6"
                      >
                        <h3 className="text-gray-400 text-sm">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-2xl font-bold text-sky-400">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
                    <p className="text-gray-300 leading-7">
                      Earning above the maximum payout limit is not
                      considered a breach. Profits above the cap may
                      be removed based on payout policy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-3 bg-sky-400 hover:bg-sky-300 text-black px-10 py-4 rounded-2xl text-lg font-semibold transition duration-300 hover:scale-105"
            >
              Start Challenge
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Rules;
