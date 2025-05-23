
// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import InterviewCard from '../components/InterviewCard';

// const Home = ({ user }) => {
//   const [interviews, setInterviews] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typedSearch, setTypedSearch] = useState('');
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [itemsPerPage, setItemsPerPage] = useState(6);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const loaderRef = useRef();
//   const observerRef = useRef(null);

//   // 📏 Responsive items per page
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width < 640) setItemsPerPage(4);
//       else if (width < 1024) setItemsPerPage(6);
//       else setItemsPerPage(9);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // 📡 Fetch interviews
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       if (!user || !user.token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/interview`, {
//           headers: { 'x-auth-token': token },
//         });
//         setInterviews(res.data);
//         setFiltered(res.data);
//       } catch (err) {
//         setError('Failed to fetch interviews. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInterviews();
//   }, [user]);

//   // 🔍 Smarter search logic (triggered only on space or Enter)
//   useEffect(() => {
//     if (!searchTerm) {
//       setFiltered(interviews);
//       return;
//     }

//     const keywords = searchTerm.toLowerCase().split(/\s+/);
//     const filteredResults = interviews.filter(({ subject }) => {
//       const lowerSubject = subject.toLowerCase();
//       return keywords.some((kw) => lowerSubject.includes(kw));
//     });

//     setFiltered(filteredResults);
//   }, [searchTerm, interviews]);

//   // 🔁 Infinite scroll logic
//   useEffect(() => {
//     if (!loaderRef.current || visibleCount >= filtered.length) return;

//     observerRef.current = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setVisibleCount((prev) => {
//           const nextCount = prev + itemsPerPage;
//           if (nextCount >= filtered.length && observerRef.current) {
//             observerRef.current.disconnect();
//           }
//           return nextCount;
//         });
//       }
//     });

//     observerRef.current.observe(loaderRef.current);

//     return () => observerRef.current?.disconnect();
//   }, [filtered, visibleCount, itemsPerPage]);

//   if (!user) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 px-4 text-center">
//         <h1 className="text-3xl font-bold">Welcome to AI Interview Platform</h1>
//         <p className="mt-2 text-gray-600">Login to start your voice-based AI interview!</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center mt-10">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
//         <p className="mt-3 text-gray-700">Loading your interviews...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="mt-10 max-w-md mx-auto text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 mt-10">
//       <h1 className="text-3xl font-bold text-center mb-6">Your Interviews</h1>

//       <div className="text-center mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//         <Link
//           to="/interview/new"
//           className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           <span className="mr-2">+</span> Create a New Interview
//         </Link>

//         <input
//           type="text"
//           placeholder="Search by subject..."
//           value={typedSearch}
//           onChange={(e) => setTypedSearch(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === ' ' || e.key === 'Enter') {
//               setSearchTerm(typedSearch.trim());
//               setVisibleCount(itemsPerPage);
//             }
//           }}
//           className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {filtered.length === 0 ? (
//         <div className="text-center text-blue-500">No interviews found.</div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filtered.slice(0, visibleCount).map((interview) => (
//               <InterviewCard key={interview._id} interview={interview} />
//             ))}
//           </div>

//           {visibleCount < filtered.length && (
//             <div ref={loaderRef} className="flex justify-center mt-8">
//               <div className="animate-spin h-6 w-6 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import InterviewCard from '../components/InterviewCard'; // Assuming this component exists and is styled appropriately
// import { toast } from 'react-toastify'; // Import toast

// const Home = ({ user }) => {
//   const [interviews, setInterviews] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typedSearch, setTypedSearch] = useState('');
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [itemsPerPage, setItemsPerPage] = useState(6);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const loaderRef = useRef();
//   const observerRef = useRef(null);

//   // 📏 Responsive items per page
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width < 640) setItemsPerPage(4);
//       else if (width < 1024) setItemsPerPage(6);
//       else setItemsPerPage(9);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // 📡 Fetch interviews
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       if (!user || !user.token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/interview`, {
//           headers: { 'x-auth-token': token },
//         });
//         setInterviews(res.data);
//         setFiltered(res.data);
//       } catch (err) {
//         console.error('Failed to fetch interviews:', err);
//         setError('Failed to load your interviews. Please try refreshing the page.');
//         toast.error('Failed to load interviews.'); // Toast message for error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInterviews();
//   }, [user]);

//   // 🔍 Smarter search logic (triggered only on space or Enter)
//   useEffect(() => {
//     if (!searchTerm) {
//       setFiltered(interviews);
//       return;
//     }

//     const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean); // Filter out empty strings from split
//     const filteredResults = interviews.filter(({ subject }) => {
//       const lowerSubject = subject.toLowerCase();
//       return keywords.every((kw) => lowerSubject.includes(kw)); // Use every for "AND" logic
//     });

//     setFiltered(filteredResults);
//     setVisibleCount(itemsPerPage); // Reset visible count on new search
//   }, [searchTerm, interviews, itemsPerPage]);

//   // 🔁 Infinite scroll logic
//   useEffect(() => {
//     // Disconnect existing observer if any
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//     }

//     if (!loaderRef.current || visibleCount >= filtered.length) return;

//     const options = {
//       root: null, // viewport
//       rootMargin: '20px',
//       threshold: 1.0
//     };

//     observerRef.current = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !loading) { // Only load more if not currently loading
//         setVisibleCount((prev) => {
//           const nextCount = prev + itemsPerPage;
//           return nextCount;
//         });
//       }
//     }, options);

//     observerRef.current.observe(loaderRef.current);

//     return () => observerRef.current?.disconnect();
//   }, [filtered, visibleCount, itemsPerPage, loading]); // Added loading to dependencies

//   if (!user) {
//     return (
//       <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 px-4 py-12">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight text-gray-900">
//           Welcome to <span className="text-purple-600">AI Interview Pro</span>
//         </h1>
//         <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
//           Unlock your potential with voice-based AI interviews tailored to your needs. Practice, get feedback, and ace your next interview!
//         </p>
//         <Link
//           to="/login"
//           className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//         >
//           Get Started Now
//           <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </Link>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white px-4 py-12">
//         <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent mb-4"></div>
//         <p className="text-xl font-medium text-gray-700">Loading your interviews...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 py-12">
//         <div className="text-red-600 text-center text-lg font-medium p-6 border border-red-300 rounded-lg shadow-md">
//           <p className="mb-2">Oops! Something went wrong.</p>
//           <p>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-white py-10 px-4 sm:px-6 lg:px-8 pt-32"> {/* Increased padding to pt-32 */}
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
//           Your AI Interviews
//         </h1>

//         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
//           <Link
//             to="/interview/new"
//             className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Start New Interview
//           </Link>

//           <div className="relative w-full sm:w-80">
//             <input
//               type="text"
//               placeholder="Search interviews by subject..."
//               value={typedSearch}
//               onChange={(e) => setTypedSearch(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') { // Trigger search on Enter or Space
//                   setSearchTerm(typedSearch.trim());
//                 }
//               }}
//               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-200 text-gray-800 placeholder-gray-400"
//             />
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {filtered.length === 0 ? (
//           <div className="text-center text-lg text-gray-600 p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50 animate-fadeIn">
//             <p className="mb-4">No interviews found. Start a new one to see it appear here!</p>
//             <Link
//               to="/interview/new"
//               className="inline-flex items-center justify-center px-6 py-2 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition duration-200"
//             >
//               Create First Interview
//             </Link>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {filtered.slice(0, visibleCount).map((interview) => (
//                 <InterviewCard key={interview._id} interview={interview} />
//               ))}
//             </div>

//             {visibleCount < filtered.length && (
//               <div ref={loaderRef} className="flex justify-center mt-12">
//                 <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
//               </div>
//             )}
//              {visibleCount >= filtered.length && filtered.length > 0 && (
//                 <div className="text-center text-gray-500 mt-12">
//                     <p>You've seen all your interviews!</p>
//                 </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InterviewCard from '../components/InterviewCard'; // Assuming this component exists and is styled appropriately
import { toast } from 'react-toastify'; // Import toast

const Home = ({ user }) => {
    const [interviews, setInterviews] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]); // Renamed from 'filtered' to avoid confusion with main display
    const [searchTerm, setSearchTerm] = useState('');
    const [typedSearch, setTypedSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false); // New state for search loading
    const [error, setError] = useState(null);
    const [showResultsPanel, setShowResultsPanel] = useState(false); // New state to control sidebar visibility
    const loaderRef = useRef();
    const observerRef = useRef(null);
    const searchTimeoutRef = useRef(null); // Ref for debounce timeout

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
                // On initial fetch, show all interviews in the main grid
                // The main grid will always show all interviews that are not filtered out by the search term
                // If there's no search term, it shows all.
                // If there is a search term, the main grid will still show all interviews, and the filtered results
                // will be displayed in the sidebar.
            } catch (err) {
                console.error('Failed to fetch interviews:', err);
                setError('Failed to load your interviews. Please try refreshing the page.');
                toast.error('Failed to load interviews.'); // Toast message for error
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [user]);

    // 🔍 Smarter search logic with debounce and fake loading
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (typedSearch.trim() === '') {
            setSearchTerm('');
            setFilteredResults([]);
            setSearching(false);
            setShowResultsPanel(false); // Hide panel if search is empty
            return;
        }

        setSearching(true); // Start fake loading immediately
        setShowResultsPanel(true); // Show panel as soon as typing starts

        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(typedSearch.trim()); // Actual search term update after debounce
            setSearching(false); // End fake loading
        }, 500); // Debounce for 500ms
    }, [typedSearch]);

    // Apply filtering based on searchTerm
    useEffect(() => {
        if (!searchTerm) {
            setFilteredResults([]); // No search term, no filtered results in sidebar
            return;
        }

        const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const results = interviews.filter(({ subject }) => {
            const lowerSubject = subject.toLowerCase();
            return keywords.every((kw) => lowerSubject.includes(kw));
        });

        setFilteredResults(results);
        setVisibleCount(itemsPerPage); // Reset visible count for main grid display
    }, [searchTerm, interviews, itemsPerPage]);


    // 🔁 Infinite scroll logic for the main grid (unaffected by sidebar search)
    useEffect(() => {
        // Disconnect existing observer if any
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Only observe if there are more items to load in the main grid
        if (!loaderRef.current || visibleCount >= interviews.length) return;

        const options = {
            root: null, // viewport
            rootMargin: '20px',
            threshold: 1.0
        };

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) { // Only load more if not currently loading global interviews
                setVisibleCount((prev) => {
                    const nextCount = prev + itemsPerPage;
                    return nextCount;
                });
            }
        }, options);

        observerRef.current.observe(loaderRef.current);

        return () => observerRef.current?.disconnect();
    }, [interviews, visibleCount, itemsPerPage, loading]); // Dependencies for main grid infinite scroll

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 px-4 py-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight text-gray-900">
                    Welcome to <span className="text-purple-600">AI Interview Pro</span>
                </h1>
                <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
                    Unlock your potential with voice-based AI interviews tailored to your needs. Practice, get feedback, and ace your next interview!
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                    Get Started Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white px-4 py-12">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent mb-4"></div>
                <p className="text-xl font-medium text-gray-700">Loading your interviews...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 py-12">
                <div className="text-red-600 text-center text-lg font-medium p-6 border border-red-300 rounded-lg shadow-md">
                    <p className="mb-2">Oops! Something went wrong.</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white py-10 px-4 sm:px-6 lg:px-8 pt-32 flex">
            {/* Main Content Area */}
            <div className={`flex-1 ${showResultsPanel ? 'pr-4 lg:pr-8' : ''}`}> {/* Adjusted padding when panel is open */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
                        Your AI Interviews
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                        <Link
                            to="/interview/new"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Start New Interview
                        </Link>

                        <div className="relative w-full sm:w-80">
                            <input
                                type="text"
                                placeholder="Search interviews by subject..."
                                value={typedSearch}
                                onChange={(e) => setTypedSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-200 text-gray-800 placeholder-gray-400"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searching && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {interviews.length === 0 && !loading ? (
                        <div className="text-center text-lg text-gray-600 p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50 animate-fadeIn">
                            <p className="mb-4">No interviews found. Start a new one to see it appear here!</p>
                            <Link
                                to="/interview/new"
                                className="inline-flex items-center justify-center px-6 py-2 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition duration-200"
                            >
                                Create First Interview
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {interviews.slice(0, visibleCount).map((interview) => (
                                    <InterviewCard key={interview._id} interview={interview} />
                                ))}
                            </div>

                            {visibleCount < interviews.length && (
                                <div ref={loaderRef} className="flex justify-center mt-12">
                                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                                </div>
                            )}
                            {visibleCount >= interviews.length && interviews.length > 0 && (
                                <div className="text-center text-gray-500 mt-12">
                                    <p>You've seen all your interviews!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Right Sidebar for Search Results */}
            {showResultsPanel && filteredResults.length > 0 && (
                <div className="w-full lg:w-80 bg-gray-50 p-6 border-l border-gray-200 shadow-lg fixed right-0 top-0 h-full overflow-y-auto pt-32 hidden lg:block"> {/* Only show on large screens */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h3>
                    {filteredResults.length === 0 ? (
                        <p className="text-gray-600">No matching interviews.</p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredResults.map((interview) => (
                                <li key={interview._id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                                    <h4 className="font-semibold text-lg text-gray-900 mb-1">{interview.subject}</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {interview.completed ? 'Completed' : 'In Progress'}
                                    </p>
                                    <Link
                                        to={`/interview/${interview._id}`}
                                        className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition duration-200"
                                    >
                                        View Interview
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {/* For small screens, a simple message for search results */}
            {showResultsPanel && filteredResults.length === 0 && typedSearch.trim() !== '' && (
                 <div className="w-full lg:w-80 bg-gray-50 p-6 border-l border-gray-200 shadow-lg fixed right-0 top-0 h-full overflow-y-auto pt-32 hidden lg:block">
                     <h3 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h3>
                     <p className="text-gray-600">No matching interviews.</p>
                 </div>
            )}
        </div>
    );
};

export default Home;