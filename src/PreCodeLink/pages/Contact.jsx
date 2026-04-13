import React, { useState } from "react";
import Layout from "../layouts/Layout";
import WhatsAppFloat from "../components/WhatsappFloat";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phone = "2349040980156"; // 👉 PUT YOUR WHATSAPP NUMBER (no +)

    const text = `Hello, my name is ${form.name}%0AEmail: ${form.email}%0AMessage: ${form.message}`;

    const url = `https://wa.me/${phone}?text=${text}`;

    window.open(url, "_blank");
  };

  return (
   <Layout>
         <section className="relative py-24 bg-black text-white overflow-hidden">
          <WhatsAppFloat />
      
      {/* Background Glow */}
      <div className="absolute top-[-80px] right-[-80px] w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let’s <span className="text-blue-500">Work Together</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project idea or need a professional website or application? 
            Reach out and let’s build something amazing together.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Contact Info */}
          <div className="space-y-6">

            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl">
              <h4 className="font-semibold mb-1">WhatsApp</h4>
              <p className="text-gray-400">+234 904 098 0156</p>
            </div>

            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl">
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-gray-400">precodelink@email.com</p>
            </div>

            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl">
              <h4 className="font-semibold mb-1">Location</h4>
              <p className="text-gray-400">Kano, Nigeria</p>
            </div>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-6"
          >
            
            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Message
              </label>
              <textarea
                rows="5"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Write your message..."
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              Send via WhatsApp
            </button>

          </form>
        </div>
      </div>
    </section>
   </Layout>
  );
};

export default Contact;