import { Link } from "react-router-dom";
import {
  Wallet,
  Users,
  Gift,
  BadgeCheck,
  Share2,
  CheckCircle,
  ArrowRight,
  Crown,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

const AffiliateSections = () => {
  const benefits = [
    {
      icon: <Wallet size={30} />,
      title: "10% Commission",
      desc: "Earn commission every time someone purchases a funded account using your referral link.",
    },
    {
      icon: <Users size={30} />,
      title: "Unlimited Referrals",
      desc: "Invite as many traders as you want. There is absolutely no earning limit.",
    },
    {
      icon: <Gift size={30} />,
      title: "Bonus Rewards",
      desc: "Unlock free funded trading accounts when you reach referral milestones.",
    },
    {
      icon: <BadgeCheck size={30} />,
      title: "Real-Time Tracking",
      desc: "Monitor clicks, registrations, sales and commissions instantly from your dashboard.",
    },
  ];

  const rewards = [
    {
      referrals: "5",
      reward: "₦200,000 Account",
    },
    {
      referrals: "10",
      reward: "₦400,000 Account",
    },
    {
      referrals: "15",
      reward: "₦600,000 Account",
    },
    {
      referrals: "20",
      reward: "₦800,000 Account",
    },
  ];

  const leaderboard = [
    {
      name: "forex***",
      sales: 188,
      reward: "₦210,000",
    },
    {
      name: "charles***",
      sales: 163,
      reward: "₦185,000",
    },
    {
      name: "abubakar***",
      sales: 145,
      reward: "₦170,000",
    },
  ];

  const faq = [
    {
      q: "How much commission do I earn?",
      a: "You receive 10% commission on every successful funded account purchase.",
    },
    {
      q: "How do I withdraw?",
      a: "Your commissions become available inside your dashboard after qualifying purchases.",
    },
    {
      q: "Can I refer unlimited people?",
      a: "Yes. There is no referral limit.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#040816] text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-sky-500/20 blur-[140px] rounded-full"/>

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-600/10 blur-[160px] rounded-full"/>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]"/>

      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* WHY JOIN */}

        <section className="py-24">

          <div className="text-center">

            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">

              <Sparkles size={15}/>

              Affiliate Program

            </span>

            <h2 className="mt-8 text-4xl md:text-6xl font-black">

              Turn Your Network

              <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">

                Into Passive Income

              </span>

            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg">

              Recommend FundedNaira to traders around the world and earn
              commissions every time they purchase a funded trading account.

            </p>

          </div>

          {/* Live Stats */}

          <div className="mt-16 grid md:grid-cols-4 gap-6">

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">

              <TrendingUp className="text-green-400"/>

              <h3 className="mt-4 text-4xl font-black">

                ₦65M+

              </h3>

              <p className="text-slate-400 mt-2">

                Affiliate Earnings

              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">

              <Users className="text-sky-400"/>

              <h3 className="mt-4 text-4xl font-black">

                8,000+

              </h3>

              <p className="text-slate-400 mt-2">

                Active Affiliates

              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">

              <DollarSign className="text-yellow-400"/>

              <h3 className="mt-4 text-4xl font-black">

                10%

              </h3>

              <p className="text-slate-400 mt-2">

                Commission Rate

              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">

              <ShieldCheck className="text-cyan-400"/>

              <h3 className="mt-4 text-4xl font-black">

                24/7

              </h3>

              <p className="text-slate-400 mt-2">

                Dedicated Support

              </p>

            </div>

          </div>

          {/* Benefit Cards */}

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mt-20">

            {benefits.map((item,index)=>(

              <div
                key={index}
                className="group rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 transition duration-500 hover:-translate-y-3 hover:border-sky-400/40 hover:shadow-[0_0_60px_rgba(56,189,248,.12)]"
              >

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">

                  {item.icon}

                </div>

                <h3 className="mt-7 text-xl font-bold">

                  {item.title}

                </h3>

                <p className="mt-4 text-slate-400 leading-7">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </section>
                {/* HOW IT WORKS */}

        <section className="py-28">

          <div className="text-center">

            <span className="inline-flex px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sky-300">
              Simple Process
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-black">
              How It Works
            </h2>

            <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
              Start earning commissions in just four simple steps.
            </p>

          </div>

          <div className="relative mt-20">

            <div className="hidden lg:block absolute left-0 right-0 top-12 h-[2px] bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0"></div>

            <div className="grid lg:grid-cols-4 gap-10">

              {[
                {
                  icon:<Users size={30}/>,
                  title:"Create Account",
                  desc:"Register your affiliate account within minutes."
                },
                {
                  icon:<Share2 size={30}/>,
                  title:"Share Referral Link",
                  desc:"Promote your unique referral link anywhere."
                },
                {
                  icon:<Wallet size={30}/>,
                  title:"Referral Purchases",
                  desc:"Traders purchase funded accounts."
                },
                {
                  icon:<CheckCircle size={30}/>,
                  title:"Receive Commission",
                  desc:"Commissions appear instantly in your dashboard."
                }

              ].map((step,index)=>(

                <div
                  key={index}
                  className="relative text-center"
                >

                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,.35)]">

                    {step.icon}

                  </div>

                  <div className="mt-6 text-5xl font-black text-sky-500/20">

                    0{index+1}

                  </div>

                  <h3 className="mt-2 text-2xl font-bold">

                    {step.title}

                  </h3>

                  <p className="mt-4 text-slate-400 leading-7">

                    {step.desc}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>





        {/* LIVE COMMISSION */}

        <section className="py-12">

          <div className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 overflow-hidden">

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div>

                <h2 className="text-3xl font-black">

                  Live Affiliate Activity

                </h2>

                <p className="text-slate-400 mt-2">

                  Recent affiliate commissions

                </p>

              </div>

              <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">

                ● Live

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {[
                {
                  name:"Ahmed",
                  amount:"₦12,000",
                  time:"12 seconds ago"
                },
                {
                  name:"Grace",
                  amount:"₦6,500",
                  time:"1 minute ago"
                },
                {
                  name:"Musa",
                  amount:"₦25,000",
                  time:"3 minutes ago"
                }

              ].map((item,index)=>(

                <div
                  key={index}
                  className="rounded-2xl bg-[#0d1325] border border-white/10 p-6 hover:border-sky-400 transition"
                >

                  <div className="flex justify-between">

                    <h3 className="font-bold">

                      {item.name}

                    </h3>

                    <span className="text-green-400 font-semibold">

                      +{item.amount}

                    </span>

                  </div>

                  <p className="mt-4 text-slate-400 text-sm">

                    Commission Received

                  </p>

                  <p className="mt-2 text-xs text-slate-500">

                    {item.time}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>





        {/* REWARD MILESTONES */}

        <section className="py-28">

          <div className="text-center">

            <h2 className="text-4xl md:text-6xl font-black">

              Unlock Bigger Rewards

            </h2>

            <p className="mt-5 text-slate-400">

              Every milestone unlocks a FREE funded account.

            </p>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

            {rewards.map((reward,index)=>(

              <div
                key={index}
                className="group rounded-[30px] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-blue-500/5 backdrop-blur-xl p-8 text-center hover:-translate-y-3 transition duration-500 hover:shadow-[0_0_60px_rgba(56,189,248,.18)]"
              >

                <Gift
                  size={42}
                  className="mx-auto text-sky-400"
                />

                <h2 className="mt-8 text-5xl font-black">

                  {reward.referrals}

                </h2>

                <p className="text-slate-400">

                  Successful Referrals

                </p>

                <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 py-4">

                  <p className="text-sky-300 font-bold">

                    {reward.reward}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>





        {/* DASHBOARD PREVIEW */}

        <section className="py-20">

          <div className="rounded-[35px] border border-white/10 bg-gradient-to-br from-[#0d1325] to-[#10182f] p-10">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div>

                <span className="px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">

                  Dashboard Preview

                </span>

                <h2 className="mt-6 text-5xl font-black">

                  Everything

                  <span className="block text-sky-400">

                    In One Dashboard

                  </span>

                </h2>

                <p className="mt-6 text-slate-400 leading-8">

                  Track referrals, earnings, withdrawals,
                  conversion rate and performance in real time.

                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8">

                <div className="grid grid-cols-2 gap-5">

                  <div className="rounded-2xl bg-white/5 p-6">

                    <p className="text-slate-400">

                      Earnings

                    </p>

                    <h3 className="mt-3 text-3xl font-black">

                      ₦540K

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-white/5 p-6">

                    <p className="text-slate-400">

                      Referrals

                    </p>

                    <h3 className="mt-3 text-3xl font-black">

                      218

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-white/5 p-6">

                    <p className="text-slate-400">

                      Conversion

                    </p>

                    <h3 className="mt-3 text-3xl font-black">

                      21%

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-white/5 p-6">

                    <p className="text-slate-400">

                      Pending

                    </p>

                    <h3 className="mt-3 text-3xl font-black">

                      ₦18K

                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
                {/* TOP AFFILIATES */}

        <section className="py-28">

          <div className="text-center">

            <span className="inline-flex px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              Leaderboard
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-black">
              Top Performing Affiliates
            </h2>

            <p className="mt-5 text-slate-400">
              Our highest earning partners this month.
            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-16">

            {leaderboard.map((user, index) => (

              <div
                key={index}
                className={`relative rounded-[32px] border backdrop-blur-2xl p-8 transition duration-500 hover:-translate-y-3
                ${
                  index === 0
                    ? "border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/5"
                    : "border-white/10 bg-white/5 hover:border-sky-400/30"
                }`}
              >

                {index === 0 && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-yellow-500 text-black font-bold text-sm shadow-lg">
                    🏆 #1 Affiliate
                  </div>
                )}

                <div className="flex justify-center">

                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center
                    ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : "bg-gradient-to-br from-sky-500 to-blue-600"
                    }`}
                  >
                    <Crown size={34} />
                  </div>

                </div>

                <h3 className="mt-8 text-center text-2xl font-black">
                  {user.name}
                </h3>

                <div className="mt-8 space-y-4">

                  <div className="flex justify-between text-slate-400">
                    <span>Sales</span>
                    <span className="text-white font-semibold">
                      {user.sales}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Total Earned</span>
                    <span className="text-green-400 font-bold">
                      {user.reward}
                    </span>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>





        {/* FAQ */}

        <section className="py-28">

          <div className="text-center">

            <span className="inline-flex px-5 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
              Questions
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-black">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="max-w-4xl mx-auto mt-16 space-y-6">

            {faq.map((item, index) => (

              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-sky-400/30 transition"
              >

                <h3 className="text-xl font-bold">
                  {item.q}
                </h3>

                <p className="mt-4 text-slate-400 leading-8">
                  {item.a}
                </p>

              </div>

            ))}

          </div>

        </section>





        {/* CTA */}

        <section className="pb-28">

          <div className="relative overflow-hidden rounded-[40px] border border-sky-500/20 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 p-14 md:p-20">

            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"/>

            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl"/>

            <div className="relative text-center">

              <h2 className="text-4xl md:text-6xl font-black">
                Ready To Start
                <span className="block">
                  Earning Passive Income?
                </span>
              </h2>

              <p className="mt-6 max-w-2xl mx-auto text-sky-100 text-lg leading-8">
                Join thousands of affiliates promoting FundedNaira.
                Share your referral link, grow your community,
                and earn commissions every day.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">

                <Link
                  to="/auth"
                  className="inline-flex justify-center items-center gap-3 px-10 py-5 rounded-2xl bg-white text-sky-700 font-bold hover:scale-105 transition"
                >
                  Become an Affiliate
                  <ArrowRight size={20}/>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex justify-center items-center px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/10 transition"
                >
                  Contact Sales
                </Link>

              </div>

            </div>

          </div>

        </section>

      </div>

    </section>

  );
};

export default AffiliateSections;