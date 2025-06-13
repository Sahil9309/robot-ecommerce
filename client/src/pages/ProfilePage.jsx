import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.js";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  async function handleLogout() {
    try {
      await axios.post('/api/logout');
      setUser(null);
      setRedirect(true);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  if (!user || redirect) {
    return <Navigate to={!user ? "/login" : "/"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl overflow-hidden"
        >
          {/* Simplified Header */}
          <div className="relative px-6 py-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)"/>
              </svg>
            </div>
            
            <div className="relative text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-2">{profile?.name}</h2>
                <p className="text-purple-200 text-sm">@{profile?.email.split('@')[0]}</p>
              </motion.div>
            </div>
          </div>

          {/* Rest of the profile content remains the same */}
          <div className="px-6 py-6 space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                <p className="text-gray-900">{profile?.email}</p>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                <p className="text-gray-900">{profile?.name}</p>
              </div>
            </div>

            {/* Divider with matching color */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Sign Out Button with matching gradient */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Sign out
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}