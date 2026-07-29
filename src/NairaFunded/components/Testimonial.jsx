import React from "react";
import {
  Star,
  Quote,
  ArrowRight,
} from "lucide-react";

const Testimonial = () => {
 const testimonials = [
  {
    name: "Abdullahi Musa",
    role: "Day Trader",
    country: "🇳🇬 Nigeria",
    rating: 5,
    review:
      "FundedNaira made the evaluation process simple. I received my funded account quickly and my payout arrived without any issues.",
  },
  {
    name: "Samuel Peter",
    role: "Forex Trader",
    country: "🇳🇬 Nigeria",
    rating: 5,
    review:
      "The dashboard is clean, support is responsive, and payouts are exactly as promised. This is one of the best local prop firms I've used.",
  },
  {
    name: "Aisha Ibrahim",
    role: "Swing Trader",
    country: "🇳🇬 Nigeria",
    rating: 5,
    review:
      "Receiving payouts in Naira is a huge advantage. Everything feels transparent and professional from registration to funding.",
  },
  {
    name: "David Johnson",
    role: "Scalper",
    country: "🇬🇭 Ghana",
    rating: 5,
    review:
      "Fast account activation and excellent trading conditions. I appreciate how smooth the whole process has been.",
  },
  {
    name: "Fatima Bello",
    role: "Gold Trader",
    country: "🇳🇬 Nigeria",
    rating: 5,
    review:
      "Customer support answered all my questions within minutes. I successfully passed the challenge and received my funded account.",
  },
  {
    name: "Michael Adams",
    role: "Prop Trader",
    country: "🇰🇪 Kenya",
    rating: 5,
    review:
      "The rules are clear, payouts are reliable, and the experience has been excellent. I would definitely recommend FundedNaira to other traders.",
  },
];

  return (
    <section className="relative overflow-hidden bg-[#050816] py-24">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[170px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-300 text-sm">

            TESTIMONIALS

          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-white">

            What Traders
            <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">

              Say About Us

            </span>

          </h2>

          <p className="mt-6 text-slate-400 text-lg">

            Hear from traders who have successfully completed our
            challenges, received funding and earned payouts.

          </p>

        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((item, index) => (

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
              hover:-translate-y-3
              hover:border-sky-400/40
              "
            >

              <Quote
                size={60}
                className="absolute -right-4 -top-4 text-sky-500/10"
              />

              <div className="flex gap-1">

                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 text-slate-300 leading-8">

                "{item.review}"

              </p>

              <div className="mt-8 border-t border-white/10 pt-6">

                <h4 className="font-bold text-white">

                  {item.name}

                </h4>

                <p className="text-slate-400 text-sm">

                  {item.role}

                </p>

                <p className="text-slate-500 text-sm mt-1">

                  {item.country}

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Bottom */}

        <div className="mt-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">

          <div>

            <h3 className="text-3xl font-bold text-white">

              Join Hundreds of Successful Traders

            </h3>

            <p className="mt-3 text-slate-400">

              Start your journey today and become the next funded trader.

            </p>

          </div>

          <a
            href="/auth"
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
            transition
            hover:scale-105
            "
          >

            Get Funded

            <ArrowRight size={18} />

          </a>

        </div>

      </div>

    </section>
  );
};

export default Testimonial;