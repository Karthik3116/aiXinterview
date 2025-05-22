// // src/components/ActiveInterviewDisplay.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ActiveInterviewDisplay = ({
//   subject,
//   callStatus,
//   assistantCaption,
//   userCaption,
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

// src/components/ActiveInterviewDisplay.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveInterviewDisplay = ({
  subject,
  callStatus,
  assistantCaption, // This will now persist longer
  userCaption,      // This will now persist longer
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

  return (
    <>
      <h5 className="mt-3">
        <strong>Role:</strong> {subject}
      </h5>
      <p>
        <strong>Status:</strong>{' '}
        <span
          className={`badge bg-${
            callStatus === 'ACTIVE'
              ? 'success'
              : callStatus === 'ENDED'
              ? 'secondary'
              : 'warning'
          }`}
        >
          {callStatus}
        </span>
      </p>

      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-light">
              <strong>AI Interviewer (Jennifer)</strong>
              {callStatus === 'ACTIVE' && currentSpeakingRole === 'assistant' && (
                <span className="text-danger fw-bold">🎤 Listening...</span>
              )}
            </div>
            <div
              className="card-body"
              style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
            >
              <p className="mb-0">
                {/* Display assistantCaption as is, or default if no active speech */}
                {assistantCaption || (callStatus === 'ACTIVE' ? 'Waiting for AI...' : '...')}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-light">
              <strong>{localUserName}</strong>
              {callStatus === 'ACTIVE' && currentSpeakingRole === 'user' && (
                <span className="text-success fw-bold">🎤 Speaking...</span>
              )}
            </div>
            <div
              className="card-body"
              style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
            >
              <p className="mb-0">
                {/* Display userCaption as is, or default if no active speech */}
                {userCaption || (callStatus === 'ACTIVE' ? 'Speak when ready...' : '...')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {callStatus !== 'ACTIVE' && (
        <div className="mt-4">
          {!isInterviewCompleted && currentInterviewRecordId && (
            <button
              onClick={onContinueInterview}
              className="btn btn-success me-2 mb-2"
              disabled={loading}
            >
              Continue Interview
            </button>
          )}
          {currentInterviewRecordId && (
            <button
              onClick={onRetakeInterview}
              className="btn btn-warning me-2 mb-2"
              disabled={loading}
            >
              Retake Interview (New Questions)
            </button>
          )}
          {currentInterviewRecordId && (
            <button
              onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)}
              className="btn btn-info mb-2"
              disabled={loading}
            >
              View Feedback
            </button>
          )}
        </div>
      )}
      {callStatus === 'ACTIVE' && (
        <button onClick={onEndInterview} className="btn btn-danger mt-4" disabled={loading}>
          End Interview Now
        </button>
      )}
    </>
  );
};

export default ActiveInterviewDisplay;