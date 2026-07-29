import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck } from "lucide-react";

import payout1 from "../assets/newpayout1.JPG";
import payout2 from "../assets/newpayout2.JPG";
import payout3 from "../assets/newpayout3.JPG";
import payout4 from "../assets/newpayout4.JPG";
import payout5 from "../assets/newpayout5.JPG";

const PayoutSlider = () => {
  const sliderRef = useRef();
  const [paused, setPaused] = useState(false);

  const images = [
    payout1,
    payout2,
    payout3,
    payout4,
    payout5,
  ];

  useEffect(() => {
    const slider = sliderRef.current;

    let scroll = 0;

    const interval = setInterval(() => {
      if (!slider || paused) return;

      scroll += 1;

      slider.scrollLeft += 1;

      if (scroll >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
        scroll = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="relative overflow-hidden bg-[#050816] py-24">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[180px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-green-400 text-sm">

            <BadgeCheck size={16} />

            VERIFIED PAYOUTS

          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-white">

            Our Traders

            <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">

              Get Paid

            </span>

          </h2>

          <p className="mt-6 text-slate-400 text-lg">

            Thousands of successful payouts delivered to Nigerian traders.
            Every image below represents a real payout made by FundedNaira.

          </p>

        </div>

        {/* Slider */}

        <div
          ref={sliderRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="
          mt-20
          flex
          gap-7
          overflow-x-auto
          no-scrollbar
          scroll-smooth
          pb-3
          "
        >

          {[...images, ...images].map((img, index) => (

            <div
              key={index}
              className="
              group
              relative
              flex-shrink-0
              w-[280px]
              sm:w-[320px]
              lg:w-[360px]
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-3
              hover:border-sky-400/40
              "
            >

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 z-10" />

              <img
                src={img}
                alt="FundedNaira payout proof"
                className="
                h-[420px]
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-110
                "
              />

              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">

                <div className="flex items-center gap-2 text-green-400">

                  <BadgeCheck size={18} />

                  <span className="font-semibold">

                    Verified Payout

                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-300">

                  Real withdrawal from a funded trader.

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Bottom CTA */}

        <div className="mt-20 text-center">

          <Link
            to="/auth"
            className="
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-gradient-to-r
            from-sky-500
            to-blue-600
            px-8
            py-4
            font-semibold
            text-white
            shadow-xl
            shadow-sky-500/20
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-sky-500/40
            "
          >

            Start Trading Today

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />

          </Link>

        </div>

      </div>

    </section>
  );
};

export default PayoutSlider;