
// // src/components/ActiveInterviewDisplay.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ActiveInterviewDisplay = ({
//   subject,
//   callStatus,
//   assistantCaption, // This will now persist longer
//   userCaption,      // This will now persist longer
//   currentSpeakingRole,
//   localUserName,
//   isInterviewCompleted,
//   currentInterviewRecordId,
//   onContinueInterview,
//   onRetakeInterview,
//   onEndInterview,
//   loading,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <h5 className="mt-3">
//         <strong>Role:</strong> {subject}
//       </h5>
//       <p>
//         <strong>Status:</strong>{' '}
//         <span
//           className={`badge bg-${
//             callStatus === 'ACTIVE'
//               ? 'success'
//               : callStatus === 'ENDED'
//               ? 'secondary'
//               : 'warning'
//           }`}
//         >
//           {callStatus}
//         </span>
//       </p>

//       <div className="row mt-4">
//         <div className="col-md-6 mb-3">
//           <div className="card shadow-sm">
//             <div className="card-header d-flex justify-content-between align-items-center bg-light">
//               <strong>AI Interviewer (Jennifer)</strong>
//               {callStatus === 'ACTIVE' && currentSpeakingRole === 'assistant' && (
//                 <span className="text-danger fw-bold">🎤 Listening...</span>
//               )}
//             </div>
//             <div
//               className="card-body"
//               style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
//             >
//               <p className="mb-0">
//                 {/* Display assistantCaption as is, or default if no active speech */}
//                 {assistantCaption || (callStatus === 'ACTIVE' ? 'Waiting for AI...' : '...')}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6 mb-3">
//           <div className="card shadow-sm">
//             <div className="card-header d-flex justify-content-between align-items-center bg-light">
//               <strong>{localUserName}</strong>
//               {callStatus === 'ACTIVE' && currentSpeakingRole === 'user' && (
//                 <span className="text-success fw-bold">🎤 Speaking...</span>
//               )}
//             </div>
//             <div
//               className="card-body"
//               style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
//             >
//               <p className="mb-0">
//                 {/* Display userCaption as is, or default if no active speech */}
//                 {userCaption || (callStatus === 'ACTIVE' ? 'Speak when ready...' : '...')}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {callStatus !== 'ACTIVE' && (
//         <div className="mt-4">
//           {!isInterviewCompleted && currentInterviewRecordId && (
//             <button
//               onClick={onContinueInterview}
//               className="btn btn-success me-2 mb-2"
//               disabled={loading}
//             >
//               Continue Interview
//             </button>
//           )}
//           {currentInterviewRecordId && (
//             <button
//               onClick={onRetakeInterview}
//               className="btn btn-warning me-2 mb-2"
//               disabled={loading}
//             >
//               Retake Interview (New Questions)
//             </button>
//           )}
//           {currentInterviewRecordId && (
//             <button
//               onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)}
//               className="btn btn-info mb-2"
//               disabled={loading}
//             >
//               View Feedback
//             </button>
//           )}
//         </div>
//       )}
//       {callStatus === 'ACTIVE' && (
//         <button onClick={onEndInterview} className="btn btn-danger mt-4" disabled={loading}>
//           End Interview Now
//         </button>
//       )}
//     </>
//   );
// };

// export default ActiveInterviewDisplay;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveInterviewDisplay = ({
  subject,
  callStatus,
  assistantCaption,
  userCaption,
  currentSpeakingRole,
  localUserName,
  isInterviewCompleted,
  currentInterviewRecordId,
  onContinueInterview,
  onRetakeInterview,
  onEndInterview,
  loading,
}) => {
  const navigate = useNavigate();

  // Helper function to get status badge classes
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500 text-white';
      case 'ENDED':
        return 'bg-gray-500 text-white';
      case 'PAUSED': // Assuming a 'PAUSED' status might exist or be derived from 'WARNING'
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-blue-500 text-white'; // Default for other statuses like 'CONNECTING'
    }
  };

  return (
    <div className="min-h-[calc(60vh-10px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">
          AI Interview Session
        </h2>

        <div className="flex items-center justify-center mb-6 text-lg md:text-xl font-semibold text-gray-700">
          <strong className="mr-2">Role:</strong>
          <span className="text-purple-700">{subject}</span>
        </div>

        <div className="flex items-center justify-center mb-8 text-lg md:text-xl font-semibold text-gray-700">
          <strong className="mr-2">Status:</strong>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusBadgeClasses(callStatus)}`}
          >
            {callStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Interviewer Card */}
          <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
              <strong className="text-lg font-semibold text-gray-800">AI Interviewer (Jennifer)</strong>
              {callStatus === 'ACTIVE' && currentSpeakingRole === 'assistant' && (
                <span className="flex items-center text-red-500 font-bold text-sm animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-5 5v1.071a1 1 0 00.707 1.707l2.828 2.829a1 1 0 001.414-1.414L13.414 15H15a1 1 0 000-2h-2a1 1 0 00-1 1z" clipRule="evenodd" />
                  </svg>
                  Listening...
                </span>
              )}
            </div>
            <div
              className="p-4 text-gray-700 text-base leading-relaxed"
              style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
            >
              <p className="mb-0">
                {assistantCaption || (callStatus === 'ACTIVE' ? 'Waiting for AI response...' : '...')}
              </p>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
              <strong className="text-lg font-semibold text-gray-800">{localUserName}</strong>
              {callStatus === 'ACTIVE' && currentSpeakingRole === 'user' && (
                <span className="flex items-center text-green-600 font-bold text-sm animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-5 5v1.071a1 1 0 00.707 1.707l2.828 2.829a1 1 0 001.414-1.414L13.414 15H15a1 1 0 000-2h-2a1 1 0 00-1 1z" clipRule="evenodd" />
                  </svg>
                  Speaking...
                </span>
              )}
            </div>
            <div
              className="p-4 text-gray-700 text-base leading-relaxed"
              style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
            >
              <p className="mb-0">
                {userCaption || (callStatus === 'ACTIVE' ? 'Speak when ready...' : '...')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {callStatus !== 'ACTIVE' ? (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {!isInterviewCompleted && currentInterviewRecordId && (
              <button
                onClick={onContinueInterview}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Continue Interview
              </button>
            )}
            {currentInterviewRecordId && (
              <button
                onClick={onRetakeInterview}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-md hover:from-yellow-600 hover:to-orange-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Retake Interview
              </button>
            )}
            {currentInterviewRecordId && (
              <button
                onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-cyan-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                View Feedback
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <button
              onClick={onEndInterview}
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:from-red-700 hover:to-pink-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              End Interview Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveInterviewDisplay;
