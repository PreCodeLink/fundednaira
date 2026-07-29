import {
  Wallet,
  Trophy,
  Users,
  TrendingUp,
} from "lucide-react";

const AffiliateStats = () => {
  const stats = [
    {
      icon: <Wallet size={30} />,
      title: "₦65,738,859",
      subtitle: "Total Commission Paid",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp size={30} />,
      title: "₦55,688,379",
      subtitle: "Total Affiliate Payout",
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: <Users size={30} />,
      title: "5,000+",
      subtitle: "Active Affiliates",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Trophy size={30} />,
      title: "188 Sales",
      subtitle: "Highest Referral Record",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <section className="relative bg-[#050816] py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">

        <div className="absolute left-20 top-10 w-72 h-72 rounded-full bg-sky-500/10 blur-[120px]" />

        <div className="absolute right-20 bottom-0 w-72 h-72 rounded-full bg-purple-500/10 blur-[120px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-flex px-4 py-2 rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300 text-sm">

            LIVE PLATFORM STATS

          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-black text-white">

            Trusted by Thousands

          </h2>

          <p className="mt-5 text-slate-400 text-lg">

            Join one of Nigeria's fastest-growing affiliate programs and
            start earning commissions with every successful referral.

          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-7 mt-16 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => (

            <div
              key={index}
              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-2xl
              p-8
              transition-all
              duration-500
              hover:-translate-y-3
              hover:border-sky-400/30
              "
            >

              {/* Glow */}

              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-gradient-to-br ${item.color}`}
              />

              {/* Icon */}

              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-xl`}
              >

                {item.icon}

              </div>

              {/* Number */}

              <h3 className="relative mt-8 text-4xl font-black text-white">

                {item.title}

              </h3>

              <p className="relative mt-2 text-slate-400">

                {item.subtitle}

              </p>

              {/* Bottom line */}

              <div
                className={`mt-8 h-1 rounded-full bg-gradient-to-r ${item.color}`}
              />

            </div>

          ))}

        </div>

        {/* Bottom Banner */}

        <div className="mt-20 rounded-[32px] border border-sky-400/20 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-cyan-500/10 backdrop-blur-xl p-8 md:p-10">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div>

              <h3 className="text-3xl font-bold text-white">

                Ready to Start Earning?

              </h3>

              <p className="mt-3 text-slate-400 max-w-2xl">

                Share your referral link, invite traders, and earn
                <span className="text-sky-400 font-semibold">
                  {" "}10% commission{" "}
                </span>
                every time someone purchases a FundedNaira account.

              </p>

            </div>

            <div className="flex flex-wrap justify-center gap-4">

              <div className="rounded-2xl bg-white/5 px-6 py-5 text-center">

                <h4 className="text-3xl font-bold text-white">

                  10%

                </h4>

                <p className="text-sm text-slate-400">

                  Commission

                </p>

              </div>

              <div className="rounded-2xl bg-white/5 px-6 py-5 text-center">

                <h4 className="text-3xl font-bold text-green-400">

                  Unlimited

                </h4>

                <p className="text-sm text-slate-400">

                  Earnings

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AffiliateStats;