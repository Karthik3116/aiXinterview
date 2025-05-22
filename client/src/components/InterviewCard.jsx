// // src/components/InterviewCard.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// const InterviewCard = ({ interview }) => {
//   const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return (
//     <div className="card mb-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px' }}>
//       <div className="card-body">
//         <h5 className="card-title text-primary">{interview.subject} Interview</h5>
//         <h6 className="card-subtitle mb-2 text-muted">
//           Date: {formattedDate}
//         </h6>
//         <p className="card-text">Questions: {interview.numQuestions}</p>
//         <p className="card-text">Status: {interview.completed ? 'Completed' : 'In Progress'}</p>

//         <div className="d-flex flex-wrap gap-2">
//             <Link to={`/interview/${interview._id}`} className="btn btn-sm btn-info">
//               {interview.completed ? 'View Interview' : 'Continue Interview'}
//             </Link>
//             {interview.completed && interview.feedback && Object.keys(interview.feedback).length > 0 && (
//                 <Link to={`/interview/${interview._id}/feedback`} className="btn btn-sm btn-secondary">
//                     View Feedback
//                 </Link>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, ClipboardCheck, Mic } from 'lucide-react';

const InterviewCard = ({ interview }) => {
  const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isCompleted = interview.completed;
  const hasFeedback = isCompleted && interview.feedback && Object.keys(interview.feedback).length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {interview.subject} Interview
          </h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        {/* Status Pill */}
        <div
          className={`text-sm px-3 py-1 rounded-full font-semibold shadow-sm ${
            isCompleted
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {isCompleted ? 'Completed' : 'In Progress'}
        </div>
      </div>

      {/* Info */}
      <p className="text-gray-600 mb-5">Questions: {interview.numQuestions}</p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/interview/${interview._id}`}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          {isCompleted ? <ClipboardCheck size={16} /> : <Mic size={16} />}
          {isCompleted ? 'View Interview' : 'Continue Interview'}
        </Link>

        {hasFeedback && (
          <Link
            to={`/interview/${interview._id}/feedback`}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 text-sm rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowRightCircle size={16} />
            View Feedback
          </Link>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
