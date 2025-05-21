

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Interview from './pages/Interview';
// import Feedback from './pages/Feedback';

// const App = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const syncAuthAcrossTabs = (e) => {
//       if (e.key === 'token' || e.key === 'userId') {
//         const token = localStorage.getItem('token');
//         const userId = localStorage.getItem('userId');

//         // If both exist => user logged in
//         if (token && userId) {
//           setUser({ token, userId });
//         } else {
//           // If either is missing => user logged out
//           setUser(null);
//         }
//       }
//     };

//     window.addEventListener('storage', syncAuthAcrossTabs);

//     return () => {
//       window.removeEventListener('storage', syncAuthAcrossTabs);
//     };
//   }, []);



//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (token && userId) {
//       setUser({ token, userId });
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     setUser(null);
//   };

//   return (
//     <>
//       <Navbar user={user} onLogout={handleLogout} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
//         <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
//         <Route path="/interview" element={user ? <Interview user={user} /> : <Navigate to="/login" />} />
//         <Route path="/interview/:interviewId/feedback/:feedbackId" element={user ? <Feedback /> : <Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';

const App = () => {
  const [user, setUser] = useState(null);

  // On mount, get user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ token, userId });
    }
  }, []);

  // Sync auth across tabs/windows
  useEffect(() => {
    const syncAuthAcrossTabs = (e) => {
      if (e.key === 'token' || e.key === 'userId') {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          setUser({ token, userId });
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', syncAuthAcrossTabs);

    return () => {
      window.removeEventListener('storage', syncAuthAcrossTabs);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/interview"
          element={user ? <Interview user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:interviewId/feedback/:feedbackId"
          element={user ? <Feedback /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
