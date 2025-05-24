// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Import toast
// import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS in your entry file (e.g., App.js or main.jsx)

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // New loading state
//   const navigate = useNavigate();

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true); // Set loading to true when form is submitted
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { email, password });
//       const { token, user } = res.data;
//       const userId = user?.id;

//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setUser({ token, userId });
//         toast.success("Login successful! Redirecting..."); // Success toast
//         navigate('/'); // Navigate to dashboard or home after successful login
//       } else {
//         toast.error('Login failed: token or userId missing from response.'); // Error toast
//       }
//     } catch (err) {
//       console.error('Login error:', err.response?.data || err.message);
//       // Use Toastify for error messages
//       toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false); // Set loading to false after request completes
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-8">
//       <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-100 transform transition-all duration-300 hover:scale-[1.01]">
//         <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
//           Welcome Back!
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="email">Email Address</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="your.email@example.com"
//               required
//               className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="password">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading} // Disable button when loading
//             className={`w-full text-white py-3.5 px-6 rounded-xl text-lg font-bold shadow-lg transition duration-300 ease-in-out
//               ${loading
//                 ? 'bg-gray-400 cursor-not-allowed' // Grey out and change cursor when loading
//                 : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
//               }`}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Logging In...
//               </span>
//             ) : (
//               'Log In'
//             )}
//           </button>
//         </form>
//         <p className="mt-8 text-base text-center text-gray-600">
//           Don’t have an account?{' '}
//           <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors duration-200">
//             Sign up here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS in your entry file (e.g., App.js or main.jsx)

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      // Make sure VITE_API_BASE_URL is correctly configured in your .env file
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      const userId = user?.id;

      if (token && userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setUser({ token, userId });
        toast.success("Login successful! Redirecting..."); // Success toast
        navigate('/'); // Navigate to dashboard or home after successful login
      } else {
        toast.error('Login failed: token or userId missing from response.'); // Error toast
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      // Use Toastify for error messages
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    // Main container with a subtle background and padding
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 md:p-8">
      {/* Container for the two-column layout, giving it rounded corners and a shadow */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[70vh]">
        {/* Left Section: Welcome Back! message with design patterns */}
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden flex-shrink-0">
          {/* Abstract shapes for design pattern */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full -translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full translate-x-32 translate-y-32"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-400 opacity-15 rounded-full"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 animate-fade-in-up">
              Welcome Back!
            </h2>
            <p className="text-lg md:text-xl font-light opacity-90 animate-fade-in-up delay-100">
              Glad to see you again. Sign in to continue your journey.
            </p>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white flex-shrink-0">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading} // Disable button when loading
                className={`w-full text-white py-3.5 px-6 rounded-xl text-lg font-bold shadow-lg transition duration-300 ease-in-out
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed' // Grey out and change cursor when loading
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging In...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
            <p className="mt-8 text-base text-center text-gray-600">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
