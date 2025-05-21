// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ user, onLogout }) => {
//   return (
//     <nav className="navbar navbar-expand navbar-light bg-light px-3">
//       <Link to="/" className="navbar-brand">MyApp</Link>
//       <div className="navbar-nav ms-auto">
//         {user ? (
//           <>
//             <span className="nav-link">User ID: {user.userId}</span>
//             <button className="btn btn-link nav-link" onClick={onLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="nav-link">Login</Link>
//             <Link to="/signup" className="nav-link">Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light px-3">
      <Link to="/" className="navbar-brand">MyApp</Link>
      <div className="navbar-nav ms-auto">
        {user ? (
          <>
            <Link to="/interview" className="nav-link">Start Interview</Link>
            <span className="nav-link">User ID: {user.userId}</span>
            <button className="btn btn-link nav-link" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
