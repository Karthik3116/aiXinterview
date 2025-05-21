// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// // const Login = ({ setUser }) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const navigate = useNavigate();

// //   const handleSubmit = async e => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
// //       const { token, userId } = res.data;
// //       localStorage.setItem('token', token);
// //       localStorage.setItem('userId', userId);
// //       setUser({ token, userId });
// //       navigate('/');
// //     } catch (err) {
// //       alert('Login failed. Please check credentials.');
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2>Login</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input className="form-control my-2" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
// //         <input className="form-control my-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
// //         <button className="btn btn-primary mt-2" type="submit">Login</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Login;


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
//     const userId = user?.id;

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


// src/pages/Login.js
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
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, user } = res.data;
    const userId = user?.id; // Ensure you get user.id from backend

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
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="form-control my-2"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="btn btn-primary mt-2" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;