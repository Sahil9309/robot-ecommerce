import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AddRobotForm from '../components/AddRobotForm';
import { useCart } from '../context/CartContext';
import { UserContext } from "../UserContext"; // Add this import
import { useNavigate } from "react-router-dom"; // Add this import
import toast from 'react-hot-toast';

export default function RobotsPage() {
  const [robots, setRobots] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added this
  const { addToCart, cartItems } = useCart();
  const { user } = useContext(UserContext); // Add this
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const { data } = await axios.get('/api/robots');
        setRobots(data);
      } catch (error) {
        console.error('Error fetching robots:', error);
      }
    };
    fetchRobots();
  }, []);

  const handleRobotAdded = (newRobot) => {
    setRobots(prev => [...prev, newRobot]);
    setShowAddForm(false);
  };

  const handleAddToCart = (robot) => {
    if (!user) {
      navigate('/login');
      return;
    }

    addToCart(robot);
    const cartItem = cartItems.find(item => item._id === robot._id);
    const newQuantity = cartItem ? cartItem.quantity + 1 : 1;
    
    toast.success(
      <div className="flex items-center gap-2">
        <img src={robot.image} alt={robot.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium">{robot.name}</p>
          <p className="text-sm">Added to cart</p>
        </div>
      </div>
    );
  };

  const filteredRobots = robots.filter(robot => 
    robot.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || robot.category === selectedCategory)
  );

  const categories = ["all", ...new Set(robots.map(robot => robot.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {showAddForm ? 'Add New Robot' : 'Explore Our Robots'}
              </h1>
              <p className="text-gray-600">
                {showAddForm
                  ? 'Create a new robot listing'
                  : 'Discover cutting-edge robotics technology'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                showAddForm
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showAddForm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
              {showAddForm ? 'Cancel' : 'Add New Robot'}
            </motion.button>
          </div>
        </div>

        {/* Form Section */}
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <AddRobotForm onRobotAdded={handleRobotAdded} />
          </motion.div>
        ) : (
          <>
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* 🔍 Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search robots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Robots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {filteredRobots.map((robot) => (
                <motion.div
                  key={robot._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-visible border border-gray-100 flex flex-col group"
                >
                  {/* Floating Description Popup */}
                  <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out left-1/2 -translate-x-1/2 -top-28 w-[90%] sm:w-[85%] max-w-xs transform group-hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700/30">
                      <div className="relative">
                        <div className="absolute -top-3 -right-3">
                          <span className="inline-flex items-center justify-center p-2 bg-blue-600/20 rounded-full">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-200 font-medium">
                          {robot.description}
                        </p>
                      </div>
                      {/* Improved Triangle Pointer */}
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
                        <div className="w-5 h-5 bg-gray-800 rotate-45 transform origin-center"></div>
                      </div>
                    </div>
                  </div>

                  {/* Robot Image */}
                  <div className="relative">
                    <img 
                      src={robot.image} 
                      alt={robot.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {robot.name}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {robot.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-blue-600">
                        ${robot.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(robot)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRobots.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No robots found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
