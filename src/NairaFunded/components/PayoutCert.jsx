import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// import images properly
import payout1 from "../assets/payout1.png";
import payout2 from "../assets/payout2.png";
import payout3 from "../assets/payout3.png";
import payout4 from "../assets/payout4.png";
import payout5 from "../assets/payout5.png";

const PayoutSlider = () => {
  const sliderRef = useRef();

  const images = [payout1, payout2, payout3, payout4, payout5];

  useEffect(() => {
    const slider = sliderRef.current;

    let scrollAmount = 0;

    const slide = () => {
      if (!slider) return;

      scrollAmount += 1;
      slider.scrollLeft += 1;

      // seamless loop
      if (scrollAmount >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
        scrollAmount = 0;
      }
    };

    const interval = setInterval(slide, 20); // smooth speed

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#0B0F19] text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold">
          Payout Proof
        </h2>

        <p className="mt-4 text-gray-400">
          Real payout records from our funded traders
        </p>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="mt-12 flex gap-6 overflow-x-scroll no-scrollbar"
        >
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="min-w-[280px] md:min-w-[320px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:scale-105 transition"
            >
              <img
                src={img}
                alt="payout proof"
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            to="/auth"
            className="bg-sky-400 px-8 py-3 rounded-xl text-white font-medium hover:opacity-90 transition inline-block"
          >
            Get Account
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PayoutSlider;