import React from "react";
import Layout from "../layouts/Layout";
import ceo from "../assests/images/profile.png"
import WhatsAppFloat from "../components/WhatsappFloat";

const About = () => {
  return (
   <Layout>
    <WhatsAppFloat />
    <section className="relative py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Building Digital Solutions That <span className="text-blue-500">Matter</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            We are not just developers — we are problem solvers, innovators, and creators 
            of impactful digital experiences. Our goal is to transform ideas into powerful, 
            scalable, and user-focused software solutions.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          <div className="relative group">
            <img
              src={ceo}
              alt="Bashir - CEO"
              className="rounded-3xl shadow-2xl w-full object-cover transform group-hover:scale-105 transition duration-500"
            />

            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-lg p-4 rounded-xl border border-gray-800">
              <h4 className="font-semibold">Bashir (Garkuwa)</h4>
              <p className="text-blue-400 text-sm">CEO & Lead Developer</p>
            </div>
          </div>

          {/* Text Section */}
          <div>
            
            <h3 className="text-2xl font-semibold mb-4">
              Who We Are
            </h3>

            <p className="text-gray-400 leading-relaxed mb-6">
              We are a forward-thinking software company dedicated to building modern, 
              high-performance web applications and digital platforms. With a strong 
              foundation in technologies like React, JavaScript, PHP, and MySQL, we 
              deliver solutions that are both visually engaging and technically robust.
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              Our approach combines clean design, scalable architecture, and user-centered 
              thinking — ensuring every product we build is fast, reliable, and built for growth.
            </p>

            {/* Mission + Vision */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-blue-500 transition">
                <h4 className="font-semibold mb-2 text-blue-400">Our Mission</h4>
                <p className="text-gray-400 text-sm">
                  To empower businesses and individuals with innovative digital solutions 
                  that solve real-world problems efficiently.
                </p>
              </div>

              <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-purple-500 transition">
                <h4 className="font-semibold mb-2 text-purple-400">Our Vision</h4>
                <p className="text-gray-400 text-sm">
                  To become a leading technology brand known for creativity, reliability, 
                  and excellence in software development.
                </p>
              </div>

            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-10">
              <div>
                <h3 className="text-3xl font-bold text-blue-500">50+</h3>
                <p className="text-gray-400 text-sm">Projects Completed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-purple-500">3+</h3>
                <p className="text-gray-400 text-sm">Years Experience</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-green-400">100%</h3>
                <p className="text-gray-400 text-sm">Client Satisfaction</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
   </Layout>
  );
};

export default About;