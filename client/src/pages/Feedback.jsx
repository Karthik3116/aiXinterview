
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
//   const [openSections, setOpenSections] = useState({
//     overall: true,
//     strengths: true,
//     improvements: true,
//     recommendation: true,
//     conversation: false, // Initial state for conversation section
//   });

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
//         // Set initial open sections after data is fetched
//         setOpenSections(prevState => ({
//           ...prevState,
//           overall: true,
//           strengths: true,
//           improvements: true,
//           recommendation: true,
//           conversation: false, // Keep conversation collapsed by default
//         }));
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

//   const { feedback, history = [], conversation = [] } = interview;

//   // Prepare data for chart: include formatted date for tooltip and a count for X-axis
//   const progressData = Array.isArray(history) ? history.map((entry, index) => ({
//     count: index + 1, // Add a count for the X-axis
//     formattedDate: new Date(entry.timestamp).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     }),
//     score: entry?.overallScore ?? 0,
//   })).sort((a, b) => new Date(a.formattedDate).getTime() - new Date(b.formattedDate).getTime()) : []; // Sort by original timestamp for correct order

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
//       {history.length > 0 && (
//         <div className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-blue-200">
//           <h3 className="text-2xl font-bold text-blue-700 mb-4">Progress Over Time</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="count" // Use 'count' for the X-axis labels (1, 2, 3...)
//                 // No need for angle/textAnchor/height if labels are just numbers
//               />
//               <YAxis domain={[0, 100]} />
//               <Tooltip
//                 formatter={(value, name, props) => [`Score: ${value}`, `Date: ${props.payload.formattedDate}`]}
//                 labelFormatter={(label) => `Attempt: ${label}`} // Label will be the count
//               />
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
//           <div className="mb-6">
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

//         ---

//         {/* Conversation History */}
//         {conversation.length > 0 && (
//             <div className="mt-6">
//                 <button
//                     className="flex justify-between items-center w-full text-left py-2 border-t border-gray-200 pt-4"
//                     onClick={() => toggleSection('conversation')}
//                 >
//                     <h4 className="text-xl font-bold text-purple-700">Conversation History</h4>
//                     <span className="text-purple-500 text-2xl">
//                         {openSections.conversation ? '−' : '+'}
//                     </span>
//                 </button>
//                 {openSections.conversation && (
//                     <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-2 animate-fade-in-down">
//                         {conversation.map((message, i) => (
//                             <div
//                                 key={i}
//                                 className={`p-4 rounded-lg shadow-sm ${
//                                     message.sender === 'user'
//                                         ? 'bg-blue-50 text-blue-900 self-end ml-auto'
//                                         : 'bg-gray-100 text-gray-800 self-start mr-auto'
//                                 }`}
//                             >
//                                 <p className="font-semibold mb-1">
//                                     {message.sender === 'user' ? 'You:' : 'Interviewer:'}
//                                 </p>
//                                 <p>{message.text}</p>
//                                 <p className="text-xs text-gray-500 mt-2 text-right">
//                                     {new Date(message.timestamp).toLocaleTimeString('en-US', {
//                                         hour: '2-digit',
//                                         minute: '2-digit',
//                                     })}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
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
  const [openSections, setOpenSections] = useState({
    overall: true,
    strengths: true,
    improvements: true,
    recommendation: true,
    conversation: false,
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in to view feedback.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`https://aixinterview.onrender.com/api/interview/${interviewId}`, {
          headers: { 'x-auth-token': token },
        });
        setInterview(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [interviewId]);

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const handlePrint = () => window.print();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!interview?.feedback) return <NoFeedbackYet />;

  const { feedback, history = [], conversation = [] } = interview;

  const progressData = history.map((entry, index) => ({
    count: index + 1,
    formattedDate: new Date(entry.timestamp).toLocaleString(),
    score: entry.overallScore || 0,
  }));

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

      {history.length > 0 && (
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="count" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name, props) => [`Score: ${value}`, `Date: ${props.payload.formattedDate}`]}
                labelFormatter={(label) => `Attempt: ${label}`}
              />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Overall Section */}
        <SectionToggle
          title="Overall Assessment"
          isOpen={openSections.overall}
          onToggle={() => toggleSection('overall')}
        >
          <p><strong>Score:</strong> <span className="text-blue-600">{feedback.overallScore || 0}/100</span></p>
          <p><strong>Summary:</strong> {feedback.detailedFeedback || 'Not provided.'}</p>
        </SectionToggle>

        {/* Strengths */}
        {feedback.strengths?.length > 0 && (
          <SectionToggle
            title="Key Strengths"
            isOpen={openSections.strengths}
            onToggle={() => toggleSection('strengths')}
            color="green"
          >
            <ul className="list-disc pl-6 space-y-2">
              {feedback.strengths.map((item, i) => (
                <li key={i} className="bg-green-50 p-2 rounded border border-green-200">{item}</li>
              ))}
            </ul>
          </SectionToggle>
        )}

        {/* Areas for Improvement */}
        {feedback.areasForImprovement?.length > 0 && (
          <SectionToggle
            title="Areas for Improvement"
            isOpen={openSections.improvements}
            onToggle={() => toggleSection('improvements')}
            color="yellow"
          >
            <ul className="list-disc pl-6 space-y-2">
              {feedback.areasForImprovement.map((item, i) => (
                <li key={i} className="bg-yellow-50 p-2 rounded border border-yellow-200">{item}</li>
              ))}
            </ul>
          </SectionToggle>
        )}

        {/* Recommendation */}
        {feedback.recommendation && (
          <SectionToggle
            title="Recommendation"
            isOpen={openSections.recommendation}
            onToggle={() => toggleSection('recommendation')}
            color="red"
          >
            <p><strong>Verdict:</strong> <span className="text-red-600">{feedback.recommendation}</span></p>
            {feedback.recommendationMessage && (
              <p><strong>Message:</strong> {feedback.recommendationMessage}</p>
            )}
          </SectionToggle>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="mt-6">
            <button
              className="flex justify-between items-center w-full text-left py-2 border-t border-gray-200 pt-4"
              onClick={() => toggleSection('conversation')}
            >
              <h4 className="text-xl font-bold text-purple-700">Conversation History</h4>
              <span className="text-purple-500 text-2xl">
                {openSections.conversation ? '−' : '+'}
              </span>
            </button>
            {openSections.conversation && (
              <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-2 animate-fade-in-down">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg shadow-sm max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-blue-100 text-blue-900 self-end ml-auto'
                        : 'bg-gray-100 text-gray-800 self-start mr-auto'
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {msg.role === 'user' ? 'You:' : 'Interviewer:'}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
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

// Reusable Section Toggle Component
const SectionToggle = ({ title, isOpen, onToggle, children, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-700 border-blue-200',
    green: 'text-green-700 border-green-200',
    yellow: 'text-yellow-700 border-yellow-200',
    red: 'text-red-700 border-red-200',
  };

  return (
    <div className={`mb-6 pb-4 border-b ${colorMap[color]}`}>
      <button className="flex justify-between items-center w-full text-left py-2" onClick={onToggle}>
        <h3 className={`text-xl font-bold ${colorMap[color]}`}>{title}</h3>
        <span className={`text-${color}-500 text-2xl`}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="mt-4 text-gray-700 animate-fade-in-down">{children}</div>}
    </div>
  );
};

export default Feedback;
