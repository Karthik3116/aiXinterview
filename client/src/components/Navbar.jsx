// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ user, onLogout }) => {
//   return (
//     <nav className="navbar navbar-expand navbar-light bg-light px-3">
//       <Link to="/" className="navbar-brand">MyApp</Link>
//       <div className="navbar-nav ms-auto">
//         {user ? (
//           <>
//             <Link to="/interview" className="nav-link">Start Interview</Link>
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


// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">AI Interview</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/interview/new">Create Interview</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={onLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;