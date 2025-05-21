
// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InterviewCard from '../components/InterviewCard';

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
          headers: { 'x-auth-token': token },
        });
        setInterviews(res.data);
      } catch (err) {
        setError('Failed to fetch interviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4 text-center">
        <h1 className="text-3xl font-bold">Welcome to AI Interview Platform</h1>
        <p className="mt-2 text-gray-600">Login to start your voice-based AI interview!</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-3 text-gray-700">Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return <div className="mt-10 max-w-md mx-auto text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Your Interviews</h1>
      <div className="text-center mb-6">
        <Link to="/interview/new" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <span className="mr-2">+</span> Create a New Interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center text-blue-500">No interviews yet. Start one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
