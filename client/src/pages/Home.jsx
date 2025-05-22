
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InterviewCard from '../components/InterviewCard';

const Home = ({ user }) => {
  const [interviews, setInterviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typedSearch, setTypedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loaderRef = useRef();
  const observerRef = useRef(null);

  // 📏 Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(4);
      else if (width < 1024) setItemsPerPage(6);
      else setItemsPerPage(9);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📡 Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/interview`, {
          headers: { 'x-auth-token': token },
        });
        setInterviews(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError('Failed to fetch interviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user]);

  // 🔍 Smarter search logic (triggered only on space or Enter)
  useEffect(() => {
    if (!searchTerm) {
      setFiltered(interviews);
      return;
    }

    const keywords = searchTerm.toLowerCase().split(/\s+/);
    const filteredResults = interviews.filter(({ subject }) => {
      const lowerSubject = subject.toLowerCase();
      return keywords.some((kw) => lowerSubject.includes(kw));
    });

    setFiltered(filteredResults);
  }, [searchTerm, interviews]);

  // 🔁 Infinite scroll logic
  useEffect(() => {
    if (!loaderRef.current || visibleCount >= filtered.length) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((prev) => {
          const nextCount = prev + itemsPerPage;
          if (nextCount >= filtered.length && observerRef.current) {
            observerRef.current.disconnect();
          }
          return nextCount;
        });
      }
    });

    observerRef.current.observe(loaderRef.current);

    return () => observerRef.current?.disconnect();
  }, [filtered, visibleCount, itemsPerPage]);

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

      <div className="text-center mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/interview/new"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <span className="mr-2">+</span> Create a New Interview
        </Link>

        <input
          type="text"
          placeholder="Search by subject..."
          value={typedSearch}
          onChange={(e) => setTypedSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              setSearchTerm(typedSearch.trim());
              setVisibleCount(itemsPerPage);
            }
          }}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-blue-500">No interviews found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, visibleCount).map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div ref={loaderRef} className="flex justify-center mt-8">
              <div className="animate-spin h-6 w-6 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
