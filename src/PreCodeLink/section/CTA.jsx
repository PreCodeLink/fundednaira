import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-6">
      
      <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-sky-400/10 to-blue-500/10 border border-gray-800 rounded-2xl p-12">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Have an Idea?{" "}
          <span className="text-sky-400">Let’s Build It Together</span>
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
          Whether you need a website, system, or design — PreCodeLink is ready
          to turn your idea into a powerful digital solution.
        </p>

        {/* Button */}
        <div className="mt-10">
          <button className="bg-sky-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-500 transition duration-300 shadow-lg shadow-sky-400/30">
          <Link to='/contact'>Start Your Project</Link>
          </button>
        </div>

      </div>

    </section>
  );
};

export default CTA;