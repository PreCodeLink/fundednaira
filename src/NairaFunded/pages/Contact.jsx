import { useState } from "react";
import Layout from "../layout/Layout";
import {
  FaEnvelope,
  FaCommentDots,
  FaStar,
  FaTelegramPlane,
  FaPaperPlane,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";

const Feedback = () => {
  const [rating, setRating] = useState(0);

  const [selectedType, setSelectedType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const feedbackTypes = [
    {
      title: "Suggestion",
      icon: "💡",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Support",
      icon: "🛠",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Review",
      icon: "⭐",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Complaint",
      icon: "⚠",
      color: "from-red-500 to-pink-500",
    },
  ];

  const stats = [
    {
      number: "4.9",
      label: "Average Rating",
    },
    {
      number: "1200+",
      label: "Feedback Received",
    },
    {
      number: "98%",
      label: "Resolved",
    },
  ];

  const faq = [
    {
      q: "How long before I receive a reply?",
      a: "Most messages receive a response within 30 minutes.",
    },
    {
      q: "Can I report a bug?",
      a: "Yes. Please include screenshots if possible.",
    },
    {
      q: "Can I send suggestions?",
      a: "Absolutely. We love hearing ideas from traders.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !selectedType
    ) {
      showAlert("error", "Please complete all fields.");
      return;
    }

    if (rating === 0) {
      showAlert("error", "Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.fundednaira.net/api/feedback/create-feedback.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            type: selectedType,
            rating,
            message: formData.message,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        showAlert("success", "Feedback submitted successfully.");

        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setRating(0);
        setSelectedType("");
      } else {
        showAlert("error", result.message);
      }
    } catch (err) {
      showAlert("error", "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-[#050816] text-white">

        {/* GRID BACKGROUND */}

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* GLOW */}

        <div className="absolute -left-32 top-0 w-96 h-96 rounded-full bg-sky-500/20 blur-[140px]" />

        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-[160px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">

          {/* HERO */}

          <div className="text-center">

            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300 text-sm">

              <FaCommentDots />

              YOUR VOICE MATTERS

            </span>

            <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight">

              Help Us Build

              <br />

              The Best

              <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">

                Nigerian Prop Firm

              </span>

            </h1>

            <p className="mt-8 text-slate-400 text-lg max-w-3xl mx-auto leading-9">

              Every review, suggestion and complaint helps us improve
              FundedNaira for thousands of traders across Nigeria.

            </p>

            <div className="mt-8 flex justify-center items-center gap-2">

              {[1,2,3,4,5].map((i)=>(
                <FaStar
                  key={i}
                  className="text-yellow-400 text-xl"
                />
              ))}

              <span className="ml-2 text-slate-300">

                Rated 4.9/5 by our traders

              </span>

            </div>

          </div>

          {/* CONTENT */}

          <div className="mt-24 grid lg:grid-cols-5 gap-10">

            {/* LEFT */}

            <div className="lg:col-span-2">

              <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center text-4xl">

                  💬

                </div>

                <h2 className="mt-8 text-3xl font-bold">

                  Support Center

                </h2>

                <p className="mt-4 text-slate-400 leading-8">

                  Need help with your account, payout, affiliate program
                  or trading rules?

                  Our support team is always available.

                </p>

                <div className="mt-10 space-y-5">

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-400">

                      <FaEnvelope />

                    </div>

                    <div>

                      <p className="text-slate-500 text-sm">

                        Email

                      </p>

                      <p className="font-semibold">

                        fundednaira68@gmail.com

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">

                      <FaTelegramPlane />

                    </div>

                    <div>

                      <p className="text-slate-500 text-sm">

                        Telegram

                      </p>

                      <p className="font-semibold">

                        @FundedNaira1

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center text-green-400">

                      <FaHeadset />

                    </div>

                    <div>

                      <p className="text-slate-500 text-sm">

                        Average Response

                      </p>

                      <p className="font-semibold">

                        Under 30 Minutes

                      </p>

                    </div>

                  </div>

                </div>
                                {/* QUICK STATS */}

                <div className="mt-10 grid grid-cols-3 gap-4">

                  {stats.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center"
                    >
                      <h3 className="text-3xl font-black text-sky-400">
                        {item.number}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="lg:col-span-3">

              <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10">

                <h2 className="text-3xl font-bold">
                  Send Feedback
                </h2>

                <p className="mt-3 text-slate-400">
                  We'd love to hear your thoughts. Every message helps us improve.
                </p>

                {alert.show && (
                  <div
                    className={`mt-8 rounded-2xl border p-4 ${
                      alert.type === "success"
                        ? "border-green-500/20 bg-green-500/10 text-green-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {alert.message}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-10 space-y-7"
                >

                  {/* NAME */}

                  <div>

                    <label className="text-sm text-slate-400 mb-2 block">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-5 py-4 outline-none transition focus:border-sky-400"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="text-sm text-slate-400 mb-2 block">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-5 py-4 outline-none transition focus:border-sky-400"
                    />

                  </div>

                  {/* FEEDBACK TYPE */}

                  <div>

                    <label className="text-sm text-slate-400 mb-4 block">
                      Feedback Type
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                      {feedbackTypes.map((item) => (

                        <button
                          key={item.title}
                          type="button"
                          onClick={() => setSelectedType(item.title)}
                          className={`rounded-2xl border p-5 transition-all duration-300 ${
                            selectedType === item.title
                              ? "border-sky-400 bg-sky-500/10 scale-105"
                              : "border-white/10 bg-white/5 hover:border-sky-500/30"
                          }`}
                        >

                          <div
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-2xl`}
                          >
                            {item.icon}
                          </div>

                          <h3 className="mt-4 font-semibold">
                            {item.title}
                          </h3>

                        </button>

                      ))}

                    </div>

                  </div>

                  {/* RATING */}

                  <div>

                    <label className="text-sm text-slate-400 mb-4 block">
                      Rate Your Experience
                    </label>

                    <div className="flex gap-3">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-all duration-300 hover:scale-125"
                        >

                          <FaStar
                            className={`text-4xl ${
                              rating >= star
                                ? "text-yellow-400 drop-shadow-lg"
                                : "text-gray-600"
                            }`}
                          />

                        </button>

                      ))}

                    </div>

                  </div>

                  {/* MESSAGE */}

                  <div>

                    <label className="text-sm text-slate-400 mb-2 block">
                      Your Message
                    </label>

                    <textarea
                      rows="7"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can improve..."
                      maxLength={1000}
                      className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-5 py-4 outline-none transition resize-none focus:border-sky-400"
                    />

                    <div className="mt-2 flex justify-end">

                      <span className="text-xs text-slate-500">
                        {formData.message.length}/1000
                      </span>

                    </div>

                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 text-lg font-bold text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >

                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Feedback
                      </>
                    )}

                  </button>

                </form>

              </div>

            </div>

          </div>
                    {/* FAQ */}

          <div className="mt-24">

            <div className="text-center">

              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2 text-sm text-sky-300">
                Frequently Asked Questions
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-black">
                Got Questions?
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-slate-400">
                Here are answers to the most common questions from our traders.
              </p>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {faq.map((item, index) => (

                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-sky-400/30"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                      <FaCheckCircle />
                    </div>

                    <h3 className="text-lg font-bold">
                      {item.q}
                    </h3>

                  </div>

                  <p className="mt-5 leading-8 text-slate-400">
                    {item.a}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* TRUST SECTION */}

          <div className="mt-24 rounded-[40px] border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 p-10 md:p-16">

            <div className="grid gap-10 md:grid-cols-4">

              <div>

                <h2 className="text-5xl font-black text-sky-400">
                  4.9★
                </h2>

                <p className="mt-3 text-slate-300">
                  Average Rating
                </p>

              </div>

              <div>

                <h2 className="text-5xl font-black text-sky-400">
                  1,200+
                </h2>

                <p className="mt-3 text-slate-300">
                  Feedback Received
                </p>

              </div>

              <div>

                <h2 className="text-5xl font-black text-sky-400">
                  98%
                </h2>

                <p className="mt-3 text-slate-300">
                  Issues Resolved
                </p>

              </div>

              <div>

                <h2 className="text-5xl font-black text-sky-400">
                  30m
                </h2>

                <p className="mt-3 text-slate-300">
                  Average Response Time
                </p>

              </div>

            </div>

          </div>

          {/* CTA */}

          <div className="mt-24 rounded-[40px] bg-gradient-to-r from-sky-500 to-cyan-500 p-12 text-center text-black">

            <h2 className="text-4xl md:text-5xl font-black">
              Thank You For Helping Us Grow 🚀
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8">

              Every review, suggestion and report helps us improve
              FundedNaira for thousands of traders across Nigeria.

            </p>

            <div className="mt-10 flex justify-center">

              <div className="rounded-2xl bg-white px-8 py-4 shadow-2xl">

                <div className="flex items-center gap-3 font-bold">

                  <FaCommentDots />

                  We read every single feedback.

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </Layout>

  );
};

export default Feedback;