import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Footer() {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const toolsRef = useRef(null);

  // Hide tools dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setShowToolsDropdown(false);
      }
    }
    if (showToolsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToolsDropdown]);

  const handleToolsDropdownToggle = () => {
    setShowToolsDropdown(!showToolsDropdown);
  };

  const handleToolsOptionClick = () => {
    setShowToolsDropdown(false);
  };

  return (
    <footer className="bottom-0 left-0 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-8 shadow-inner z-40">
      <div className="container mx-auto px-4 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Left: Logo and copyright */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3">
          <svg className="w-8 h-8 text-purple-400 mb-2 md:mb-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12 12 0 01.665 6.479A11.955 11.955 0 0112 20.001a11.955 11.955 0 01-6.824-2.944 12 12 0 01.665-6.479L12 14z"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" strokeWidth={2} />
          </svg>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            BoticsBay
          </span>
          <span className="text-xs md:text-sm text-slate-300 md:ml-4 text-center md:text-left">
            &copy; {new Date().getFullYear()} BoticsBay. All rights reserved.
          </span>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/contact" className="hover:text-purple-300 transition-colors">Contact Us</Link>
          <Link to="/products" className="hover:text-purple-300 transition-colors">Products</Link>
          
          {/* Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={handleToolsDropdownToggle}
              className="flex items-center gap-1 hover:text-purple-300 transition-colors"
            >
              Tools
              <svg
                className={`w-3 h-3 transition-transform ${
                  showToolsDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showToolsDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/tools"
                  onClick={handleToolsOptionClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm"
                >
                  Controller
                </Link>
                <Link
                  to="/urdf-model"
                  onClick={handleToolsOptionClick}
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm"
                >
                  Gestontrol
                </Link>
              </div>
            )}
          </div>

          <Link to="/orders" className="hover:text-purple-300 transition-colors">My Orders</Link>
        </div>

        {/* Right: Socials */}
        <div className="flex justify-center gap-4">
          <a href="https://github.com/Sahil9309" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors" title="Sahil Talwekar - GitHub">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/sahil-talwekar-650147294/" target="_blank" rel="noopener noreferrer" 
          className="hover:text-purple-300 transition-colors" title="Sahil Talwekar - LinkedIn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="mailto:sahiltalwekar123@gmail.com" className="hover:text-purple-300 transition-colors" title="Email - sahiltalwekar123@gmail.com">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4 4-4-4m8-4H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}