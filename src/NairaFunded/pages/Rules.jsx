import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../layout/Layout";

import {
  FaShieldAlt,
  FaBolt,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
  FaExclamationTriangle,
  FaGavel,
} from "react-icons/fa";

const Rules = () => {
  const [activeTab, setActiveTab] = useState("rules");

  const detailsRef = useRef(null);

  const rulesData = [
    {
      icon: <FaShieldAlt />,
      title: "20% Overall Max DD",
      desc: (
        <>
          <p>
            Your maximum loss limit is 20% of your original account
            size, with no daily drawdown pressure. Example: On a
            ₦200k account, your balance must not fall below ₦160k.
          </p>

          <button
            onClick={() => {
              setActiveTab("risk");

              setTimeout(() => {
                detailsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 200);
            }}
            className="mt-5 inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-300 text-black px-5 py-3 rounded-xl font-semibold transition"
          >
            Click Here Full Details
            <FaArrowRight />
          </button>
        </>
      ),
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

    {
      icon: <FaGavel />,
      title: "Consisistency Rule - 20% (For Instant Only)",
      desc: "Your biggest single trading must not account for morethan 20% of your toatal accumlated profit. this rule is designed to ensure steady and disciplined performance rather than one ussualy large trading day",
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
                  instantly or within 5 minutes. Serious traders
                  deserve fast payouts.
                </p>
              </div>

              <div className="text-6xl">💰</div>
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

                    <div className="mt-3 text-gray-400 leading-7 text-sm">
                      {rule.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
    {/* HOW IT WORKS TAB */}
{activeTab === "how" && (
  <div className="mt-14">
    <div className="text-center">
      <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-2 rounded-full text-sm font-medium">
        🚀 Simple Trader Journey
      </div>

      <h2 className="mt-6 text-4xl font-bold">
        Buy, Trade, Pass, Verify & Withdraw
      </h2>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {[
        "Buy an account to trade any pair or commodity.",
        "Hit 10% profit, migrate to the next phase.",
        "Pass KYC with just your bank account number.",
        "Request payout and keep trading with confidence.",
      ].map((step, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 rounded-3xl p-6"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-400 text-black flex items-center justify-center font-bold text-lg">
            {index + 1}
          </div>

          <p className="mt-5 text-lg text-gray-300">
            {step}
          </p>
        </div>
      ))}
    </div>

    {/* Phase 2 */}
    <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8">
      <h3 className="text-3xl font-bold">
        ✅ Phase 2 / Funded
      </h3>

      <p className="mt-4 text-gray-400 leading-8">
        Hit 10% profit target and stay within the
        20% max drawdown to progress.
        Each new phase gives you fresh login details,
        resetting your drawdown and scalping count to zero.
      </p>
    </div>

    {/* Inactive Rule */}
    <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">
      <h3 className="text-3xl font-bold">
        🪪 Inactive Rule
      </h3>

      <p className="mt-4 text-gray-400 leading-8">
        Place at least <strong>one trade every 5 days</strong>
        to keep your account active.
        This is not a NairaTrader rule; inactive accounts
        may be removed by the broker.
      </p>
    </div>
  </div>
)}
          {/* PAYOUT TAB */}
{activeTab === "payout" && (
  <div className="mt-14">
    <div className="text-center">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-2 rounded-full text-sm font-medium">
        💰 Payout Policy
      </div>

      <h2 className="mt-6 text-4xl font-bold">
        Designed to keep withdrawals clear,
        simple and fair
      </h2>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
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
          value: "80% Trader / 20% NairaTrader",
        },
        {
          title: "Processing Time",
          value: "Within 12 Hours",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center"
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

    <div className="mt-10 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-yellow-400">
        Important Note
      </h3>

      <p className="mt-4 text-gray-300 leading-8">
        Earning above the maximum profit limit is
        not a breach. Profits above the cap may be
        removed during payout processing.
      </p>
    </div>
  </div>
)}
         {/* RISK DETAILS TAB */}
{activeTab === "risk" && (
  <div ref={detailsRef} className="mt-16">
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur">
      <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-2 rounded-full text-sm font-medium">
        <FaShieldAlt />
        FundedNaira RISK RULE
      </div>

      <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
        Understand Our
        <span className="text-sky-400"> 20% Drawdown Rule </span>
      </h2>

      <p className="mt-6 text-gray-400 text-lg leading-8 max-w-4xl">
        At FundedNaira, we give traders enough room with a 20% drawdown
        allowance. But once your account touches the drawdown level,
        it is a breach — even if the trade later reverses into profit.
      </p>

      {/* ALERT */}
      <div className="mt-10 bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
        <h3 className="text-2xl font-bold text-red-400">
          ⚠️ Profit later does not cancel a breach.
        </h3>

        <p className="mt-4 text-gray-300 leading-8">
          If your floating loss touches the drawdown level while you are
          away from your screen, the account is already breached.
          Many traders only see the final profit and never know what
          happened while the trade was running.
        </p>
      </div>

      {/* TIPS */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "TIP 1",
            heading: "Highest closed balance matters",
            text: "Once your closed balance grows, your drawdown breach level also moves up. You must protect profit already added to your balance.",
          },

          {
            title: "TIP 2",
            heading: "Floating loss counts",
            text: "You can breach even without closing the trade. If equity touches the breach level, it is counted as a violation.",
          },

          {
            title: "TIP 3",
            heading: "Use Stop Loss",
            text: "The market can hit your drawdown level and reverse later. Stop Loss helps you avoid hidden breaches while you are offline.",
          },
        ].map((tip, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-white/5 rounded-3xl p-6"
          >
            <p className="text-sky-400 font-bold text-sm tracking-wider">
              {tip.title}
            </p>

            <h3 className="mt-4 text-2xl font-semibold">
              {tip.heading}
            </h3>

            <p className="mt-4 text-gray-400 leading-7">
              {tip.text}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE HEADER */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold">
          Drawdown Calculation Table
        </h2>

        <p className="mt-4 text-gray-400 text-lg leading-8">
          Example based on a ₦200,000 account where the maximum
          drawdown amount is ₦40,000.
        </p>

        <div className="mt-6 inline-flex items-center bg-sky-500/10 border border-sky-500/20 text-sky-300 px-6 py-3 rounded-2xl">
          Breach Level = Highest Closed Balance - ₦40,000
        </div>
      </div>

      {/* DRAWDOWN CARDS */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            balance: "₦200,000",
            breach: "₦160,000",
            text: "Starting balance is ₦200k. The drawdown allowance is ₦40k. Once equity or balance touches ₦160k, the account is breached.",
          },

          {
            balance: "₦210,000",
            breach: "₦170,000",
            text: "After closed profit, highest closed balance becomes ₦210k. Drawdown remains ₦40k. Breach level moves up to ₦170k.",
          },

          {
            balance: "₦230,000",
            breach: "₦190,000",
            text: "If highest closed balance grows to ₦230k, the trader must not lose more than ₦40k from that level.",
          },

          {
            balance: "₦250,000",
            breach: "₦210,000",
            text: "At ₦250k highest closed balance, any equity or balance touch at ₦210k or below is a breach.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-sky-500/10 rounded-3xl p-7"
          >
            <div className="space-y-5">
              <div>
                <p className="text-sky-400 text-sm uppercase tracking-wider">
                  Highest Closed Balance
                </p>

                <h3 className="text-4xl font-bold mt-2">
                  {item.balance}
                </h3>
              </div>

              <div>
                <p className="text-sky-400 text-sm uppercase tracking-wider">
                  Maximum Drawdown
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  ₦40,000
                </h3>
              </div>

              <div>
                <p className="text-sky-400 text-sm uppercase tracking-wider">
                  Breach Level
                </p>

                <button className="mt-3 bg-sky-400 text-black font-bold px-6 py-3 rounded-full">
                  Breach at {item.breach}
                </button>
              </div>

              <p className="text-gray-400 leading-7 text-sm">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* HIDDEN BREACH */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold">
          How A Hidden Breach Can Happen
        </h2>

        <p className="mt-4 text-gray-400 text-lg">
          This is why looking at only the final profit is not enough.
        </p>

        <div className="mt-10 space-y-6">
          {[
            {
              title: "You enter a trade",
              text: "Your balance is ₦200,000 and your breach level is ₦160,000.",
            },

            {
              title: "Market goes against you",
              text: "Your floating loss pushes equity down to ₦160,000 or below.",
            },

            {
              title: "It later reverses",
              text: "The trade enters profit, but the account already touched the breach level earlier.",
            },

            {
              title: "Account is breached",
              text: "Once the breach level is touched, later profit does not remove the violation.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex gap-5 bg-[#111827] border border-white/5 rounded-3xl p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-400 text-black flex items-center justify-center text-xl font-bold shrink-0">
                {index + 1}
              </div>

              <div>
                <h3 className="text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-gray-400 leading-7">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WARNING BOX */}
      <div className="mt-20 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-[32px] p-8 md:p-12 text-black">
        <h2 className="text-5xl font-bold leading-tight">
          Set SL.
          <br />
          Trade Smart.
        </h2>

        <p className="mt-6 text-2xl font-semibold leading-10">
          Do not rely on luck or assume the market will reverse.
          Protect your account before the drawdown line is touched.
        </p>

        <p className="mt-8 text-2xl font-bold">
          Protect your account like a professional trader.
        </p>
      </div>

      {/* CHECKLIST */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Stop Loss protects you when you are offline",
            text: "You may not be watching the chart when the market spikes or moves fast.",
          },

          {
            title: "Drawdown is not based on final result only",
            text: "The checker can detect what happened while the trade was running.",
          },

          {
            title: "Your loss is balance plus floating",
            text: "Closed loss and open trade loss combine when checking drawdown.",
          },

          {
            title: "Never lose more than ₦40k from peak",
            text: "On a ₦200k account, your maximum loss from highest closed balance is ₦40k.",
          },
        ].map((tip, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-white/5 rounded-3xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-400 text-black flex items-center justify-center mb-5">
              <FaCheckCircle />
            </div>

            <h3 className="text-2xl font-semibold leading-10">
              {tip.title}
            </h3>

            <p className="mt-4 text-gray-400 leading-7">
              {tip.text}
            </p>
          </div>
        ))}
      </div>

      {/* GOOD NEWS */}
      <div className="mt-20 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/20 rounded-[32px] p-8 md:p-12 text-center">
        <h2 className="text-5xl font-bold">
          Good News! 💰
        </h2>

        <p className="mt-6 text-2xl text-gray-200 leading-10">
          Do you currently have 19%+ drawdown? 👀
        </p>

        <p className="mt-8 text-lg text-gray-400 leading-9 max-w-3xl mx-auto">
          You can quickly request for payout, get paid, then
          automatically receive a fresh MT5 login with your
          drawdown reset back to 0% 🏆
        </p>

        <button className="mt-10 bg-sky-400 hover:bg-sky-300 text-black px-10 py-4 rounded-2xl font-semibold text-lg transition">
          Request Payout
        </button>

        <p className="mt-8 text-xl text-sky-300 font-medium">
          Smart traders understand the risk 😉
        </p>
      </div>
    </div>
  </div>
)}
        </div>
      </section>
    </Layout>
  );
};

export default Rules;