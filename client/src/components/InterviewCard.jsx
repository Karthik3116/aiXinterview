
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRightCircle, ClipboardCheck, Mic } from 'lucide-react';

// const InterviewCard = ({ interview }) => {
//   const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   const isCompleted = interview.completed;
//   const hasFeedback = isCompleted && interview.feedback && Object.keys(interview.feedback).length > 0;

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4 gap-2">
//         {/* Title and Date */}
//         <div className="min-w-0 flex-1">
//           <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">
//             {interview.subject} Interview
//           </h3>
//           <p className="text-sm text-gray-500 truncate">{formattedDate}</p>
//         </div>

//         {/* Status Pill */}
//         <div
//           className={`text-sm px-3 py-1 whitespace-nowrap rounded-full font-semibold shadow-sm shrink-0 ${
//             isCompleted
//               ? 'bg-green-100 text-green-700'
//               : 'bg-orange-100 text-orange-700'
//           }`}
//         >
//           {isCompleted ? 'Completed' : 'In Progress'}
//         </div>
//       </div>

//       {/* Info */}
//       <p className="text-gray-600 mb-5">Questions: {interview.numQuestions}</p>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-3">
//         <Link
//           to={`/interview/${interview._id}`}
//           className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700 transition"
//         >
//           {isCompleted ? <ClipboardCheck size={16} /> : <Mic size={16} />}
//           {isCompleted ? 'View Interview' : 'Continue Interview'}
//         </Link>

//         {hasFeedback && (
//           <Link
//             to={`/interview/${interview._id}/feedback`}
//             className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 text-sm rounded-lg hover:bg-gray-200 transition"
//           >
//             <ArrowRightCircle size={16} />
//             View Feedback
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewCard;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRightCircle, ClipboardCheck, Mic } from 'lucide-react';

// const InterviewCard = ({ interview }) => {
//   const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   const isCompleted = interview.completed;
//   const hasFeedback = isCompleted && interview.feedback && Object.keys(interview.feedback).length > 0;

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4 gap-3">
//         {/* Title and Date */}
//         <div className="min-w-0 flex-1">
//           <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-snug truncate">
//             {interview.subject} Interview
//           </h3>
//           <p className="text-sm text-gray-500 font-medium truncate">{formattedDate}</p>
//         </div>

//         {/* Status Pill */}
//         <div
//           className={`text-xs px-3 py-1.5 whitespace-nowrap rounded-full font-bold uppercase tracking-wide shadow-sm shrink-0
//             ${
//               isCompleted
//                 ? 'bg-green-50 text-green-700 border border-green-200'
//                 : 'bg-orange-50 text-orange-700 border border-orange-200'
//             }
//           `}
//         >
//           {isCompleted ? 'Completed' : 'In Progress'}
//         </div>
//       </div>

//       {/* Info */}
//       <p className="text-gray-700 text-base mb-6">
//         <span className="font-semibold">Questions:</span> {interview.numQuestions}
//       </p>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-3">
//         <Link
//           to={`/interview/${interview._id}`}
//           className="inline-flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-lg shadow-md
//                      bg-gradient-to-r from-purple-600 to-indigo-600 text-white
//                      hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
//         >
//           {isCompleted ? <ClipboardCheck size={18} /> : <Mic size={18} />}
//           {isCompleted ? 'View Interview' : 'Continue'}
//         </Link>

//         {hasFeedback && (
//           <Link
//             to={`/interview/${interview._id}/feedback`}
//             className="inline-flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-lg
//                        bg-gray-100 text-gray-800 border border-gray-200
//                        hover:bg-gray-200 hover:border-gray-300 transition duration-300 ease-in-out"
//           >
//             <ArrowRightCircle size={18} />
//             View Feedback
//           </Link>
//         )}
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
    <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-3">
        {/* Title and Date */}
        <div className="min-w-0 flex-1">
          <h3
            className="text-2xl font-bold text-gray-900 mb-1 leading-snug truncate"
            title={interview.subject + " Interview"} // Add title attribute for native tooltip
          >
            {interview.subject} Interview
          </h3>
          <p className="text-sm text-gray-500 font-medium truncate">{formattedDate}</p>
        </div>

        {/* Status Pill */}
        <div
          className={`text-xs px-3 py-1.5 whitespace-nowrap rounded-full font-bold uppercase tracking-wide shadow-sm shrink-0
            ${
              isCompleted
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-orange-50 text-orange-700 border border-orange-200'
            }
          `}
        >
          {isCompleted ? 'Completed' : 'In Progress'}
        </div>
      </div>

      {/* Info */}
      <p className="text-gray-700 text-base mb-6">
        <span className="font-semibold">Questions:</span> {interview.numQuestions}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/interview/${interview._id}`}
          className="inline-flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-lg shadow-md
                     bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                     hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          {isCompleted ? <ClipboardCheck size={18} /> : <Mic size={18} />}
          {isCompleted ? 'View Interview' : 'Continue'}
        </Link>

        {hasFeedback && (
          <Link
            to={`/interview/${interview._id}/feedback`}
            className="inline-flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-lg
                       bg-gray-100 text-gray-800 border border-gray-200
                       hover:bg-gray-200 hover:border-gray-300 transition duration-300 ease-in-out"
          >
            <ArrowRightCircle size={18} />
            View Feedback
          </Link>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;