import Layout from "../layout/Layout";
import { FaEnvelope, FaCommentDots, FaStar, FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.type.trim() ||
      !formData.message.trim()
    ) {
      showAlert("error", "Please fill all fields.");
      return;
    }

    if (rating < 1) {
      showAlert("error", "Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://fundednaira.ng/api/feedback/create-feedback.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            type: formData.type,
            rating,
            message: formData.message,
          }),
        }
      );

      const text = await res.text();
      let result = {};

      try {
        result = JSON.parse(text);
      } catch (err) {
        showAlert("error", "Invalid server response");
        return;
      }

      if (result.success) {
        showAlert("success", result.message || "Feedback submitted successfully");
        setFormData({
          name: "",
          email: "",
          type: "",
          message: "",
        });
        setRating(0);
      } else {
        showAlert("error", result.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error(error);
      showAlert("error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#0B0F19] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-sky-500 opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold">Feedback</h1>
            <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
              We value your opinion. Share your experience, suggestions, or complaints with us.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <FaCommentDots className="text-sky-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Feedback Support</p>
                  <p className="font-medium">Your opinion helps us improve</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <FaEnvelope className="text-sky-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-medium">fundednaira68@gmail.com</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <FaTelegramPlane className="text-sky-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Telegram</p>
                  <a href="https://t.me/FundedNaira1" className="font-medium text-blue-600">FundedNaira1</a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Send Feedback</h2>

              {alert.show && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    alert.type === "success"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {alert.message}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-sky-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-sky-400"
                />

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-sky-400"
                >
                  <option value="">Select Feedback Type</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Support">Support</option>
                  <option value="Review">Review</option>
                </select>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Rate Your Experience</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl"
                      >
                        <FaStar
                          className={star <= rating ? "text-yellow-400" : "text-gray-600"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your feedback..."
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-sky-400"
                ></textarea>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-400 text-black py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Feedback;