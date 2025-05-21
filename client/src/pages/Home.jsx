// import React from 'react';

// const Home = () => {
//   return (
//     <div className="container mt-5">
//       <h1>Welcome to AI Interview Platform</h1>
//       <p>Login to start your voice-based AI interview!</p>
//     </div>
//   );
// };

// export default Home;


// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InterviewCard from '../components/InterviewCard'; // Import the new component

const Home = ({ user }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/interview', {
          headers: {
            'x-auth-token': token,
          },
        });
        setInterviews(res.data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to fetch interviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]); // Refetch when user changes (e.g., login/logout)

  if (!user) {
    return (
      <div className="container mt-5">
        <h1>Welcome to AI Interview Platform</h1>
        <p>Login to start your voice-based AI interview!</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Your Interviews</h1>

      <div className="text-center mb-4">
        <Link to="/interview/new" className="btn btn-lg btn-success">
          <i className="bi bi-plus-circle me-2"></i> Create a New Interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="alert alert-info text-center">
          You haven't taken any interviews yet. Click "Create a New Interview" to get started!
        </div>
      ) : (
        <div className="row">
          {interviews.map((interview) => (
            <div key={interview._id} className="col-md-6 col-lg-4 mb-4">
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;