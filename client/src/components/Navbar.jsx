// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react'; // Using lucide-react for icons

// const Navbar = ({ user, onLogout }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const location = useLocation();

//     const toggleMenu = () => setIsOpen(!isOpen);
//     const closeMenu = () => setIsOpen(false);

//     // Reusable NavLink component for cleaner code and consistent styling
//     const NavLink = ({ to, label, isButton = false }) => {
//         const baseClasses = `block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200`;
//         const activeClasses = `bg-purple-600 text-white shadow`;
//         const inactiveClasses = `text-gray-700 hover:bg-purple-100 hover:text-purple-800`;
//         // Specific styles for the logout button
//         const logoutClasses = `text-purple-600 border border-purple-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700`;

//         if (isButton) {
//             return (
//                 <button
//                     onClick={() => {
//                         onLogout();
//                         closeMenu(); // Close menu on logout
//                     }}
//                     // Ensure button fills width on mobile and centers on desktop if needed
//                     className={`${baseClasses} ${logoutClasses} w-full text-left md:w-auto md:text-center`}
//                 >
//                     {label}
//                 </button>
//             );
//         }

//         return (
//             <Link
//                 to={to}
//                 onClick={closeMenu}
//                 className={`${baseClasses} ${
//                     location.pathname === to ? activeClasses : inactiveClasses
//                 }`}
//             >
//                 {label}
//             </Link>
//         );
//     };

//     return (
//         <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-full px-4 py-2 md:px-6">
//             <div className="flex items-center justify-between h-12 md:h-auto">
//                 {/* Logo */}
//                 <Link
//                     to="/"
//                     onClick={closeMenu}
//                     className="text-lg font-bold text-purple-700 whitespace-nowrap hover:text-purple-800 transition-colors mr-4 flex-shrink-0" // flex-shrink-0 to prevent shrinking
//                 >
//                     AI Interview Pro
//                 </Link>

//                 {/* Desktop Nav Links */}
//                 <div className="hidden md:flex items-center gap-4">
//                     {!user ? (
//                         <>
//                             <NavLink to="/login" label="Login" />
//                             <NavLink to="/signup" label="Signup" />
//                         </>
//                     ) : (
//                         <>
//                             <NavLink to="/" label="Home" />
//                             <NavLink to="/interview/new" label="Create Interview" />
//                             <NavLink to="/settings" label="Settings" /> {/* Added Settings link */}
//                             <NavLink label="Logout" isButton={true} />
//                         </>
//                     )}
//                 </div>

//                 {/* Mobile Menu Toggle */}
//                 <div className="md:hidden flex items-center"> {/* Added flex and items-center for vertical alignment */}
//                     <button
//                         onClick={toggleMenu}
//                         className="text-gray-600 hover:text-purple-700 focus:outline-none p-2 rounded-full focus:ring-2 focus:ring-purple-400" // Added focus ring
//                         aria-controls="mobile-menu" // For accessibility
//                         aria-expanded={isOpen ? "true" : "false"} // For accessibility
//                         aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
//                     >
//                         {isOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu Items (animated slide-down) */}
//             <div
//                 id="mobile-menu" // For aria-controls
//                 className={`md:hidden absolute w-full left-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out origin-top ${
//                     isOpen ? 'scale-y-100 opacity-100 py-4 max-h-screen' : 'scale-y-0 opacity-0 h-0 pointer-events-none' // max-h-screen for animation, pointer-events-none to prevent interaction when hidden
//                 } `}
//                 // Tailwind classes for positioning directly below the navbar content,
//                 // matching its rounded bottom corners
//                 style={{ top: '100%', borderRadius: '0 0 2rem 2rem' }}
//             >
//                 <div className="flex flex-col items-start px-4 gap-2">
//                     {!user ? (
//                         <>
//                             <NavLink to="/login" label="Login" />
//                             <NavLink to="/signup" label="Signup" />
//                         </>
//                     ) : (
//                         <>
//                             <NavLink to="/" label="Home" />
//                             <NavLink to="/interview/new" label="Create Interview" />
//                             <NavLink to="/settings" label="Settings" /> {/* Added Settings link to mobile */}
//                             <NavLink label="Logout" isButton={true} />
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Using lucide-react for icons

const Navbar = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Reusable NavLink component for cleaner code and consistent styling
    const NavLink = ({ to, label, isButton = false }) => {
        // Base classes for all links/buttons
        const baseClasses = `block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                             no-underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2`;

        // Classes for active state (current page)
        const activeClasses = `bg-purple-600 text-white shadow-md transform hover:scale-105 active:scale-95`;

        // Classes for inactive state (not current page)
        const inactiveClasses = `text-gray-700 hover:bg-purple-100 hover:text-purple-800
                                 transform hover:scale-105 active:scale-95`;

        // Specific styles for the logout button
        const logoutClasses = `text-purple-600 border border-purple-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700`;


        if (isButton) {
            return (
                <button
                    onClick={() => {
                        onLogout();
                        closeMenu(); // Close menu on logout
                    }}
                    // Ensure button fills width on mobile and centers on desktop if needed
                    className={`${baseClasses} ${logoutClasses} w-full text-left md:w-auto md:text-center`}
                >
                    {label}
                </button>
            );
        }

        return (
            <Link
                to={to}
                onClick={closeMenu}
                className={`${baseClasses} ${
                    location.pathname === to ? activeClasses : inactiveClasses
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-full px-4 py-2 md:px-6 w-[calc(100%-2rem)] md:w-auto max-w-[90rem]">
            <div className="flex items-center justify-between h-12 md:h-auto">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-lg md:text-xl font-bold text-purple-700 whitespace-nowrap hover:text-purple-800 transition-colors mr-4 flex-shrink-0"
                >
                    AI Interview Pro
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <>
                            <NavLink to="/login" label="Login" />
                            <NavLink to="/signup" label="Signup" />
                        </>
                    ) : (
                        <>
                            <NavLink to="/" label="Home" />
                            <NavLink to="/interview/new" label="Create Interview" />
                            <NavLink to="/settings" label="Settings" />
                            <NavLink label="Logout" isButton={true} />
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-purple-700 focus:outline-none p-2 rounded-full focus:ring-2 focus:ring-purple-400"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen ? "true" : "false"}
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Items (animated slide-down) */}
            <div
                id="mobile-menu"
                className={`md:hidden absolute w-full left-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out origin-top
                            ${isOpen ? 'scale-y-100 opacity-100 py-4 max-h-screen' : 'scale-y-0 opacity-0 h-0 pointer-events-none'}
                            overflow-hidden`}  
                style={{ top: '100%', borderRadius: '0 0 2rem 2rem' }}
            >
                <div className="flex flex-col items-start px-4 gap-2">
                    {!user ? (
                        <>
                            <NavLink to="/login" label="Login" />
                            <NavLink to="/signup" label="Signup" />
                        </>
                    ) : (
                        <>
                            <NavLink to="/" label="Home" />
                            <NavLink to="/interview/new" label="Create Interview" />
                            <NavLink to="/settings" label="Settings" />
                            <NavLink label="Logout" isButton={true} />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;