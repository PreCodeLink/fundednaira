import WhatsAppFloat from "../components/WhatsappFloat";
import Layout from "../layouts/Layout";

const projects = [
  {
    title: "Student Project Platform",
    desc: "A platform for students to access and manage academic projects.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
  {
    title: "Invoice Generator",
    desc: "A smart tool for creating and managing invoices.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  },
  {
    title: "School Management System",
    desc: "Manage students, staff, and academic records easily.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
  },
  {
    title: "Business Dashboard",
    desc: "Track performance with real-time analytics.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    title: "E-Commerce Platform",
    desc: "Modern online store with seamless checkout.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    title: "Portfolio Builder",
    desc: "Generate clean and modern developer portfolios.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
];

const Projects = () => {
  return (
   <Layout>
     <section className="py-14 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Our <span className="text-sky-400">Projects</span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Real systems built to solve real-world problems.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden border border-gray-800 hover:border-sky-400 transition duration-500"
            >
              
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={`${project.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition"></div>

              {/* Content */}
              <div className="absolute bottom-0 p-6">
                
                <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition duration-500">
                  {project.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
      <WhatsAppFloat />
    </section>
   </Layout>
  );
};

export default Projects;