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
      value: "80% Trader",
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

<div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-slate-900 via-[#081120] to-[#050816] px-6 py-16 md:px-12 md:py-24">

  {/* Background Glow */}
  <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-sky-500/20 blur-[120px]" />
  <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

  {/* Grid */}
  <div className="relative grid items-center gap-16 lg:grid-cols-2">

    {/* LEFT */}

    <div>

      <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2 text-sm text-sky-300">

        <FaCheckCircle />

        Trusted by Nigerian Traders

      </div>

      <h1 className="mt-8 text-5xl font-black leading-none md:text-7xl">

        Trade With

        <br />

        <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">

          Simple Rules

        </span>

      </h1>

      <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">

        No confusing restrictions.

        No daily drawdown.

        Just simple trading rules designed to help you become a funded trader and receive payouts quickly.

      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/auth"
          className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-400 px-8 py-4 font-semibold text-black transition hover:scale-105"
        >

          Buy Challenge

          <FaArrowRight className="transition group-hover:translate-x-1" />

        </Link>

        <Link
          to="/buy-acc"
          className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center transition hover:border-sky-400/40 hover:bg-white/10"
        >

          View Plans

        </Link>

      </div>

    </div>

    {/* RIGHT */}

    <div>

      <div className="rounded-[32px] border border-sky-500/20 bg-white/5 p-8 backdrop-blur-xl">

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">

            <FaShieldAlt size={30} />

          </div>

          <div>

            <p className="text-slate-400">

              Trading Challenge

            </p>

            <h2 className="text-3xl font-bold">

              FundedNaira

            </h2>

          </div>

        </div>

        <div className="space-y-5">

          {[
            ["Profit Target", "10%"],
            ["Maximum Drawdown", "20%"],
            ["Daily Drawdown", "None"],
            ["Minimum Trading Days", "No Minimum"],
            ["Profit Split", "80%"],
            ["Payout Time", "Within 5 Minutes"],
          ].map(([title, value]) => (

            <div
              key={title}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0f172a] px-5 py-4"
            >

              <span className="text-slate-400">

                {title}

              </span>

              <span className="font-bold text-sky-400">

                {value}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

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
  <div className="mt-16">

    {/* Section Heading */}
    <div className="text-center max-w-3xl mx-auto mb-14">
      <span className="inline-flex px-4 py-2 rounded-full border border-sky-400/20 bg-sky-500/10 text-sky-300 text-sm font-medium">
        Trading Rules
      </span>

      <h2 className="mt-5 text-4xl md:text-5xl font-bold">
        Everything You Need
        <span className="text-sky-400"> To Stay Funded</span>
      </h2>

      <p className="mt-5 text-gray-400 leading-8">
        We've simplified prop trading with only a few important rules.
        Follow these guidelines to protect your account and receive payouts.
      </p>
    </div>

    {/* Cards */}
    <div className="grid lg:grid-cols-2 gap-8">

      {rulesData.map((rule, index) => (
        <div
          key={index}
          className="
          group
          relative
          overflow-hidden
          rounded-[30px]
          border border-white/10
          bg-gradient-to-br
          from-white/[0.06]
          to-white/[0.02]
          backdrop-blur-xl
          p-8
          hover:border-sky-400/40
          hover:-translate-y-2
          transition-all
          duration-500
        "
        >

          {/* Glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-sky-500/10 blur-3xl rounded-full group-hover:bg-sky-500/20 transition"></div>

          {/* Number */}
          <div className="absolute top-6 right-6 text-6xl font-black text-white/5">
            0{index + 1}
          </div>

          {/* Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-black text-2xl shadow-xl">
            {rule.icon}
          </div>

          {/* Title */}
          <h3 className="mt-8 text-2xl font-bold">
            {rule.title}
          </h3>

          {/* Line */}
          <div className="mt-4 h-px w-20 bg-gradient-to-r from-sky-400 to-transparent"></div>

          {/* Description */}
          <div className="mt-6 text-gray-400 leading-8">
            {rule.desc}
          </div>

        </div>
      ))}

    </div>

    {/* Bottom Notice */}
    <div className="mt-16 rounded-[28px] border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 p-8 text-center">

      <h3 className="text-2xl font-bold">
        Trade Like a Professional
      </h3>

      <p className="mt-4 max-w-3xl mx-auto text-gray-300 leading-8">
        Every rule is designed to help you develop consistent trading habits,
        manage risk properly, and qualify for fast payouts without unnecessary restrictions.
      </p>

    </div>

  </div>
)}
          </div>
{/* HOW IT WORKS TAB */}
{activeTab === "how" && (
  <div className="mt-16">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">

      <span className="inline-flex px-4 py-2 rounded-full border border-sky-400/20 bg-sky-500/10 text-sky-300 text-sm font-medium">
        Trading Journey
      </span>

      <h2 className="mt-5 text-4xl md:text-5xl font-bold">
        From Purchase
        <span className="text-sky-400"> to Your First Payout</span>
      </h2>

      <p className="mt-5 text-gray-400 leading-8">
        Getting funded is simple. Complete each milestone and start
        earning real payouts.
      </p>

    </div>

    {/* Timeline */}

    <div className="relative mt-20 max-w-5xl mx-auto">

      {/* Vertical Line */}
      <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-400 via-cyan-500 to-transparent"></div>

      {[
        {
          title: "Purchase an Account",
          desc: "Choose the account size that matches your trading experience and objectives.",
          icon: "🛒",
        },
        {
          title: "Trade & Reach 10%",
          desc: "Trade responsibly and hit the required profit target while respecting all trading rules.",
          icon: "📈",
        },
        {
          title: "Complete Verification",
          desc: "Verify your identity with your bank account details and complete the KYC process.",
          icon: "🛡️",
        },
        {
          title: "Receive Your Funded Account",
          desc: "You'll receive fresh MT5 credentials and begin trading funded capital.",
          icon: "💼",
        },
        {
          title: "Request Your Payout",
          desc: "Withdraw your profit quickly with our fast payout processing system.",
          icon: "💰",
        },
      ].map((step, index) => (

        <div
          key={index}
          className="relative flex gap-8 pb-12 group"
        >

          {/* Circle */}

          <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition">

            {step.icon}

          </div>

          {/* Card */}

          <div className="flex-1 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-7 hover:border-sky-400/40 hover:-translate-y-1 transition">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                {step.title}
              </h3>

              <span className="text-sky-400 font-bold">
                0{index + 1}
              </span>

            </div>

            <p className="mt-5 text-gray-400 leading-8">
              {step.desc}
            </p>

          </div>

        </div>

      ))}

    </div>

    {/* Success Banner */}

    <div className="mt-20 rounded-[32px] overflow-hidden border border-green-500/20 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10">

      <div className="p-10 md:p-14 text-center">

        <div className="text-6xl">
          🎉
        </div>

        <h3 className="mt-6 text-4xl font-bold">
          Congratulations!
        </h3>

        <p className="mt-6 max-w-3xl mx-auto text-gray-300 leading-8">
          After completing the challenge and passing verification,
          you'll become an official FundedNaira trader with access
          to funded capital and fast profit withdrawals.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <div className="px-6 py-4 rounded-2xl bg-black/20 border border-white/10">
            <p className="text-gray-400 text-sm">
              Profit Target
            </p>

            <h4 className="mt-2 text-2xl font-bold text-sky-400">
              10%
            </h4>
          </div>

          <div className="px-6 py-4 rounded-2xl bg-black/20 border border-white/10">
            <p className="text-gray-400 text-sm">
              Max Drawdown
            </p>

            <h4 className="mt-2 text-2xl font-bold text-sky-400">
              20%
            </h4>
          </div>

          <div className="px-6 py-4 rounded-2xl bg-black/20 border border-white/10">
            <p className="text-gray-400 text-sm">
              Payout Time
            </p>

            <h4 className="mt-2 text-2xl font-bold text-green-400">
              5 Minutes
            </h4>
          </div>

        </div>

      </div>

    </div>

  </div>
)}
{/* PAYOUT TAB */}
{activeTab === "payout" && (
  <div className="mt-16">

    {/* Header */}

    <div className="text-center max-w-3xl mx-auto">

      <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
        💸 Fast Withdrawals
      </span>

      <h2 className="mt-6 text-4xl md:text-5xl font-bold">
        Get Paid
        <span className="text-green-400"> Fast & Securely</span>
      </h2>

      <p className="mt-5 text-gray-400 leading-8">
        We believe traders deserve quick withdrawals.
        Our payout system is designed to be transparent,
        reliable and simple.
      </p>

    </div>

    {/* Metrics */}

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-16">

      {[
        {
          title: "Minimum Profit",
          value: "10%",
          icon: "📈",
          color: "green",
        },
        {
          title: "Maximum Cap",
          value: "50%",
          icon: "🚀",
          color: "blue",
        },
        {
          title: "Profit Split",
          value: "80%",
          icon: "💰",
          color: "yellow",
        },
        {
          title: "Processing",
          value: "12 Hours",
          icon: "⚡",
          color: "purple",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-7 hover:-translate-y-2 hover:border-green-400/30 transition"
        >

          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
            ${
              item.color === "green"
                ? "bg-green-500/15"
                : item.color === "blue"
                ? "bg-sky-500/15"
                : item.color === "yellow"
                ? "bg-yellow-500/15"
                : "bg-purple-500/15"
            }`}
          >
            {item.icon}
          </div>

          <p className="mt-8 text-gray-400">
            {item.title}
          </p>

          <h3 className="mt-2 text-4xl font-bold">
            {item.value}
          </h3>

        </div>

      ))}

    </div>

    {/* Split Card */}

    <div className="mt-20 grid lg:grid-cols-2 gap-8">

      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-10">

        <p className="text-green-400 font-semibold">
          PROFIT DISTRIBUTION
        </p>

        <h2 className="mt-5 text-5xl font-black">
          80%
        </h2>

        <p className="text-2xl mt-2">
          Goes To You
        </p>

        <div className="mt-8 h-4 rounded-full bg-white/10 overflow-hidden">

          <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>

        </div>

        <p className="mt-8 text-gray-400 leading-8">
          Keep the majority of your trading profits while we provide
          the capital and infrastructure.
        </p>

      </div>

      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-sky-500/10 to-cyan-500/5 p-10">

        <p className="text-sky-400 font-semibold">
          PAYOUT POLICY
        </p>

        <div className="space-y-5 mt-8">

          {[
            "Minimum payout starts from 10% profit.",
            "Maximum payout cap is 50% profit.",
            "Withdrawals processed within 12 hours.",
            "Payments sent directly to your bank account.",
            "Fast approval after verification.",
          ].map((item, i) => (

            <div
              key={i}
              className="flex gap-4 items-start"
            >

              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-black text-sm font-bold">
                ✓
              </div>

              <p className="text-gray-300">
                {item}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

    {/* Warning */}

    <div className="mt-20 rounded-[32px] border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-10">

      <div className="flex items-start gap-6">

        <div className="text-5xl">
          ⚠️
        </div>

        <div>

          <h3 className="text-3xl font-bold text-yellow-300">
            Important Notice
          </h3>

          <p className="mt-5 text-gray-300 leading-8">
            Making more than the payout cap is <strong>not a rule violation.</strong>
            During payout processing, any profit above the current maximum payout
            limit may be removed according to our payout policy.
          </p>

        </div>

      </div>

    </div>

    {/* CTA */}

    <div className="mt-20 rounded-[40px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-[1px]">

      <div className="rounded-[40px] bg-[#081018] px-10 py-16 text-center">

        <h2 className="text-5xl font-bold">
          Ready To Get Paid?
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-gray-400 leading-8">
          Complete your trading challenge, stay within the rules,
          and enjoy one of the fastest payout systems available.
        </p>

        <Link
          to="/buy-acc"
          className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-bold transition"
        >
          Start Trading
          <FaArrowRight />
        </Link>

      </div>

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