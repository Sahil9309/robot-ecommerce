import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const robotFeatures = [
    {
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms that adapt and learn from their environment in real-time.",
      icon: "🤖",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Precision Engineering", 
      description: "Ultra-precise mechanical systems with sub-millimeter accuracy for critical applications.",
      icon: "⚙️",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Autonomous Navigation",
      description: "Advanced LIDAR and computer vision systems for seamless autonomous operation.",
      icon: "🧭",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const applications = [
    { icon: "🏭", title: "Manufacturing", desc: "Automated assembly lines" },
    { icon: "🏥", title: "Healthcare", desc: "Surgical assistance" },
    { icon: "📦", title: "Logistics", desc: "Warehouse automation" },
    { icon: "🚗", title: "Automotive", desc: "Quality inspection" }
  ];

  return (
    <div className="bg-gray-50 mx-32">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  The Future of <br className="hidden sm:block"/>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Robotic Innovation
                  </span>
                </h1>
                <p className="text-lg sm:text-xl mb-8 max-w-2xl text-slate-300 mx-auto lg:mx-0">
                  Pioneering the next generation of intelligent robotics solutions for manufacturing, healthcare, logistics, and beyond.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all shadow-lg"
                    onClick={() => navigate("/products")}
                  >
                    Explore Our Robots
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-slate-900 hover:scale-105 transition-all">
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Right side - Robot Image/Visualization */}
              <div className="relative">
                <div className="relative w-full h-96 sm:h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Robot silhouette/placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl sm:text-9xl opacity-30">🤖</div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-10 right-10 w-4 h-4 bg-cyan-400 rounded-full shadow-lg animate-bounce"></div>
                  <div className="absolute bottom-20 left-10 w-3 h-3 bg-purple-400 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute top-1/2 left-20 w-2 h-2 bg-pink-400 rounded-full shadow-lg animate-ping"></div>
                  
                  {/* Circuit lines */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <path d="M20 20 L180 20 L180 80 L100 80 L100 120 L180 120 L180 180" 
                            stroke="cyan" strokeWidth="2" fill="none" className="animate-pulse"/>
                      <circle cx="100" cy="80" r="4" fill="cyan" className="animate-ping"/>
                      <circle cx="180" cy="120" r="4" fill="purple" className="animate-pulse"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robot Features Section */}
      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Advanced Robotics Technology
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our robots combine cutting-edge AI, precision engineering, and intuitive design to revolutionize how work gets done.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {robotFeatures.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform ${
                  hoveredCard === index ? 'scale-105 -translate-y-2' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 hover:opacity-5 rounded-2xl transition-opacity`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-900 to-indigo-600 bg-clip-text text-transparent">
                Why Choose BoticsBay?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Unleashing the power of robotics with cutting-edge technology and unparalleled expertise
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Innovation Card */}
            <div className="relative bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="bg-purple-900/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-900 to-indigo-600 opacity-20" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Leading-edge robotics solutions powered by advanced AI and machine learning technologies.
                </p>
                <div className="flex items-center text-purple-900 font-semibold group-hover:text-indigo-600 transition-colors cursor-pointer">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quality Card */}
            <div className="relative bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="bg-emerald-900/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-800 to-teal-600 opacity-20" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Quality</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  ISO-certified manufacturing with rigorous quality control and testing standards.
                </p>
                <div className="flex items-center text-emerald-800 font-semibold group-hover:text-teal-600 transition-colors cursor-pointer">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="relative bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="bg-blue-900/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-900 to-indigo-600 opacity-20" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Support</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  24/7 technical support and comprehensive maintenance services for peace of mind.
                </p>
                <div className="flex items-center text-blue-900 font-semibold group-hover:text-indigo-600 transition-colors cursor-pointer">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Industry Applications
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our robots are transforming industries worldwide with intelligent automation solutions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {applications.map((app, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{app.title}</h3>
                <p className="text-gray-600">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Robot Showcase Section */}
      <div className="bg-gradient-to-br from-slate-100 to-blue-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Our Robot Fleet
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our advanced robotic systems designed for various industrial applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Assembly Bot X1", type: "Manufacturing Robot", emoji: "🦾", color: "blue" },
              { name: "MediBot Pro", type: "Healthcare Assistant", emoji: "🏥", color: "green" },
              { name: "LogiBot 3000", type: "Warehouse Automation", emoji: "📦", color: "purple" },
              { name: "InspectorBot", type: "Quality Control", emoji: "🔍", color: "orange" },
              { name: "CleanBot Elite", type: "Maintenance Robot", emoji: "🧹", color: "cyan" },
              { name: "GuardBot Alpha", type: "Security Robot", emoji: "🛡️", color: "red" }
            ].map((robot, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{robot.emoji}</div>
                  <div className={`w-3 h-3 rounded-full bg-${robot.color}-400 animate-pulse`}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{robot.name}</h3>
                <p className="text-gray-600 mb-4">{robot.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status: Active</span>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">500+</h4>
              <p className="text-slate-300">Robots Deployed</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">50+</h4>
              <p className="text-slate-300">Countries Served</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">99%</h4>
              <p className="text-slate-300">Customer Satisfaction</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">24/7</h4>
              <p className="text-slate-300">Technical Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Ready to Transform Your Industry?</h2>
          <p className="text-lg sm:text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join the robotics revolution and stay ahead of the competition with our cutting-edge automation solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all shadow-lg"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-900 hover:scale-105 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}