

// // src/components/Navbar.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ user, onLogout }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">AI Interview</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             {!user ? (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">Login</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/signup">Signup</Link>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/">Home</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/interview/new">Create Interview</Link>
//                 </li>
//                 <li className="nav-item">
//                   <button className="nav-link btn btn-link" onClick={onLogout}>Logout</button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white hover:text-indigo-400">
              AI Interview
            </Link>
          </div>

          {/* Menu Toggle (for mobile if needed in the future) */}
          {/* You can implement mobile toggle logic here if desired */}

          {/* Right Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/interview/new"
                  className="text-white hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create Interview
                </Link>
                <button
                  onClick={onLogout}
                  className="text-white hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
