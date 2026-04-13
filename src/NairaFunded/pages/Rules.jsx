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
      icon: <FaChartLine />,
      title: "Profit Target",
      desc: "Traders must meet the required profit target based on their selected account size before progressing to the next stage or qualifying for funding.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Maximum Drawdown",
      desc: "Your total drawdown must not exceed 10% of the account balance at any time. Proper risk management is required throughout the challenge.",
    },
    {
      icon: <FaPercent />,
      title: "Profit Split",
      desc: "Eligible funded traders can earn up to 80% profit split based on the account structure and payout terms.",
    },
    {
      icon: <FaClock />,
      title: "Minimum Trading Days",
      desc: "A minimum of 5 trading days is required before a trader can qualify for the next stage or a funded account.",
    },
    {
      icon: <FaNewspaper />,
      title: "News Trading",
      desc: "Trading during high-impact news events may be restricted depending on the account type. Always review the account conditions carefully.",
    },
    {
      icon: <FaBalanceScale />,
      title: "Consistency Rule — 20%",
      desc: "Your biggest single trading day must not account for more than 20% of your total accumulated profit. This rule is designed to ensure steady and disciplined performance rather than one unusually large trading day.",
    },
    {
      icon: <FaWallet />,
      title: "Maximum Payout — 50%",
      desc: "You may withdraw up to 50% of your total profit in a single payout request. The remaining profit stays in the account based on the payout structure.",
    },
    {
      icon: <FaHourglassHalf />,
      title: "Minimum Trade Duration",
      desc: "All trades must be held for at least 2 minutes to be considered valid. Very short-duration trades may be treated as violations of the trading rules.",
    },
    {
      icon: <FaBolt />,
      title: "Active Trading Requirement",
      desc: "You must place at least one trade every 7 days to keep your account active. Inactive accounts may be flagged or restricted.",
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
      <section className="bg-[#0B0F19] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-sky-500 opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold">Trading Rules</h1>
            <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg">
              Please review all trading rules carefully. These guidelines are
              designed to promote discipline, consistency, risk control, and
              long-term trading performance.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl hover:border-sky-400 transition"
              >
                <div className="text-sky-400 text-xl mb-4">{rule.icon}</div>

                <h2 className="text-lg font-semibold">{rule.title}</h2>

                <p className="text-gray-400 mt-2 text-sm leading-7">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Consistency Rule Explained
            </h2>

            <p className="text-gray-400 leading-8">
              The 20% consistency rule means that your biggest single trading day
              must not be more than 20% of your total profit. This rule prevents
              traders from passing the challenge based on one oversized day and
              encourages balanced, repeatable performance.
            </p>

            <div className="mt-6 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5">
              <p className="text-gray-300 leading-8">
                <span className="text-sky-400 font-semibold">Example:</span>{" "}
                If your total profit is <span className="text-white">$100</span>,
                then 20% of that is <span className="text-white">$20</span>.
                This means your biggest single day profit must be{" "}
                <span className="text-white">$20 or less</span>.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {consistencyExamples.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 ${exampleCardClass[item.color]}`}
                >
                  <h3 className={`text-lg font-semibold mb-3 ${exampleTitleClass[item.color]}`}>
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-300">
                    {item.text.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl text-center">
            <p className="text-gray-300 leading-8">
              Violating any of the above rules may result in account suspension,
              payout restriction, or account termination. Traders are expected
              to maintain proper discipline and responsible risk management at
              all times.
            </p>
          </div>

          <div className="mt-8 bg-red-900/20 border border-red-800 p-6 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
              <FaExclamationTriangle />
              <h3>Risk Disclaimer</h3>
            </div>
            <p className="mt-3 text-gray-400 text-sm max-w-3xl mx-auto leading-7">
              Trading involves substantial risk and may not be suitable for
              every individual. Past performance does not guarantee future
              results. You are strongly advised to trade responsibly and stay
              within approved risk limits at all times.
            </p>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/auth"
              className="inline-block bg-sky-400 px-10 py-4 rounded-xl text-lg font-semibold text-black hover:scale-105 transition"
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