import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-8 shadow-inner z-40">
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
          <Link to="/tools" className="hover:text-purple-300 transition-colors">Tools</Link>
          <Link to="/urdf-model" className="hover:text-purple-300 transition-colors">Gestontrol</Link>
          <Link to="/orders" className="hover:text-purple-300 transition-colors">My Orders</Link>
        </div>

        {/* Right: Socials */}
        <div className="flex justify-center gap-4">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>
          <a href="mailto:sahiltalwekar123@gmail.com" className="hover:text-purple-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4 4-4-4m8-4H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}