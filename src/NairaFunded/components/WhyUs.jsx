import {
  FaMoneyBillWave,
  FaChartLine,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const WhyUs = () => {
  const features = [
    {
      icon: <FaMoneyBillWave />,
      title: "Fast Naira Payouts",
      desc: "Receive your payouts quickly in Naira without conversion fees or unnecessary delays.",
    },
    {
      icon: <FaChartLine />,
      title: "Up To ₦800,000 Capital",
      desc: "Trade larger accounts and grow faster with scalable funding designed for serious traders.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Zero Personal Risk",
      desc: "Protect your personal funds while trading with our capital under clear risk rules.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "Our dedicated support team is available whenever you need assistance.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050816] py-24">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">
            WHY FUNDEDNAIRA
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-white">
            Built For
            <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Serious Traders
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Everything you need to trade confidently with funded capital,
            receive fast payouts, and scale your trading career.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {features.map((item, index) => (
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
              backdrop-blur-xl
              p-8
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-sky-400/40
              hover:bg-white/10
              "
            >

              {/* Glow */}
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* Icon */}
              <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-sky-500
                to-blue-600
                text-white
                text-2xl
                shadow-lg
                shadow-sky-500/20
              ">
                {item.icon}
              </div>

              <h3 className="mt-8 text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-7">
                {item.desc}
              </p>

              {/* Bottom Line */}
              <div className="mt-8 h-1 w-0 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-500 group-hover:w-full" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyUs;