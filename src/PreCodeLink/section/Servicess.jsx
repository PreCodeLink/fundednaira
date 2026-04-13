const services = [
  {
    title: "Web Development",
    desc: "Modern, responsive websites and web applications built with the latest technologies.",
    icon: "💻",
  },
  {
    title: "Logo Design",
    desc: "Clean, memorable brand identities that represent your business professionally.",
    icon: "🎯",
  },
  {
    title: "School Projects",
    desc: "High-quality academic projects, systems, and documentation for students.",
    icon: "📚",
  },
  {
    title: "Flyer Design",
    desc: "Eye-catching flyers and promotional materials for your business or events.",
    icon: "🖼️",
  },
];
const Services = () => {
  return (
    <section className="py-14 px-6">
      
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Our <span className="text-sky-400">Services</span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            We provide digital solutions that help individuals, students, and businesses grow.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {services.map((service, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-[#111827] border border-gray-800 hover:border-sky-400 transition duration-300 hover:-translate-y-2"
            >
              
              {/* Icon */}
              <div className="text-3xl mb-4">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-gray-400 text-sm">
                {service.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Services;