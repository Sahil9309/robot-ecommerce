import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { user } = useContext(UserContext);
  const { cartItems } = useCart();

  if (!user) {
    return null; // Don't show cart icon for unauthenticated users
  }

  return (
    <Link to="/cart" className="relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-gray-700 hover:text-purple-600 transition-colors" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
}