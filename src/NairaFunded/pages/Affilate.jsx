import { Link } from "react-router-dom";
import Layout from "../layout/Layout";

const AffiliatePromo = () => {
  return (
   <Layout>
     <section className="bg-[#0B0F19] text-white py-24 px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-primary opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Earn Passive Income <br />
            <span className="text-primary">With Our Affiliate Program</span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Share your referral link and earn commissions every time traders buy accounts.
            The more you refer, the more you earn.
          </p>
        </div>

        {/* Highlight */}
        <div className="mt-12 bg-gradient-to-r from-primary/20 to-purple-600/20 border border-gray-800 rounded-2xl p-6 text-center backdrop-blur">
          <p className="text-xl font-semibold text-primary">
            BONUS: Up to ₦5.9M Trading Accounts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-400 text-sm">Top Affiliate</p>
            <h3 className="mt-2 font-semibold text-lg">
              forex*** (#401966)
            </h3>
            <p className="text-gray-400 text-sm mt-1">188 Sales</p>
            <p className="text-primary mt-2 font-medium">₦20,000 Reward</p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl text-center">
            <p className="text-gray-400 text-sm">Total Commissions</p>
            <h2 className="text-2xl font-bold mt-2">
              ₦65,738,859
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl text-center">
            <p className="text-gray-400 text-sm">Total Paid Out</p>
            <h2 className="text-2xl font-bold mt-2">
              ₦55,688,379
            </h2>
          </div>

        </div>

        {/* Live Activity */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl">
            <p className="text-gray-400 text-sm">Last Payout</p>
            <h3 className="mt-2 font-semibold">charl****</h3>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl">
            <p className="text-gray-400 text-sm">Last Commission</p>
            <h3 className="mt-2">11:04pm (36 minutes ago)</h3>
          </div>

        </div>

        {/* How it works */}
        <div className="mt-12 bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl text-center">
          <p className="text-gray-300">
            Earn <span className="text-primary font-semibold">10% commission</span> on every account opened by your referrals and continue earning whenever they purchase more.
          </p>
        </div>

        {/* Bonuses */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-center mb-6">
            Unlock Extra Bonuses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {[
              "5 referrals → ₦200k free account",
              "10 referrals → ₦400k free account",
              "15 referrals → ₦600k free account",
              "20 referrals → ₦800k free account",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl hover:border-primary transition"
              >
                ✅ {item}
              </div>
            ))}

          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6 text-lg">
            Start earning today and grow with us 🚀
          </p>

          <button className="bg-sky-400 px-12 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition">
           <Link to='/auth'> Register or Login Now</Link>
          </button>
        </div>

      </div>
    </section>
   </Layout>
  );
};

export default AffiliatePromo;