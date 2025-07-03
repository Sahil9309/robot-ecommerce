import { Link, NavLink, useNavigate } from "react-router-dom";
import CartIcon from "./components/CartIcon";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const logoutRef = useRef(null);
    const navigate = useNavigate();

    // Hide logout popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogout(false);
            }
        }
        if (showLogout) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLogout]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            setUser(null);
            toast.success("Logged out successfully!");
            setShowLogout(false);
            navigate("/");
        } catch (e) {
            toast.error("Logout failed. Try again.");
        }
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12 12 0 01.665 6.479A11.955 11.955 0 0112 20.001a11.955 11.955 0 01-6.824-2.944 12 12 0 01.665-6.479L12 14z"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" strokeWidth={2} />
                        </svg>
                        BoticsBay
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center w-full justify-between ml-10">
                        {/* Centered Links */}
                        <div className="mx-auto flex items-center gap-8">
                            <NavLink to="/contact" className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'}`
                            }>
                                Contact Us
                            </NavLink>
                            <NavLink to="/products" className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'}`
                            }>
                                Products
                            </NavLink>
                            <NavLink to="/tools" className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'}`
                            }>
                                Tools
                            </NavLink>
                            <NavLink to="/urdf-model" className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'}`
                            }>
                                Gestontrol
                            </NavLink>
                            <NavLink to="/orders" className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700 hover:text-purple-600'}`
                            }>
                                My Orders
                            </NavLink>
                            <CartIcon />
                        </div>

                        {/* Right side buttons */}
                        {!user ? (
                            <div className="flex items-center gap-4 ml-auto">
                                <NavLink to="/login" className={({ isActive }) =>
                                    isActive
                                        ? 'px-4 py-2 rounded-xl border-2 border-purple-600 bg-purple-50 text-purple-600'
                                        : 'px-4 py-2 rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors'
                                }>
                                    Login
                                </NavLink>
                                <NavLink to="/register" className={({ isActive }) =>
                                    isActive
                                        ? 'px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                                        : 'px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md'
                                }>
                                    Sign Up
                                </NavLink>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-auto relative">
                                <button
                                    onClick={() => setShowLogout((v) => !v)}
                                    className="flex items-center gap-2 transition-colors text-gray-700 hover:text-purple-600 focus:outline-none relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <span>{user.name}</span>
                                </button>
                                {showLogout && (
                                    <div
                                        ref={logoutRef}
                                        className="absolute right-0 mt-2"
                                        style={{ minWidth: "8rem" }}
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-center rounded-xl border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-colors font-medium shadow"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="flex items-center gap-4 md:hidden">
                        <CartIcon />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-700">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
                    <div className="flex flex-col space-y-4 bg-white rounded-xl p-4 shadow-lg">
                        <NavLink to="/contact">Contact Us</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        <NavLink to="/tools">Tools</NavLink>
                        <NavLink to="/urdf-model">Gestontrol</NavLink>
                        <Link to="/cart">Cart</Link>
                        <NavLink to="/orders">My Orders</NavLink>
                        {!user ? (
                            <div className="flex flex-col space-y-2">
                                <NavLink to="/login" className="w-full px-4 py-2 text-center rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors">
                                    Login
                                </NavLink>
                                <NavLink to="/register" className="w-full px-4 py-2 text-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                                    Sign Up
                                </NavLink>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-center rounded-xl text-red-600 hover:bg-gray-50 transition-colors"
                            >
                                Log out
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}