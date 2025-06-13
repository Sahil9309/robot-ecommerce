import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function IndexPage() {
  // Add animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Now using purple gradient */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            The Future of <br/>
            <span className="text-emerald-400">Robotic Innovation</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-purple-100">
            Pioneering the next generation of intelligent robotics solutions for a smarter, more efficient tomorrow.
          </p>
          <motion.div 
            whileHover={hoverScale}
            className="inline-block"
          >
            <Link to="/products" className="bg-emerald-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-300 transition-colors">
              Explore Our Robots
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section - Modern Grid Layout */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-900 to-indigo-600 bg-clip-text text-transparent">
            Why Choose RoboTech?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Unleashing the power of robotics with cutting-edge technology and unparalleled expertise
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 relative">
          {/* Innovation Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="relative bg-white rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-purple-900/10 w-16 h-16 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-indigo-600 opacity-20" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Leading-edge robotics solutions powered by advanced AI and machine learning technologies.
              </p>
              <div className="flex items-center text-purple-900 font-semibold group-hover:text-indigo-600 transition-colors">
                Learn More
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Quality Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="relative bg-white rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-emerald-900/10 w-16 h-16 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-800 to-teal-600 opacity-20" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                ISO-certified manufacturing with rigorous quality control and testing standards.
              </p>
              <div className="flex items-center text-emerald-800 font-semibold group-hover:text-teal-600 transition-colors">
                Learn More
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="relative bg-white rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-blue-900/10 w-16 h-16 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-indigo-600 opacity-20" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                24/7 technical support and comprehensive maintenance services for peace of mind.
              </p>
              <div className="flex items-center text-blue-900 font-semibold group-hover:text-indigo-600 transition-colors">
                Learn More
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section - Updated background */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-purple-900 mb-2">500+</h4>
              <p className="text-gray-600">Robots Deployed</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-purple-900 mb-2">50+</h4>
              <p className="text-gray-600">Countries Served</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-purple-900 mb-2">99%</h4>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-purple-900 mb-2">24/7</h4>
              <p className="text-gray-600">Technical Support</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section - Updated gradient */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Industry?</h2>
          <p className="text-xl mb-8 text-purple-100">Join the robotics revolution and stay ahead of the competition.</p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link to="/contact" className="bg-emerald-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-300 transition-colors">
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}