import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mic, Home as HomeIcon, Settings, LogOut, LogIn, ChevronDown } from 'lucide-react';

// A simple, stylish SVG logo component
const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600">
        <path d="M12 2C11.4477 2 11 2.44772 11 3V11C11 11.5523 11.4477 12 12 12C12.5523 12 13 11.5523 13 11V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor" />
        <path d="M19 10C18.4477 10 18 10.4477 18 11V13C18 16.3137 15.3137 19 12 19C8.68629 19 6 16.3137 6 13V11C6 10.4477 5.55228 10 5 10C4.44772 10 4 10.4477 4 11V13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13V11C20 10.4477 19.5523 10 19 10Z" fill="currentColor" />
        <path d="M9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3V7C7 7.55228 7.44772 8 8 8C8.55228 8 9 7.55228 9 7V3Z" fill="currentColor" opacity="0.7"/>
        <path d="M17 3C17 2.44772 16.5523 2 16 2C15.4477 2 15 2.44772 15 3V7C15 7.55228 15.4477 8 16 8C16.5523 8 17 7.55228 17 7V3Z" fill="currentColor" opacity="0.7"/>
    </svg>
);

const Navbar = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef(null);

    // Close profile dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

    // Reusable link component for dropdowns and mobile menu
    const DropdownLink = ({ to, label, icon, onClick }) => (
        <Link
            to={to}
            onClick={() => {
                if(onClick) onClick();
                closeAllMenus();
            }}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );

    const loggedInNav = (
        <div className="relative" ref={profileMenuRef}>
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.userId ? 'K' : '?'}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-gray-700">Karthik</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in-up">
                    <DropdownLink to="/" label="Home" icon={<HomeIcon size={16} />} />
                    <DropdownLink to="/interview/new" label="New Interview" icon={<Mic size={16} />} />
                    <DropdownLink to="/settings" label="Settings" icon={<Settings size={16} />} />
                    <div className="h-px bg-gray-200 my-2"></div>
                    <button
                        onClick={() => {
                            onLogout();
                            closeAllMenus();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );

    const loggedOutNav = (
        <Link
            to="/auth"
            onClick={closeAllMenus}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
            <LogIn size={16} />
            <span>Login / Sign Up</span>
        </Link>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" onClick={closeAllMenus} className="flex items-center gap-2 group">
                        <Logo />
                        <span className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">AI Interview Pro</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? loggedInNav : loggedOutNav}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-purple-700">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-2 animate-fade-in-down">
                    {user ? (
                        <>
                            <DropdownLink to="/" label="Home" icon={<HomeIcon size={18} />} />
                            <DropdownLink to="/interview/new" label="New Interview" icon={<Mic size={18} />} />
                            <DropdownLink to="/settings" label="Settings" icon={<Settings size={18} />} />
                             <div className="h-px bg-gray-200 my-2"></div>
                            <button
                                onClick={() => {
                                    onLogout();
                                    closeAllMenus();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            onClick={closeAllMenus}
                            className="flex items-center justify-center gap-3 w-full px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg"
                        >
                            <LogIn size={18} />
                            <span>Login / Sign Up</span>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
