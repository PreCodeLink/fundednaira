import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

const Hero = () => {
  const stats = [
    { value: "₦50M+", label: "Paid out" },
    { value: "10K+", label: "Traders" },
    { value: "80%", label: "Profit split" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="relative min-h-screen bg-[#050816] text-white overflow-hidden pt-24 lg:pt-28">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />

      {/* Floating orbs */}
      <div className="absolute top-24 right-[8%] w-40 h-40 lg:w-72 lg:h-72 rounded-full bg-sky-500/10 blur-3xl animate-pulse [animation-duration:6s]" />
      <div className="absolute bottom-10 left-[5%] w-32 h-32 lg:w-64 lg:h-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse [animation-duration:8s]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[85vh]">

          {/* Left Content */}
          <div className="animate-[fadeUp_0.7s_ease-out] text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Nigeria's funded trading platform
            </div>

            <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              Get funded
              <br />
              up to
              <span className="relative inline-block block mt-2 lg:block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 bg-[length:200%_auto] animate-[shine_4s_linear_infinite]">
                ₦800,000
              </span>
            </h1>

            <p className="mt-8 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Trade with FundedNaira capital, receive payouts in naira,
              keep up to 80% of profits, and scale your trading journey
              without risking personal capital.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">

              <Link
                to="/auth"
                className="
                  group relative w-full sm:w-auto px-8 py-4 rounded-2xl
                  bg-gradient-to-r from-sky-500 to-blue-600
                  font-semibold text-center overflow-hidden
                  shadow-xl shadow-sky-500/20
                  transition-all duration-300
                  hover:shadow-sky-400/40 hover:-translate-y-0.5
                "
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Buy account
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                to="/rules"
                className="
                  w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5
                  backdrop-blur-xl text-center font-medium
                  transition-all duration-300
                  hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5
                "
              >
                View rules
              </Link>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 mt-14 text-center lg:text-left">
              {stats.map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <h3 className="text-3xl font-bold transition-colors duration-300 group-hover:text-sky-300">
                    {stat.value}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                  <div className="mt-2 h-px w-0 bg-gradient-to-r from-sky-400 to-transparent transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>

          </div>

          {/* Right Side Dashboard */}
          <div className="relative">

            {/* Ambient glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-sky-500/20 via-transparent to-purple-500/10 rounded-[2rem] blur-2xl" />

            <div
              className="
                relative bg-white/5 backdrop-blur-2xl border border-white/10
                rounded-3xl p-5 sm:p-6 shadow-2xl
                transition-transform duration-500
                hover:-translate-y-1
              "
            >

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-slate-400 text-sm">Funded account</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1">₦800,000</h3>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.07]">
                  <p className="text-slate-400 text-sm">Profit target</p>
                  <h4 className="text-2xl font-bold mt-2">₦80,000</h4>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.07]">
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    Current profit
                    <TrendingUp size={13} className="text-green-400" />
                  </p>
                  <h4 className="text-2xl font-bold mt-2 text-green-400">₦42,500</h4>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-8">

                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-400">Challenge progress</span>
                  <span className="text-sky-400 font-medium">53%</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[53%] bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full relative overflow-hidden">
                    <span className="absolute inset-0 bg-white/30 animate-[shimmer_2.5s_ease-in-out_infinite]" />
                  </div>
                </div>

              </div>

              {/* Bottom */}
              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">

                <div className="text-center">
                  <h4 className="font-bold text-lg">No Minimum</h4>
                  <p className="text-xs text-slate-400">Trading days</p>
                </div>

                <div className="text-center border-x border-white/10">
                  <h4 className="font-bold text-lg">20%</h4>
                  <p className="text-xs text-slate-400">Drawdown</p>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-lg">80%</h4>
                  <p className="text-xs text-slate-400">Profit split</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;