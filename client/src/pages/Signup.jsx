import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState(''); // Add username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
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
        <button className="btn btn-success mt-2" type="submit">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
