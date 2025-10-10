

// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Vapi from '@vapi-ai/web';
import axios from 'axios'; // Import axios here

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import GuestLanding from './pages/GuestLanding';
import Settings from './pages/Settings';
import ServerLogs from './components/ServerLogs';

import Auth from './pages/Auth';

import { getWorkingApiBaseUrl } from './utils/apiBase';



const App = () => {
  const [user, setUser] = useState(null);
  const [vapiApiKey, setVapiApiKey] = useState(localStorage.getItem('vapiApiKey') || '');
  const [vapiInstance, setVapiInstance] = useState(null);

  const [bUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const resolveBaseUrl = async () => {
      const url = await getWorkingApiBaseUrl();
      setBaseUrl(url);
    };
    resolveBaseUrl();
  }, []);

  // Create a global instance of Axios directly here
  const axiosInstance = axios.create({
    baseURL: bUrl, // IMPORTANT: Set your backend API base URL
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // --- Axios Interceptor Setup ---
  useEffect(() => {
    // Request Interceptor: Add the token to outgoing requests
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor: Handle token expiration/401 errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          const originalRequest = error.config;

          if (originalRequest._retry) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (error.response.data && error.response.data.message === 'Token expired') {
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            return Promise.reject(error);
          } else {
            toast.error('Authentication failed. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when the component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  // --- End Axios Interceptor Setup ---


  // Initialize Vapi SDK when vapiApiKey changes
  useEffect(() => {
    if (vapiApiKey) {
      const newVapiInstance = new Vapi(vapiApiKey);
      setVapiInstance(newVapiInstance);
    } else {
      setVapiInstance(null);
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

        <Route path="/auth" element={<Auth setUser={setUser} />} />
        
        <Route
          path="/settings"
          element={user ? <Settings currentVapiApiKey={vapiApiKey} onSetVapiApiKey={handleSetVapiApiKey} /> : <Navigate to="/login" />}
        />
        {/* Pass vapiInstance and axiosInstance to Interview component */}
        <Route
          path="/interview/new"
          element={user ? <Interview user={user} vapi={vapiInstance} vapiApiKey={vapiApiKey} axiosInstance={axiosInstance} /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:interviewId"
          element={user ? <Interview user={user} vapi={vapiInstance} vapiApiKey={vapiApiKey} axiosInstance={axiosInstance} /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:interviewId/feedback"
          element={user ? <Feedback axiosInstance={axiosInstance} /> : <Navigate to="/login" />}
        />
        <Route path="/logs" element={ <ServerLogs />} />

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