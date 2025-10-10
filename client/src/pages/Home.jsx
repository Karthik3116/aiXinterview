

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import InterviewCard from '../components/InterviewCard';
// import { toast } from 'react-toastify';
// import Fuse from 'fuse.js'; // Import Fuse.js

// import { getWorkingApiBaseUrl } from '../utils/apiBase'; // adjust path accordingly

// const Home = ({ user }) => {
//     const [interviews, setInterviews] = useState([]);
//     const [filteredResults, setFilteredResults] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [typedSearch, setTypedSearch] = useState('');
//     const [visibleCount, setVisibleCount] = useState(6);
//     const [itemsPerPage, setItemsPerPage] = useState(6);
//     const [loading, setLoading] = useState(true);
//     const [searching, setSearching] = useState(false);
//     const [error, setError] = useState(null);
//     const [showResultsPanel, setShowResultsPanel] = useState(false);
//     const loaderRef = useRef();
//     const observerRef = useRef(null);
//     const searchTimeoutRef = useRef(null);
//     const searchPanelRef = useRef(null); // Ref for the search results panel

//     // Fuse.js instance reference
//     const fuseRef = useRef(null);
//     const [baseUrl, setBaseUrl] = useState('');

//     useEffect(() => {
//         const resolveBaseUrl = async () => {
//             const url = await getWorkingApiBaseUrl();
//             setBaseUrl(url);
//         };
//         resolveBaseUrl();
//     }, []);


//     // 📏 Responsive items per page
//     useEffect(() => {
//         const handleResize = () => {
//             const width = window.innerWidth;
//             if (width < 640) setItemsPerPage(4);
//             else if (width < 1024) setItemsPerPage(6);
//             else setItemsPerPage(9);
//         };
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // 📡 Fetch interviews
//     // useEffect(() => {
//     //     const fetchInterviews = async () => {
//     //         if (!user || !user.token) {
//     //             setLoading(false);
//     //             return;
//     //         }
//     //         try {
//     //             const token = localStorage.getItem('token');
//     //             const res = await axios.get(`${baseUrl}/api/interview`, {
//     //                 headers: { 'x-auth-token': token },
//     //             });
//     //             setInterviews(res.data);
//     //         } catch (err) {
//     //             console.error('Failed to fetch interviews:', err);
//     //             setError('Failed to load your interviews. Please try refreshing the page.');
//     //             toast.error('Failed to load interviews.');
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };
//     //     fetchInterviews();
//     // }, [user]);
//     useEffect(() => {
//         const fetchInterviews = async () => {
//             if (!user || !user.token) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const token = localStorage.getItem('token');

//                 // Use the environment variable safely
//                 const baseUrl = await getWorkingApiBaseUrl();

//                 if (!baseUrl) {
//                     throw new Error("API base URL is not defined");
//                 }

//                 const res = await axios.get(`${baseUrl}/api/interview`, {
//                     headers: { 'x-auth-token': token },
//                 });

//                 setInterviews(res.data);
//             } catch (err) {
//                 console.error('Failed to fetch interviews:', err);
//                 setError('Failed to load your interviews. Please try refreshing the page.');
//                 toast.error('Failed to load interviews.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInterviews();
//     }, [user]);

//     // 🚀 Initialize Fuse.js with more advanced options for fuzzy searching
//     useEffect(() => {
//         const fuseOptions = {
//             keys: ['subject'], // Key(s) to search in (e.g., interview subject)
//             // Enhanced fuzzy search options:
//             includeScore: true, // Show the match score
//             threshold: 0.4,     // Fuzziness: 0.0 requires perfect match, 1.0 matches anything.
//             // 0.4 is a good balance for spelling mistakes.
//             ignoreLocation: true, // Don't care about the index of the match (e.g., "zamon" should match "Amazon")
//             distance: 100,      // Max distance from the approximate match (longer distance allows more typos)
//             findAllMatches: true, // Find all matches for a pattern.
//             shouldSort: true,   // Sort results by score (best match first)
//         };
//         fuseRef.current = new Fuse(interviews, fuseOptions);
//     }, [interviews]);

//     // 🔍 Smarter search logic with debounce and fake loading
//     useEffect(() => {
//         if (searchTimeoutRef.current) {
//             clearTimeout(searchTimeoutRef.current);
//         }

//         if (typedSearch.trim() === '') {
//             setSearchTerm('');
//             setFilteredResults([]);
//             setSearching(false);
//             setShowResultsPanel(false); // Hide panel if search is empty
//             return;
//         }

//         setSearching(true); // Start fake loading immediately
//         setShowResultsPanel(true); // Show panel as soon as typing starts

//         searchTimeoutRef.current = setTimeout(() => {
//             setSearchTerm(typedSearch.trim()); // Actual search term update after debounce
//             setSearching(false); // End fake loading
//         }, 500); // Debounce for 500ms
//     }, [typedSearch]);

//     // Apply filtering based on searchTerm using Fuse.js
//     useEffect(() => {
//         if (!searchTerm) {
//             setFilteredResults([]);
//             return;
//         }

//         if (fuseRef.current) {
//             // Perform the fuzzy search
//             const results = fuseRef.current.search(searchTerm);
//             // Map to get the original items and sort by score (if not already sorted by Fuse)
//             setFilteredResults(results.map(result => result.item));
//         } else {
//             setFilteredResults([]); // Should not happen if fuseRef is initialized correctly
//         }
//         // Note: visibleCount and itemsPerPage are primarily for the main grid.
//         // For search results, you typically show all relevant results or implement
//         // pagination/virtualization within the search panel if results are very numerous.
//         // For now, it's fine as it is.
//     }, [searchTerm, interviews, itemsPerPage]);

//     // Close search panel when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (searchPanelRef.current && !searchPanelRef.current.contains(event.target) && !event.target.closest('.search-input-container')) {
//                 // Ensure click is not inside the search input itself
//                 setShowResultsPanel(false);
//                 setTypedSearch(''); // Clear search term as well
//             }
//         };

//         if (showResultsPanel) {
//             document.addEventListener('mousedown', handleClickOutside);
//         } else {
//             document.removeEventListener('mousedown', handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [showResultsPanel]);


//     // 🔁 Infinite scroll logic for the main grid
//     useEffect(() => {
//         if (observerRef.current) {
//             observerRef.current.disconnect();
//         }

//         // Only apply infinite scroll if not actively searching or if search results are empty
//         // to prevent interference with search panel's display logic
//         if (!loaderRef.current || visibleCount >= interviews.length || showResultsPanel) return;

//         const options = {
//             root: null, // viewport
//             rootMargin: '20px',
//             threshold: 1.0
//         };

//         observerRef.current = new IntersectionObserver(([entry]) => {
//             if (entry.isIntersecting && !loading) {
//                 setVisibleCount((prev) => {
//                     const nextCount = prev + itemsPerPage;
//                     return nextCount;
//                 });
//             }
//         }, options);

//         observerRef.current.observe(loaderRef.current);

//         return () => observerRef.current?.disconnect();
//     }, [interviews, visibleCount, itemsPerPage, loading, showResultsPanel]); // Added showResultsPanel to dependencies

//     // Function to close the search panel manually
//     const handleCloseSearchPanel = () => {
//         setShowResultsPanel(false);
//         setTypedSearch('');
//     };

//     // Render for unauthenticated users
//     if (!user) {
//         return (
//             <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 px-4 py-12">
//                 <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight text-gray-900">
//                     Welcome to <span className="text-purple-600">AI Interview Pro</span>
//                 </h1>
//                 <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
//                     Unlock your potential with voice-based AI interviews tailored to your needs. Practice, get feedback, and ace your next interview!
//                 </p>
//                 <Link
//                     to="/login"
//                     className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//                 >
//                     Get Started Now
//                     <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                 </Link>
//             </div>
//         );
//     }

//     // Render for loading state
//     if (loading) {
//         return (
//             <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12">
//                 <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent mb-4"></div>
//                 <p className="text-xl font-medium text-gray-700">Loading your interviews...</p>
//             </div>
//         );
//     }

//     // Render for error state
//     if (error) {
//         return (
//             <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12">
//                 <div className="text-red-600 text-center text-lg font-medium p-6 border border-red-300 rounded-lg shadow-md bg-white">
//                     <p className="mb-2">Oops! Something went wrong.</p>
//                     <p>{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-4 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 to-blue-50 py-10 px-4 sm:px-6 lg:px-8 pt-20 flex"> {/* Adjusted pt for consistency */}
//             {/* Main Content Area */}
//             <div className={`flex-1 ${showResultsPanel ? 'lg:mr-80' : ''}`}> {/* Adjusted margin when panel is open */}
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
//                         Your AI Interviews
//                     </h1>

//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
//                         <Link
//                             to="/interview/new"
//                             className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                             </svg>
//                             Start New Interview
//                         </Link>

//                         <div className="relative w-full sm:w-80 search-input-container"> {/* Added class for click outside detection */}
//                             <input
//                                 type="text"
//                                 placeholder="Search interviews by subject..."
//                                 value={typedSearch}
//                                 onChange={(e) => setTypedSearch(e.target.value)}
//                                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition duration-200 text-gray-800 placeholder-gray-400"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                             </div>
//                             {searching && (
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                     <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {interviews.length === 0 && !loading && typedSearch.trim() === '' ? (
//                         <div className="text-center text-lg text-gray-600 p-8 border border-dashed border-gray-300 rounded-lg bg-white shadow-md animate-fadeIn">
//                             <p className="mb-4">No interviews found. Start a new one to see it appear here!</p>
//                             <Link
//                                 to="/interview/new"
//                                 className="inline-flex items-center justify-center px-6 py-2 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition duration-200"
//                             >
//                                 Create First Interview
//                             </Link>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                                 {interviews.slice(0, visibleCount).map((interview) => (
//                                     <InterviewCard key={interview._id} interview={interview} />
//                                 ))}
//                             </div>

//                             {visibleCount < interviews.length && (
//                                 <div ref={loaderRef} className="flex justify-center mt-12">
//                                     <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
//                                 </div>
//                             )}
//                             {visibleCount >= interviews.length && interviews.length > 0 && typedSearch.trim() === '' && (
//                                 <div className="text-center text-gray-500 mt-12">
//                                     <p>You've seen all your interviews!</p>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* Right Sidebar for Search Results - Conditional display on large screens */}
//             {showResultsPanel && (
//                 <div
//                     ref={searchPanelRef}
//                     className={`fixed right-0 top-0 h-full w-full lg:w-80 bg-white p-6 border-l border-gray-200 shadow-xl overflow-y-auto pt-20
//                         transform transition-transform duration-300 ease-in-out ${showResultsPanel ? 'translate-x-0' : 'translate-x-full'}
//                         ${filteredResults.length === 0 && typedSearch.trim() === '' ? 'hidden' : 'flex flex-col'}` // Hide if no search term and no results
//                     }
//                 >
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl font-bold text-gray-800">Search Results</h3>
//                         <button
//                             onClick={handleCloseSearchPanel}
//                             className="text-gray-500 hover:text-gray-800 transition duration-200 focus:outline-none"
//                             aria-label="Close search results"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>

//                     {searching && typedSearch.trim() !== '' ? (
//                         <div className="flex flex-col items-center justify-center p-8 text-gray-600">
//                             <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent mb-4"></div>
//                             <p>Searching...</p>
//                         </div>
//                     ) : filteredResults.length === 0 && typedSearch.trim() !== '' ? (
//                         <div className="text-gray-600 p-4 bg-gray-50 rounded-lg text-center">
//                             <p>No matching interviews found for "{typedSearch}"</p>
//                         </div>
//                     ) : (
//                         <ul className="space-y-4">
//                             {filteredResults.map((interview) => (
//                                 <li key={interview._id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
//                                     <h4 className="font-semibold text-lg text-gray-900 mb-1">{interview.subject}</h4>
//                                     <p className="text-sm text-gray-600 mb-3">
//                                         {interview.completed ? 'Completed' : 'In Progress'}
//                                     </p>
//                                     <Link
//                                         to={`/interview/${interview._id}`}
//                                         onClick={handleCloseSearchPanel} // Close panel on click
//                                         className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition duration-200"
//                                     >
//                                         View Interview
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                                         </svg>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Home;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InterviewCard from '../components/InterviewCard';
import { toast } from 'react-toastify';
import Fuse from 'fuse.js';
import { getWorkingApiBaseUrl } from '../utils/apiBase';
import { Search, Plus, Calendar, TrendingUp, Award, Clock, ChevronRight, Filter, Grid, List, Sparkles, Zap, Target, BarChart3 } from 'lucide-react';

const Home = ({ user }) => {
    const [interviews, setInterviews] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typedSearch, setTypedSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [showResultsPanel, setShowResultsPanel] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const loaderRef = useRef();
    const observerRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const searchPanelRef = useRef(null);
    const fuseRef = useRef(null);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        const resolveBaseUrl = async () => {
            const url = await getWorkingApiBaseUrl();
            setBaseUrl(url);
        };
        resolveBaseUrl();
    }, []);

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

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user || !user.token) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const baseUrl = await getWorkingApiBaseUrl();

                if (!baseUrl) {
                    throw new Error("API base URL is not defined");
                }

                const res = await axios.get(`${baseUrl}/api/interview`, {
                    headers: { 'x-auth-token': token },
                });

                setInterviews(res.data);
            } catch (err) {
                console.error('Failed to fetch interviews:', err);
                setError('Failed to load your interviews. Please try refreshing the page.');
                toast.error('Failed to load interviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, [user]);

    useEffect(() => {
        const fuseOptions = {
            keys: ['subject'],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true,
            distance: 100,
            findAllMatches: true,
            shouldSort: true,
        };
        fuseRef.current = new Fuse(interviews, fuseOptions);
    }, [interviews]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (typedSearch.trim() === '') {
            setSearchTerm('');
            setFilteredResults([]);
            setSearching(false);
            setShowResultsPanel(false);
            return;
        }

        setSearching(true);
        setShowResultsPanel(true);

        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(typedSearch.trim());
            setSearching(false);
        }, 500);
    }, [typedSearch]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredResults([]);
            return;
        }

        if (fuseRef.current) {
            const results = fuseRef.current.search(searchTerm);
            setFilteredResults(results.map(result => result.item));
        } else {
            setFilteredResults([]);
        }
    }, [searchTerm, interviews, itemsPerPage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchPanelRef.current && !searchPanelRef.current.contains(event.target) && !event.target.closest('.search-input-container')) {
                setShowResultsPanel(false);
                setTypedSearch('');
            }
        };

        if (showResultsPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showResultsPanel]);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (!loaderRef.current || visibleCount >= getFilteredInterviews().length || showResultsPanel) return;

        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                setVisibleCount((prev) => prev + itemsPerPage);
            }
        }, options);

        observerRef.current.observe(loaderRef.current);

        return () => observerRef.current?.disconnect();
    }, [interviews, visibleCount, itemsPerPage, loading, showResultsPanel, filterStatus]);

    const handleCloseSearchPanel = () => {
        setShowResultsPanel(false);
        setTypedSearch('');
    };

    const getFilteredInterviews = () => {
        if (filterStatus === 'all') return interviews;
        if (filterStatus === 'completed') return interviews.filter(i => i.completed);
        if (filterStatus === 'in-progress') return interviews.filter(i => !i.completed);
        return interviews;
    };

    const stats = {
        total: interviews.length,
        completed: interviews.filter(i => i.completed).length,
        inProgress: interviews.filter(i => !i.completed).length,
        thisWeek: interviews.filter(i => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(i.createdAt) > weekAgo;
        }).length
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    @keyframes pulse-ring {
                        0% { transform: scale(0.95); opacity: 1; }
                        50% { transform: scale(1); opacity: 0.7; }
                        100% { transform: scale(0.95); opacity: 1; }
                    }
                    .float-animation { animation: float 6s ease-in-out infinite; }
                    .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
                `}</style>
                
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation" style={{animationDelay: '2s'}}></div>
                    <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation" style={{animationDelay: '4s'}}></div>
                </div>

                <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl pulse-ring mb-8">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        
                        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight">
                            AI Interview Pro
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                            Transform your interview preparation with AI-powered voice interviews. Get real-time feedback and ace your dream job.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                                <Target className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Personalized</h3>
                                <p className="text-sm text-gray-600">Tailored questions based on your resume and job description</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                                <Zap className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Real-time AI</h3>
                                <p className="text-sm text-gray-600">Instant feedback and performance analysis</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                                <TrendingUp className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
                                <p className="text-sm text-gray-600">Monitor your improvement over time</p>
                            </div>
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-10 py-5 mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                        >
                            Start Your Journey
                            <ChevronRight className="ml-2 w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-xl font-semibold text-gray-700">Loading your interviews...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const displayedInterviews = getFilteredInterviews();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .slide-in-right { animation: slideInRight 0.3s ease-out; }
                .fade-in-up { animation: fadeInUp 0.5s ease-out; }
                .stagger-1 { animation-delay: 0.1s; }
                .stagger-2 { animation-delay: 0.2s; }
                .stagger-3 { animation-delay: 0.3s; }
                .stagger-4 { animation-delay: 0.4s; }
            `}</style>

            <div className={`transition-all duration-300 ${showResultsPanel ? 'lg:mr-96' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    
                    {/* Hero Section with Stats */}
                    <div className="mb-12 fade-in-up">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
                                    Your Dashboard
                                </h1>
                                <p className="text-xl text-gray-600">Track your interview journey and keep improving</p>
                            </div>
                            <Link
                                to="/interview/new"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Interview
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 fade-in-up stagger-1">
                                <div className="flex items-center justify-between mb-2">
                                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.total}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-600">Total Interviews</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 fade-in-up stagger-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Award className="w-8 h-8 text-green-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.completed}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-600">Completed</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 fade-in-up stagger-3">
                                <div className="flex items-center justify-between mb-2">
                                    <Clock className="w-8 h-8 text-amber-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.inProgress}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-600">In Progress</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 fade-in-up stagger-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Calendar className="w-8 h-8 text-purple-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.thisWeek}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-600">This Week</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 border border-white/50">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full search-input-container">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by role, subject, or keywords..."
                                    value={typedSearch}
                                    onChange={(e) => setTypedSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-200"
                                />
                                {searching && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filterStatus === 'all' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('in-progress')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filterStatus === 'in-progress' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('completed')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filterStatus === 'completed' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
                                    >
                                        Done
                                    </button>
                                </div>

                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-600'}`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interviews Display */}
                    {displayedInterviews.length === 0 && !loading ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/50">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No interviews yet</h3>
                            <p className="text-gray-600 mb-6">Start your first AI-powered interview and begin your journey!</p>
                            <Link
                                to="/interview/new"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create First Interview
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                                : 'space-y-4'
                            }>
                                {displayedInterviews.slice(0, visibleCount).map((interview, index) => (
                                    <div key={interview._id} className="fade-in-up" style={{animationDelay: `${index * 0.05}s`}}>
                                        <InterviewCard interview={interview} />
                                    </div>
                                ))}
                            </div>

                            {visibleCount < displayedInterviews.length && (
                                <div ref={loaderRef} className="flex justify-center mt-12">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                            
                            {visibleCount >= displayedInterviews.length && displayedInterviews.length > 0 && (
                                <div className="text-center mt-12 text-gray-500">
                                    <p className="text-lg">You've reached the end! 🎉</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Search Results Sidebar */}
            {showResultsPanel && (
                <div
                    ref={searchPanelRef}
                    className="fixed right-0 top-0 h-full w-full lg:w-96 bg-white shadow-2xl overflow-y-auto pt-20 slide-in-right z-50"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Search Results</h3>
                            <button
                                onClick={handleCloseSearchPanel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {searching ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">Searching...</p>
                            </div>
                        ) : filteredResults.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600">No matches found for "{typedSearch}"</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredResults.map((interview) => (
                                    <Link
                                        key={interview._id}
                                        to={`/interview/${interview._id}`}
                                        onClick={handleCloseSearchPanel}
                                        className="block p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-200 border border-purple-100"
                                    >
                                        <h4 className="font-bold text-gray-900 mb-2">{interview.subject}</h4>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`px-3 py-1 rounded-full ${interview.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {interview.completed ? 'Completed' : 'In Progress'}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-purple-600" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;