
// // src/App.jsx
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Interview from './pages/Interview';
// import Feedback from './pages/Feedback';
// import GuestLanding from './pages/GuestLanding'; // import the guest landing page

// const App = () => {
//   const [user, setUser] = useState(null);

//   // On mount, get user info from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (token && userId) {
//       setUser({ token, userId });
//     }
//   }, []);

//   // Sync auth across tabs/windows
//   useEffect(() => {
//     const syncAuthAcrossTabs = (e) => {
//       if (e.key === 'token' || e.key === 'userId') {
//         const token = localStorage.getItem('token');
//         const userId = localStorage.getItem('userId');

//         if (token && userId) {
//           setUser({ token, userId });
//         } else {
//           setUser(null);
//         }
//       }
//     };

//     window.addEventListener('storage', syncAuthAcrossTabs);

//     return () => {
//       window.removeEventListener('storage', syncAuthAcrossTabs);
//     };
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
//         {/* Show Home if logged in, else show GuestLanding */}
//         <Route path="/" element={user ? <Home user={user} /> : <GuestLanding />} />

//         <Route
//           path="/login"
//           element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
//         />
//         <Route
//           path="/signup"
//           element={user ? <Navigate to="/" /> : <Signup />}
//         />
//         {/* Route for creating a new interview */}
//         <Route
//           path="/interview/new"
//           element={user ? <Interview user={user} /> : <Navigate to="/login" />}
//         />
//         {/* Route for viewing/continuing an existing interview */}
//         <Route
//           path="/interview/:interviewId"
//           element={user ? <Interview user={user} /> : <Navigate to="/login" />}
//         />
//         {/* Route for feedback */}
//         <Route
//           path="/interview/:interviewId/feedback"
//           element={user ? <Feedback /> : <Navigate to="/login" />}
//         />
//         {/* Redirect unknown paths */}
//         <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// };

// export default App;
// src/App.jsx
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Interview from './pages/Interview';
// import Feedback from './pages/Feedback';
// import GuestLanding from './pages/GuestLanding'; // import the guest landing page

// const App = () => {
//   const [user, setUser] = useState(null);

//   // On mount, get user info from localStorage
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (token && userId) {
//       setUser({ token, userId });
//     }
//   }, []);

//   // Sync auth across tabs/windows
//   useEffect(() => {
//     const syncAuthAcrossTabs = (e) => {
//       if (e.key === 'token' || e.key === 'userId') {
//         const token = localStorage.getItem('token');
//         const userId = localStorage.getItem('userId');

//         if (token && userId) {
//           setUser({ token, userId });
//         } else {
//           setUser(null);
//         }
//       }
//     };

//     window.addEventListener('storage', syncAuthAcrossTabs);

//     return () => {
//       window.removeEventListener('storage', syncAuthAcrossTabs);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     setUser(null);
//     toast.info("You have been logged out successfully!"); // Add a toast message on logout
//   };

//   return (
//     <>
//       <Navbar user={user} onLogout={handleLogout} />
//       <Routes>
//         {/* Show Home if logged in, else show GuestLanding */}
//         <Route path="/" element={user ? <Home user={user} /> : <GuestLanding />} />

//         <Route
//           path="/login"
//           element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
//         />
//         <Route
//           path="/signup"
//           element={user ? <Navigate to="/" /> : <Signup />}
//         />
//         {/* Route for creating a new interview */}
//         <Route
//           path="/interview/new"
//           element={user ? <Interview user={user} /> : <Navigate to="/login" />}
//         />
//         {/* Route for viewing/continuing an existing interview */}
//         <Route
//           path="/interview/:interviewId"
//           element={user ? <Interview user={user} /> : <Navigate to="/login" />}
//         />
//         {/* Route for feedback */}
//         <Route
//           path="/interview/:interviewId/feedback"
//           element={user ? <Feedback /> : <Navigate to="/login" />}
//         />
//         {/* Redirect unknown paths */}
//         <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
//       </Routes>
//       {/* ToastContainer added here */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light" // You can set the theme to 'light', 'dark', or 'colored'
//       />
//     </>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Vapi from '@vapi-ai/web'; // Import Vapi here

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import GuestLanding from './pages/GuestLanding';
import Settings from './pages/Settings'; // Import the new Settings page

const App = () => {
  const [user, setUser] = useState(null);
  // State to hold the user's Vapi API key
  const [vapiApiKey, setVapiApiKey] = useState(localStorage.getItem('vapiApiKey') || '');
  // State to hold the Vapi SDK instance
  const [vapiInstance, setVapiInstance] = useState(null);

  // Initialize Vapi SDK when vapiApiKey changes
  useEffect(() => {
    if (vapiApiKey) {
      const newVapiInstance = new Vapi(vapiApiKey);
      setVapiInstance(newVapiInstance);
      // Optional: Add a log or toast to confirm Vapi initialization
      // toast.success("Vapi SDK initialized with provided key!");
    } else {
      setVapiInstance(null); // Clear Vapi instance if key is removed
    }
  }, [vapiApiKey]);

  // On mount, get user info and Vapi key from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const storedVapiApiKey = localStorage.getItem('vapiApiKey');

    if (token && userId) {
      setUser({ token, userId });
    }
    if (storedVapiApiKey) {
      setVapiApiKey(storedVapiApiKey);
    }
  }, []);

  // Sync auth and Vapi API key across tabs/windows
  useEffect(() => {
    const syncAuthAndSettingsAcrossTabs = (e) => {
      if (e.key === 'token' || e.key === 'userId') {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          setUser({ token, userId });
        } else {
          setUser(null);
        }
      }
      if (e.key === 'vapiApiKey') {
        const newVapiApiKey = localStorage.getItem('vapiApiKey');
        setVapiApiKey(newVapiApiKey || '');
      }
    };

    window.addEventListener('storage', syncAuthAndSettingsAcrossTabs);

    return () => {
      window.removeEventListener('storage', syncAuthAndSettingsAcrossTabs);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    toast.info("You have been logged out successfully!");
  };

  const handleSetVapiApiKey = (key) => {
    setVapiApiKey(key);
    localStorage.setItem('vapiApiKey', key);
    toast.success('Vapi API Key saved!');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={user ? <Home user={user} /> : <GuestLanding />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        {/* Route for Settings page */}
        <Route
          path="/settings"
          element={user ? <Settings currentVapiApiKey={vapiApiKey} onSetVapiApiKey={handleSetVapiApiKey} /> : <Navigate to="/login" />}
        />
        {/* Pass vapiInstance to Interview component */}
        <Route
          path="/interview/new"
          element={user ? <Interview user={user} vapi={vapiInstance} vapiApiKey={vapiApiKey} /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:interviewId"
          element={user ? <Interview user={user} vapi={vapiInstance} vapiApiKey={vapiApiKey} /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:interviewId/feedback"
          element={user ? <Feedback /> : <Navigate to="/login" />}
        />
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;