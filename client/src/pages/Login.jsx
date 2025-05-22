
// // src/pages/Login.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async e => {
//   e.preventDefault();
//   try {
//     const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//     const { token, user } = res.data;
//     const userId = user?.id; // Ensure you get user.id from backend

//     if (token && userId) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('userId', userId);
//       setUser({ token, userId });
//       navigate('/');
//     } else {
//       alert('Login failed: token or userId missing from response');
//     }
//   } catch (err) {
//     alert('Login failed. Please check credentials.');
//   }
// };


//   return (
//     <div className="container mt-5" style={{ maxWidth: '400px' }}>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           className="form-control my-2"
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           className="form-control my-2"
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button className="btn btn-primary mt-2" type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://aixinterview.onrender.com/api/auth/login', { email, password });
      const { token, user } = res.data;
      const userId = user?.id;

      if (token && userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setUser({ token, userId });
        navigate('/');
      } else {
        alert('Login failed: token or userId missing from response');
      }
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };


  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-green-600 hover:underline">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
