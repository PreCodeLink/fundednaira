import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Wallet,
  Gift,
  BadgeCheck,
} from "lucide-react";

const AffiliateHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#040816] pt-36 pb-24">

      {/* Aurora Background */}
      <div className="absolute inset-0">

        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[160px]" />

        <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-300">

              <BadgeCheck size={16} />

              Trusted Affiliate Program

            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-black leading-none">

              Earn While

              <br />

              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">

                Traders Trade

              </span>

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">

              Join the FundedNaira Affiliate Program and earn a
              <span className="font-semibold text-white"> 10% commission </span>
              every time someone purchases a trading account through your
              referral link.

            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">

              <Link
                to="/auth"
                className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
              >

                Become Affiliate

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />

              </Link>

              <Link
                to="/auth"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center font-medium backdrop-blur-xl transition hover:border-sky-400/40 hover:bg-white/10"
              >

                Affiliate Dashboard

              </Link>

            </div>

            {/* Mini Stats */}

            <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">

              <div>

                <h3 className="text-2xl font-bold text-white">

                  10%

                </h3>

                <p className="text-sm text-slate-400">

                  Commission

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-white">

                  ₦65M+

                </h3>

                <p className="text-sm text-slate-400">

                  Paid

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-white">

                  5K+

                </h3>

                <p className="text-sm text-slate-400">

                  Affiliates

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-white">

                  24/7

                </h3>

                <p className="text-sm text-slate-400">

                  Support

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-sky-500/20 to-cyan-400/10 blur-3xl" />

            <div className="relative rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

              <h2 className="text-2xl font-bold">

                Affiliate Dashboard

              </h2>

              <p className="mt-2 text-slate-400">

                Live Performance

              </p>

              <div className="mt-8 space-y-5">

                <div className="rounded-2xl bg-white/5 p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Users className="text-sky-400" />

                      <span>Total Referrals</span>

                    </div>

                    <span className="font-bold">

                      128

                    </span>

                  </div>

                </div>

                <div className="rounded-2xl bg-white/5 p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Wallet className="text-green-400" />

                      <span>Commission</span>

                    </div>

                    <span className="font-bold text-green-400">

                      ₦480,000

                    </span>

                  </div>

                </div>

                <div className="rounded-2xl bg-white/5 p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Gift className="text-yellow-400" />

                      <span>Bonus</span>

                    </div>

                    <span className="font-bold text-yellow-400">

                      ₦800K Account

                    </span>

                  </div>

                </div>

              </div>

              <div className="mt-8">

                <div className="flex justify-between text-sm">

                  <span className="text-slate-400">

                    Monthly Goal

                  </span>

                  <span>

                    82%

                  </span>

                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">

                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-sky-400 to-cyan-400" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AffiliateHero;