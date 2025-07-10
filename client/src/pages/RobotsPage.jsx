import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useCart } from '../context/CartContext';
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function RobotsPage() {
  const [robots, setRobots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, cartItems } = useCart();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleAddToCart = (robot) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(robot);
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
      <div className="max-w-7xl mx-auto px-2 py-8 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Our Robots
            </h1>
            <p className="text-gray-600">
              Discover cutting-edge robotics technology
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search robots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {/* Robots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRobots.map((robot) => (
            <div
              key={robot._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group border border-gray-100"
            >
              {/* Robot Image */}
              <div className="relative">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="w-full h-56 object-cover"
                />
              </div>
              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                  {robot.name}
                </h2>
                <span className="text-xs text-gray-500 mb-2">
                  {robot.category}
                </span>
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                  {robot.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-blue-600">
                    ₹{robot.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(robot)}
                    className="text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer 
                    rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 
                    hover:to-indigo-700 transition-all duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
}
