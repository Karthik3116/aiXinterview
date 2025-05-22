
// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import GuestLanding from './pages/GuestLanding'; // import the guest landing page

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
        {/* Show Home if logged in, else show GuestLanding */}
        <Route path="/" element={user ? <Home user={user} /> : <GuestLanding />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        {/* Route for creating a new interview */}
        <Route
          path="/interview/new"
          element={user ? <Interview user={user} /> : <Navigate to="/login" />}
        />
        {/* Route for viewing/continuing an existing interview */}
        <Route
          path="/interview/:interviewId"
          element={user ? <Interview user={user} /> : <Navigate to="/login" />}
        />
        {/* Route for feedback */}
        <Route
          path="/interview/:interviewId/feedback"
          element={user ? <Feedback /> : <Navigate to="/login" />}
        />
        {/* Redirect unknown paths */}
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
