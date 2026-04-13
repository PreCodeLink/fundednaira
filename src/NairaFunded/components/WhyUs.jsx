import { FaMoneyBillWave, FaChartLine, FaShieldAlt, FaHeadset } from "react-icons/fa";

const WhyUs = () => {
  const features = [
    {
      icon: <FaMoneyBillWave size={28} />,
      title: "Fast Naira Payouts",
      desc: "Get paid quickly in Naira without delays or conversion stress.",
    },
    {
      icon: <FaChartLine size={28} />,
      title: "Up to N800,000 Capital",
      desc: "Scale your trading with high capital and grow without limits.",
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: "Zero Personal Risk",
      desc: "Trade confidently — you never risk your own money.",
    },
    {
      icon: <FaHeadset size={28} />,
      title: "24/7 Support",
      desc: "Our team is always available to support your trading journey.",
    },
  ];

  return (
    <section className="bg-[#0B0F19] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold">
          Why Choose Us
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          We are Nigeria’s most trusted Naira-funded prop firm built to help traders succeed with real capital and fast payouts.
        </p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-primary transition duration-300"
            >
              <div className="text-primary mb-4">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyUs;