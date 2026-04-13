import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="bg-[#0B0F19] text-white min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-primary opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

      <div className="relative text-center max-w-xl">

        {/* 404 */}
        <h1 className="text-7xl md:text-9xl font-bold text-primary">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

          <Link
            to="/"
            className="bg-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Go Home
          </Link>

          <Link
            to="/buy-account"
            className="border border-gray-600 px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Buy Account
          </Link>

        </div>

      </div>
    </section>
  );
};

export default NotFound;