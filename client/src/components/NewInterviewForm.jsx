// // src/components/NewInterviewForm.jsx
// import React, { useState } from 'react';

// const NewInterviewForm = ({ onCreateInterview, loading }) => {
//   const [subject, setSubject] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onCreateInterview(subject, numQuestions);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="form-group mb-3">
//         <label htmlFor="subject" className="form-label">
//           <strong>Subject / Job Role:</strong>
//         </label>
//         <input
//           id="subject"
//           type="text"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           className="form-control"
//           placeholder="e.g., Software Engineer"
//           required
//         />
//       </div>
//       <div className="form-group mb-3">
//         <label htmlFor="numQuestions" className="form-label">
//           <strong>Number of Questions:</strong>
//         </label>
//         <input
//           id="numQuestions"
//           type="number"
//           value={numQuestions}
//           onChange={(e) => setNumQuestions(parseInt(e.target.value))}
//           className="form-control"
//           min={1}
//           max={10}
//           required
//         />
//       </div>
//       <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
//         {loading ? 'Starting...' : 'Start New Interview'}
//       </button>
//     </form>
//   );
// };

// export default NewInterviewForm;
// src/components/NewInterviewForm.jsx
import React, { useState } from 'react';

const NewInterviewForm = ({ onCreateInterview, loading }) => {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5 questions
  const [subjectError, setSubjectError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setSubjectError('Please enter a subject for the interview.');
      return;
    }
    setSubjectError(''); // Clear error if subject is valid
    onCreateInterview(subject, numQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto border border-gray-100">
      <div className="mb-6">
        <label htmlFor="subject" className="block text-gray-800 text-lg font-semibold mb-2">
          Subject / Job Role:
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            if (e.target.value.trim()) setSubjectError(''); // Clear error on typing
          }}
          className={`w-full px-4 py-3 border ${
            subjectError ? 'border-red-500' : 'border-gray-300'
          } rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-500 transition duration-200 text-gray-800 placeholder-gray-400 text-base`}
          placeholder="e.g., Software Engineer, Marketing Manager"
          required
        />
        {subjectError && <p className="text-red-500 text-sm mt-1">{subjectError}</p>}
      </div>

      <div className="mb-8">
        <label htmlFor="numQuestions" className="block text-gray-800 text-lg font-semibold mb-2">
          Number of Questions:
        </label>
        <input
          id="numQuestions"
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))} // Ensure base 10 parsing
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-500 transition duration-200 text-gray-800 text-base"
          min={1}
          max={10}
          required
        />
        <p className="text-sm text-gray-500 mt-2">Choose between 1 and 10 questions.</p>
      </div>

      <button
        type="submit"
        className={`w-full flex items-center justify-center px-8 py-3 text-lg font-bold rounded-lg shadow-md
                   ${loading
                     ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                     : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                   }
                   transition duration-300 ease-in-out`}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Starting Interview...
          </>
        ) : (
          'Start New Interview'
        )}
      </button>
    </form>
  );
};

export default NewInterviewForm;