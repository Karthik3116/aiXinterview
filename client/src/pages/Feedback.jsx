// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// // Assuming you have a basic spinner component or use a library for icons
// // For simplicity, I'll use a div-based spinner and recommend a library like Heroicons for actual icons.

// const LoadingSpinner = () => (
//   <div className="flex flex-col items-center justify-center min-h-[200px]">
//     <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent shadow-lg"></div>
//     <p className="mt-4 text-lg text-gray-700 font-medium">Fetching your feedback...</p>
//   </div>
// );

// const ErrorMessage = ({ message }) => (
//   <div className="max-w-md mx-auto mt-12 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center animate-fade-in">
//     <p className="text-xl font-semibold mb-3">Oops! Something went wrong.</p>
//     <p>{message}</p>
//     <p className="mt-4 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
//   </div>
// );

// const NoFeedbackYet = () => (
//   <div className="max-w-md mx-auto mt-12 p-6 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md text-center animate-fade-in">
//     <p className="text-xl font-semibold mb-3">No Feedback Available</p>
//     <p>It looks like feedback for this interview hasn't been generated yet.</p>
//     <p className="mt-4 text-sm">Please check back later or contact the administrator.</p>
//   </div>
// );

// const Feedback = () => {
//   const { interviewId } = useParams();
//   const [feedback, setFeedback] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openSections, setOpenSections] = useState({}); // State for accordion sections

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('Authentication token missing. Please log in to view feedback.');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}/feedback`, {
//           headers: { 'x-auth-token': token },
//         });
//         setFeedback(res.data);
//         // Initialize all sections as open by default for comprehensive display, or closed for conciseness
//         setOpenSections({
//           overall: true,
//           strengths: true,
//           improvements: true,
//           questionAnalysis: true,
//           recommendation: true,
//         });
//       } catch (err) {
//         setError(err.response?.data?.msg || 'Failed to fetch feedback. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeedback();
//   }, [interviewId]);

//   const toggleSection = (sectionName) => {
//     setOpenSections(prevState => ({
//       ...prevState,
//       [sectionName]: !prevState[sectionName]
//     }));
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (!feedback) {
//     return <NoFeedbackYet />;
//   }

//   return (
//     <div className="max-w-5xl mx-auto mt-10 px-4 py-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-4xl font-extrabold text-gray-800 text-center flex-grow">
//           Interview Feedback Report
//         </h2>
//         <button
//           onClick={handlePrint}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 print:hidden"
//         >
//           {/* You'd typically use an icon here, e.g., <i className="fas fa-print mr-2"></i> */}
//           Print Feedback
//         </button>
//       </div>

//       <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
//         {/* Overall Assessment */}
//         <div className="mb-6 pb-4 border-b border-gray-200">
//           <button
//             className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
//             onClick={() => toggleSection('overall')}
//           >
//             <h3 className="text-2xl font-bold text-blue-700">Overall Assessment</h3>
//             {/* You can use an icon here, e.g., ChevronDownIcon or ChevronUpIcon from Heroicons */}
//             <span className="text-blue-500 text-2xl">
//               {openSections.overall ? '−' : '+'}
//             </span>
//           </button>
//           {openSections.overall && (
//             <div className="mt-4 space-y-3 text-lg text-gray-700 animate-fade-in-down">
//               <p>
//                 <strong className="text-gray-900">Score:</strong>{' '}
//                 <span className="font-semibold text-blue-600">{feedback.overallScore}/100</span>
//               </p>
//               <p>
//                 <strong className="text-gray-900">Summary:</strong> {feedback.detailedFeedback}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Strengths */}
//         {feedback.strengths?.length > 0 && (
//           <div className="mb-6 pb-4 border-b border-gray-200">
//             <button
//               className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
//               onClick={() => toggleSection('strengths')}
//             >
//               <h4 className="text-xl font-bold text-green-700">Key Strengths</h4>
//               <span className="text-green-500 text-2xl">
//                 {openSections.strengths ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.strengths && (
//               <div className="mt-4 animate-fade-in-down">
//                 <ul className="list-disc pl-8 text-md text-gray-700 space-y-2">
//                   {feedback.strengths.map((item, i) => (
//                     <li key={i} className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Areas for Improvement */}
//         {feedback.areasForImprovement?.length > 0 && (
//           <div className="mb-6 pb-4 border-b border-gray-200">
//             <button
//               className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
//               onClick={() => toggleSection('improvements')}
//             >
//               <h4 className="text-xl font-bold text-yellow-700">Areas for Improvement</h4>
//               <span className="text-yellow-500 text-2xl">
//                 {openSections.improvements ? '-' : '+'}
//               </span>
//             </button>
//             {openSections.improvements && (
//               <div className="mt-4 animate-fade-in-down">
//                 <ul className="list-disc pl-8 text-md text-gray-700 space-y-2">
//                   {feedback.areasForImprovement.map((item, i) => (
//                     <li key={i} className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200">
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Question-by-Question Analysis */}
//         {feedback.questionAnalysis?.length > 0 && (
//           <div className="mb-6 pb-4 border-b border-gray-200">
//             <button
//               className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
//               onClick={() => toggleSection('questionAnalysis')}
//             >
//               <h4 className="text-xl font-bold text-indigo-700">Question-by-Question Analysis</h4>
//               <span className="text-indigo-500 text-2xl">
//                 {openSections.questionAnalysis ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.questionAnalysis && (
//               <div className="mt-4 space-y-6 animate-fade-in-down">
//                 {feedback.questionAnalysis.map((qa, i) => (
//                   <div key={i} className="bg-indigo-50 p-6 rounded-xl shadow-md border border-indigo-200 transition duration-300 hover:shadow-lg">
//                     <p className="mb-2">
//                       <strong className="text-indigo-800 text-lg">Q:</strong>{' '}
//                       <span className="text-gray-800">{qa.question}</span>
//                     </p>
//                     <p className="mb-2">
//                       <strong className="text-indigo-800 text-lg">A:</strong>{' '}
//                       <span className="italic text-gray-700">{qa.candidateAnswer}</span>
//                     </p>
//                     <p className="mb-2">
//                       <strong className="text-indigo-800 text-lg">Feedback:</strong>{' '}
//                       <span className="text-gray-700">{qa.feedback}</span>
//                     </p>
//                     <p>
//                       <strong className="text-indigo-800 text-lg">Score:</strong>{' '}
//                       <span className="font-semibold text-indigo-600">{qa.score}</span>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Recommendation */}
//         {feedback.recommendation && (
//           <div className="mt-6">
//             <button
//               className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
//               onClick={() => toggleSection('recommendation')}
//             >
//               <h4 className="text-xl font-bold text-red-700">Recommendation</h4>
//               <span className="text-red-500 text-2xl">
//                 {openSections.recommendation ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.recommendation && (
//               <div className="mt-4 p-6 bg-red-50 rounded-xl shadow-md border border-red-200 animate-fade-in-down">
//                 <p className="mb-2">
//                   <strong className="text-red-800 text-lg">Verdict:</strong>{' '}
//                   <span className="font-bold text-red-600">{feedback.recommendation}</span>
//                 </p>
//                 <p>
//                   <strong className="text-red-800 text-lg">Message:</strong>{' '}
//                   <span className="text-gray-700">{feedback.recommendationMessage}</span>
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Optional: Call to action or navigation */}
//       <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg shadow-inner">
//         <p className="text-gray-600 text-lg">
//           Ready to improve? Review your feedback and practice key areas.
//         </p>
//         {/* You might add a button to go back to interview list or schedule another practice */}
//         {/* <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
//           Back to Interviews
//         </button> */}
//       </div>
//     </div>
//   );
// };

// export default Feedback;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from 'recharts';

// const LoadingSpinner = () => (
//   <div className="flex flex-col items-center justify-center min-h-[200px]">
//     <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent shadow-lg"></div>
//     <p className="mt-4 text-lg text-gray-700 font-medium">Fetching your feedback...</p>
//   </div>
// );

// const ErrorMessage = ({ message }) => (
//   <div className="max-w-md mx-auto mt-12 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center animate-fade-in">
//     <p className="text-xl font-semibold mb-3">Oops! Something went wrong.</p>
//     <p>{message}</p>
//     <p className="mt-4 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
//   </div>
// );

// const NoFeedbackYet = () => (
//   <div className="max-w-md mx-auto mt-12 p-6 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md text-center animate-fade-in">
//     <p className="text-xl font-semibold mb-3">No Feedback Available</p>
//     <p>It looks like feedback for this interview hasn't been generated yet.</p>
//     <p className="mt-4 text-sm">Please check back later or contact the administrator.</p>
//   </div>
// );

// const Feedback = () => {
//   const { interviewId } = useParams();
//   const [interview, setInterview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openSections, setOpenSections] = useState({});

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('Authentication token missing. Please log in to view feedback.');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
//           headers: { 'x-auth-token': token },
//         });
//         setInterview(res.data);
//         setOpenSections({
//           overall: true,
//           strengths: true,
//           improvements: true,
//           recommendation: true,
//         });
//       } catch (err) {
//         setError(err.response?.data?.msg || 'Failed to fetch feedback. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeedback();
//   }, [interviewId]);

//   const toggleSection = (sectionName) => {
//     setOpenSections(prevState => ({
//       ...prevState,
//       [sectionName]: !prevState[sectionName],
//     }));
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;
//   if (!interview?.feedback) return <NoFeedbackYet />;

//   const { feedback, history = [] } = interview;

//   // Prepare data for chart
//   const progressData = history.map((entry, index) => ({
//     name: `#${index + 1}`,
//     score: entry.feedback?.overallScore || 0
//   }));

//   return (
//     <div className="max-w-5xl mx-auto mt-10 px-4 py-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-4xl font-extrabold text-gray-800 text-center flex-grow">
//           Interview Feedback Report
//         </h2>
//         <button
//           onClick={handlePrint}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 print:hidden"
//         >
//           Print Feedback
//         </button>
//       </div>

//       {/* Progress Graph */}
//       {history.length > 1 && (
//         <div className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-blue-200">
//           <h3 className="text-2xl font-bold text-blue-700 mb-4">Progress Over Time</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis domain={[0, 100]} />
//               <Tooltip />
//               <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

//         {/* Overall Assessment */}
//         <div className="mb-6 pb-4 border-b border-gray-200">
//           <button
//             className="flex justify-between items-center w-full text-left py-2"
//             onClick={() => toggleSection('overall')}
//           >
//             <h3 className="text-2xl font-bold text-blue-700">Overall Assessment</h3>
//             <span className="text-blue-500 text-2xl">
//               {openSections.overall ? '−' : '+'}
//             </span>
//           </button>
//           {openSections.overall && (
//             <div className="mt-4 space-y-3 text-lg text-gray-700 animate-fade-in-down">
//               <p>
//                 <strong className="text-gray-900">Score:</strong>{' '}
//                 <span className="font-semibold text-blue-600">{feedback.overallScore || 0}/100</span>
//               </p>
//               <p>
//                 <strong className="text-gray-900">Summary:</strong> {feedback.detailedFeedback || 'Not provided.'}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Strengths */}
//         {feedback.strengths?.length > 0 && (
//           <div className="mb-6 pb-4 border-b border-gray-200">
//             <button
//               className="flex justify-between items-center w-full text-left py-2"
//               onClick={() => toggleSection('strengths')}
//             >
//               <h4 className="text-xl font-bold text-green-700">Key Strengths</h4>
//               <span className="text-green-500 text-2xl">
//                 {openSections.strengths ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.strengths && (
//               <ul className="list-disc pl-8 mt-4 text-md text-gray-700 space-y-2 animate-fade-in-down">
//                 {feedback.strengths.map((item, i) => (
//                   <li key={i} className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {/* Areas for Improvement */}
//         {feedback.areasForImprovement?.length > 0 && (
//           <div className="mb-6 pb-4 border-b border-gray-200">
//             <button
//               className="flex justify-between items-center w-full text-left py-2"
//               onClick={() => toggleSection('improvements')}
//             >
//               <h4 className="text-xl font-bold text-yellow-700">Areas for Improvement</h4>
//               <span className="text-yellow-500 text-2xl">
//                 {openSections.improvements ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.improvements && (
//               <ul className="list-disc pl-8 mt-4 text-md text-gray-700 space-y-2 animate-fade-in-down">
//                 {feedback.areasForImprovement.map((item, i) => (
//                   <li key={i} className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200">
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {/* Recommendation */}
//         {feedback.recommendation && (
//           <div className="mt-6">
//             <button
//               className="flex justify-between items-center w-full text-left py-2"
//               onClick={() => toggleSection('recommendation')}
//             >
//               <h4 className="text-xl font-bold text-red-700">Recommendation</h4>
//               <span className="text-red-500 text-2xl">
//                 {openSections.recommendation ? '−' : '+'}
//               </span>
//             </button>
//             {openSections.recommendation && (
//               <div className="mt-4 p-6 bg-red-50 rounded-xl shadow-md border border-red-200 animate-fade-in-down">
//                 <p className="mb-2">
//                   <strong className="text-red-800 text-lg">Verdict:</strong>{' '}
//                   <span className="font-bold text-red-600">{feedback.recommendation}</span>
//                 </p>
//                 {feedback.recommendationMessage && (
//                   <p>
//                     <strong className="text-red-800 text-lg">Message:</strong>{' '}
//                     <span className="text-gray-700">{feedback.recommendationMessage}</span>
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg shadow-inner">
//         <p className="text-gray-600 text-lg">
//           Ready to improve? Review your feedback and practice key areas.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Feedback;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px]">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent shadow-lg"></div>
    <p className="mt-4 text-lg text-gray-700 font-medium">Fetching your feedback...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="max-w-md mx-auto mt-12 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center animate-fade-in">
    <p className="text-xl font-semibold mb-3">Oops! Something went wrong.</p>
    <p>{message}</p>
    <p className="mt-4 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
  </div>
);

const NoFeedbackYet = () => (
  <div className="max-w-md mx-auto mt-12 p-6 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md text-center animate-fade-in">
    <p className="text-xl font-semibold mb-3">No Feedback Available</p>
    <p>It looks like feedback for this interview hasn't been generated yet.</p>
    <p className="mt-4 text-sm">Please check back later or contact the administrator.</p>
  </div>
);

const Feedback = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in to view feedback.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
          headers: { 'x-auth-token': token },
        });
        setInterview(res.data);
        setOpenSections({
          overall: true,
          strengths: true,
          improvements: true,
          recommendation: true,
        });
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [interviewId]);

  const toggleSection = (sectionName) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!interview?.feedback) return <NoFeedbackYet />;

  const { feedback, history = [] } = interview;

  // Prepare data for chart with fix here: use entry.overallScore instead of entry.feedback?.overallScore
  const progressData = Array.isArray(history) ? history.map((entry, index) => ({
    name: `#${index + 1}`,
    score: entry?.overallScore ?? 0,
  })) : [];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center flex-grow">
          Interview Feedback Report
        </h2>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 print:hidden"
        >
          Print Feedback
        </button>
      </div>

      {/* Progress Graph */}
      {history.length > 1 && (
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        {/* Overall Assessment */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <button
            className="flex justify-between items-center w-full text-left py-2"
            onClick={() => toggleSection('overall')}
          >
            <h3 className="text-2xl font-bold text-blue-700">Overall Assessment</h3>
            <span className="text-blue-500 text-2xl">
              {openSections.overall ? '−' : '+'}
            </span>
          </button>
          {openSections.overall && (
            <div className="mt-4 space-y-3 text-lg text-gray-700 animate-fade-in-down">
              <p>
                <strong className="text-gray-900">Score:</strong>{' '}
                <span className="font-semibold text-blue-600">{feedback.overallScore || 0}/100</span>
              </p>
              <p>
                <strong className="text-gray-900">Summary:</strong> {feedback.detailedFeedback || 'Not provided.'}
              </p>
            </div>
          )}
        </div>

        {/* Strengths */}
        {feedback.strengths?.length > 0 && (
          <div className="mb-6 pb-4 border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full text-left py-2"
              onClick={() => toggleSection('strengths')}
            >
              <h4 className="text-xl font-bold text-green-700">Key Strengths</h4>
              <span className="text-green-500 text-2xl">
                {openSections.strengths ? '−' : '+'}
              </span>
            </button>
            {openSections.strengths && (
              <ul className="list-disc pl-8 mt-4 text-md text-gray-700 space-y-2 animate-fade-in-down">
                {feedback.strengths.map((item, i) => (
                  <li key={i} className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.areasForImprovement?.length > 0 && (
          <div className="mb-6 pb-4 border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full text-left py-2"
              onClick={() => toggleSection('improvements')}
            >
              <h4 className="text-xl font-bold text-yellow-700">Areas for Improvement</h4>
              <span className="text-yellow-500 text-2xl">
                {openSections.improvements ? '−' : '+'}
              </span>
            </button>
            {openSections.improvements && (
              <ul className="list-disc pl-8 mt-4 text-md text-gray-700 space-y-2 animate-fade-in-down">
                {feedback.areasForImprovement.map((item, i) => (
                  <li key={i} className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Recommendation */}
        {feedback.recommendation && (
          <div className="mt-6">
            <button
              className="flex justify-between items-center w-full text-left py-2"
              onClick={() => toggleSection('recommendation')}
            >
              <h4 className="text-xl font-bold text-red-700">Recommendation</h4>
              <span className="text-red-500 text-2xl">
                {openSections.recommendation ? '−' : '+'}
              </span>
            </button>
            {openSections.recommendation && (
              <div className="mt-4 p-6 bg-red-50 rounded-xl shadow-md border border-red-200 animate-fade-in-down">
                <p className="mb-2">
                  <strong className="text-red-800 text-lg">Verdict:</strong>{' '}
                  <span className="font-bold text-red-600">{feedback.recommendation}</span>
                </p>
                {feedback.recommendationMessage && (
                  <p>
                    <strong className="text-red-800 text-lg">Message:</strong>{' '}
                    <span className="text-gray-700">{feedback.recommendationMessage}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-12 p-6 bg-gray-100 rounded-lg shadow-inner">
        <p className="text-gray-600 text-lg">
          Ready to improve? Review your feedback and practice key areas.
        </p>
      </div>
    </div>
  );
};

export default Feedback;
