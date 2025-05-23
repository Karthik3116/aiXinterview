
// // export default Navbar;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ user, onLogout }) => {
//   return (
//     <nav className="bg-gray-900 text-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo / Brand */}
//           <div className="flex-shrink-0">
//             <Link to="/" className="text-xl font-bold text-white hover:text-indigo-400">
//               AI Interview
//             </Link>
//           </div>

//           {/* Menu Toggle (for mobile if needed in the future) */}
//           {/* You can implement mobile toggle logic here if desired */}

//           {/* Right Menu */}
//           <div className="hidden md:flex space-x-4 items-center">
//             {!user ? (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Signup
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/"
//                   className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   to="/interview/new"
//                   className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Create Interview
//                 </Link>
//                 <button
//                   onClick={onLogout}
//                   className="text-white hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';

// const Navbar = ({ user, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const closeMenu = () => setIsOpen(false);

//   const NavLink = ({ to, label }) => (
//     <Link
//       to={to}
//       onClick={closeMenu}
//       className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium ${
//         location.pathname === to
//           ? 'bg-indigo-600 text-white'
//           : 'text-white hover:bg-indigo-500 hover:text-white'
//       }`}
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link
//               to="/"
//               className="text-2xl font-bold text-white hover:text-indigo-400"
//               onClick={closeMenu}
//             >
//               AI Interview
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="text-gray-300 hover:text-white focus:outline-none"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>

//           {/* Desktop menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {!user ? (
//               <>
//                 <NavLink to="/login" label="Login" />
//                 <NavLink to="/signup" label="Signup" />
//               </>
//             ) : (
//               <>
//                 <NavLink to="/" label="Home" />
//                 <NavLink to="/interview/new" label="Create Interview" />
//                 <button
//                   onClick={onLogout}
//                   className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu items */}
//       {isOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2">
//           {!user ? (
//             <>
//               <NavLink to="/login" label="Login" />
//               <NavLink to="/signup" label="Signup" />
//             </>
//           ) : (
//             <>
//               <NavLink to="/" label="Home" />
//               <NavLink to="/interview/new" label="Create Interview" />
//               <button
//                 onClick={() => {
//                   onLogout();
//                   closeMenu();
//                 }}
//                 className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';

// const Navbar = ({ user, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const closeMenu = () => setIsOpen(false);

//   const NavLink = ({ to, label }) => (
//     <Link
//       to={to}
//       onClick={closeMenu}
//       className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
//         ${
//           location.pathname === to
//             ? 'bg-purple-600 text-white shadow'
//             : 'text-gray-700 hover:bg-purple-100 hover:text-purple-800'
//         }
//       `}
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-full px-6 py-2">
//       <div className="flex items-center justify-between gap-6">
//         {/* Logo */}
//         <Link
//           to="/"
//           onClick={closeMenu}
//           className="text-lg font-bold text-purple-700 whitespace-nowrap hover:text-purple-800 transition-colors"
//         >
//           AI Interview Pro
//         </Link>

//         {/* Desktop nav links */}
//         <div className="hidden md:flex items-center gap-4">
//           {!user ? (
//             <>
//               <NavLink to="/login" label="Login" />
//               <NavLink to="/signup" label="Signup" />
//             </>
//           ) : (
//             <>
//               <NavLink to="/" label="Home" />
//               <NavLink to="/interview/new" label="Create Interview" />
//               <button
//                 onClick={onLogout}
//                 className="px-4 py-2 rounded-full text-sm font-medium text-purple-600 border border-purple-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>

//         {/* Mobile menu toggle */}
//         <div className="md:hidden">
//           <button
//             onClick={toggleMenu}
//             className="text-gray-600 hover:text-purple-700 focus:outline-none"
//             aria-label="Toggle navigation"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu items */}
//       {isOpen && (
//         <div className="md:hidden mt-3 flex flex-col gap-2">
//           {!user ? (
//             <>
//               <NavLink to="/login" label="Login" />
//               <NavLink to="/signup" label="Signup" />
//             </>
//           ) : (
//             <>
//               <NavLink to="/" label="Home" />
//               <NavLink to="/interview/new" label="Create Interview" />
//               <button
//                 onClick={() => {
//                   onLogout();
//                   closeMenu();
//                 }}
//                 className="w-full text-left px-4 py-2 rounded-full text-sm font-medium text-purple-600 hover:bg-red-50 hover:text-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react'; // Using lucide-react for icons

// const Navbar = ({ user, onLogout }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const location = useLocation();

//     const toggleMenu = () => setIsOpen(!isOpen);
//     const closeMenu = () => setIsOpen(false);

//     // Reusable NavLink component for cleaner code
//     const NavLink = ({ to, label, isButton = false }) => {
//         const baseClasses = `block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200`;
//         const activeClasses = `bg-purple-600 text-white shadow`;
//         const inactiveClasses = `text-gray-700 hover:bg-purple-100 hover:text-purple-800`;
//         const logoutClasses = `text-purple-600 border border-purple-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700`;

//         if (isButton) {
//             return (
//                 <button
//                     onClick={() => {
//                         onLogout();
//                         closeMenu(); // Close menu on logout
//                     }}
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
//             <div className="flex items-center justify-between h-12 md:h-auto"> {/* Added fixed height for alignment */}
//                 {/* Logo */}
//                 <Link
//                     to="/"
//                     onClick={closeMenu}
//                     className="text-lg font-bold text-purple-700 whitespace-nowrap hover:text-purple-800 transition-colors mr-4" // Added mr-4 for spacing
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
//                             <NavLink label="Logout" isButton={true} /> {/* Use NavLink for logout button */}
//                             <NavLink to="/settings" label="Setting" />
//                         </>
//                     )}
//                 </div>

//                 {/* Mobile Menu Toggle */}
//                 <div className="md:hidden">
//                     <button
//                         onClick={toggleMenu}
//                         className="text-gray-600 hover:text-purple-700 focus:outline-none p-2 rounded-full" // Added padding for better hit area
//                         aria-label="Toggle navigation"
//                     >
//                         {isOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu Items (animated slide-down) */}
//             {/* Added dynamic height and overflow for smooth animation */}
//             <div
//                 className={`md:hidden absolute w-full left-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out origin-top ${
//                     isOpen ? 'scale-y-100 opacity-100 py-4' : 'scale-y-0 opacity-0 h-0'
//                 } `}
//                 style={{ top: '100%', borderRadius: '0 0 2rem 2rem' }} // Position directly below and match parent width
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
//                             <NavLink label="Logout" isButton={true} /> {/* Use NavLink for logout button */}
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
        const baseClasses = `block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200`;
        const activeClasses = `bg-purple-600 text-white shadow`;
        const inactiveClasses = `text-gray-700 hover:bg-purple-100 hover:text-purple-800`;
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
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-full px-4 py-2 md:px-6">
            <div className="flex items-center justify-between h-12 md:h-auto">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-lg font-bold text-purple-700 whitespace-nowrap hover:text-purple-800 transition-colors mr-4 flex-shrink-0" // flex-shrink-0 to prevent shrinking
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
                            <NavLink to="/settings" label="Settings" /> {/* Added Settings link */}
                            <NavLink label="Logout" isButton={true} />
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center"> {/* Added flex and items-center for vertical alignment */}
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-purple-700 focus:outline-none p-2 rounded-full focus:ring-2 focus:ring-purple-400" // Added focus ring
                        aria-controls="mobile-menu" // For accessibility
                        aria-expanded={isOpen ? "true" : "false"} // For accessibility
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Items (animated slide-down) */}
            <div
                id="mobile-menu" // For aria-controls
                className={`md:hidden absolute w-full left-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out origin-top ${
                    isOpen ? 'scale-y-100 opacity-100 py-4 max-h-screen' : 'scale-y-0 opacity-0 h-0 pointer-events-none' // max-h-screen for animation, pointer-events-none to prevent interaction when hidden
                } `}
                // Tailwind classes for positioning directly below the navbar content,
                // matching its rounded bottom corners
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
                            <NavLink to="/settings" label="Settings" /> {/* Added Settings link to mobile */}
                            <NavLink label="Logout" isButton={true} />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;