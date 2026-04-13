const features = [
  {
    title: "Scalable Systems",
    desc: "We build applications designed to grow with your business.",
    icon: "⚡",
  },
  {
    title: "Clean Code",
    desc: "Maintainable and structured code for long-term success.",
    icon: "💻",
  },
  {
    title: "Modern UI/UX",
    desc: "Beautiful, intuitive designs that enhance user experience.",
    icon: "🎨",
  },
  {
    title: "Fast Performance",
    desc: "Optimized systems that load fast and run smoothly.",
    icon: "🚀",
  },
];
const Features = () => {
  return (
    <section className="py-14 px-6">
      
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Why Choose <span className="text-sky-400">PreCodeLink</span>
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          We don’t just build websites — we create scalable digital solutions
          that help businesses grow faster and smarter.
        </p>

        {/* Grid */}
        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {features.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#111827] border border-gray-800 hover:border-sky-400 transition duration-300 hover:-translate-y-2"
            >
              
              {/* Icon */}
              <div className="text-3xl mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-gray-400 text-sm">
                {item.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Features;