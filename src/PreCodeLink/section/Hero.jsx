import { Link } from "react-router-dom";
import logo from "../assests/images/logo.png";

const Hero = () => {
  return (
    <section className="pt-16 pb-20 px-6">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            We Build{" "}
            <span className="text-sky-400">
              Modern Digital Solutions
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-xl">
            PreCodeLink helps startups and businesses create scalable web applications,
            powerful tools, and modern digital platforms that drive real growth.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            
            <button className="bg-sky-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-500 transition duration-300 shadow-lg shadow-sky-400/30">
              <Link to='/contact'>Start Your Project</Link>
            </button>

          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex justify-center">
          
          <div className="relative w-full max-w-md h-72 md:h-96 rounded-2xl bg-gradient-to-br from-sky-400/10 to-blue-500/5 border border-gray-800 flex items-center justify-center">
            
            {/* Glow Effect */}
            <div className="absolute w-40 h-40 bg-sky-400/20 blur-3xl rounded-full"></div>

            {/* Logo */}
            <img
              src={logo}
              alt="PreCodeLink"
              className="relative w-40 md:w-56 object-contain drop-shadow-xl"
            />

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;