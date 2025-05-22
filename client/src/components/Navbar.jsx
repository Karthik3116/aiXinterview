
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


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      onClick={closeMenu}
      className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium ${
        location.pathname === to
          ? 'bg-indigo-600 text-white'
          : 'text-white hover:bg-indigo-500 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-indigo-400"
              onClick={closeMenu}
            >
              AI Interview
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <NavLink to="/login" label="Login" />
                <NavLink to="/signup" label="Signup" />
              </>
            ) : (
              <>
                <NavLink to="/" label="Home" />
                <NavLink to="/interview/new" label="Create Interview" />
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu items */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {!user ? (
            <>
              <NavLink to="/login" label="Login" />
              <NavLink to="/signup" label="Signup" />
            </>
          ) : (
            <>
              <NavLink to="/" label="Home" />
              <NavLink to="/interview/new" label="Create Interview" />
              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
