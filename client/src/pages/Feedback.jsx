// import React from 'react';
// import { useParams } from 'react-router-dom';

// const Feedback = () => {
//   const { interviewId, feedbackId } = useParams();

//   return (
//     <div className="container mt-5">
//       <h2>Feedback</h2>
//       <p>Interview ID: {interviewId}</p>
//       <p>Feedback ID: {feedbackId}</p>
//       {/* You can fetch and show detailed feedback here */}
//     </div>
//   );
// };

// export default Feedback;


// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Feedback = () => {
  const { interviewId } = useParams(); // Now we only need interviewId
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in.');
          setLoading(false);
          return;
        }
        // Fetch feedback using interviewId
        const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}/feedback`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setFeedback(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err.response?.data || err.message);
        setError(err.response?.data?.msg || 'Failed to fetch feedback.');
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchFeedback();
    }
  }, [interviewId]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Feedback...</span>
        </div>
        <p>Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!feedback) {
    return <div className="container mt-5 alert alert-info">No feedback available for this interview yet.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Interview Feedback</h2>
      <div className="card shadow-sm p-4">
        <h3 className="text-primary">Overall Assessment:</h3>
        <p><strong>Score:</strong> {feedback.overallScore}/100</p>
        <p><strong>Summary:</strong> {feedback.detailedFeedback}</p>

        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="mt-4">
            <h4 className="text-success">Strengths:</h4>
            <ul className="list-group">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="list-group-item">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
          <div className="mt-4">
            <h4 className="text-warning">Areas for Improvement:</h4>
            <ul className="list-group">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="list-group-item">{area}</li>
              ))}
            </ul>
          </div>
        )}

        {feedback.questionAnalysis && feedback.questionAnalysis.length > 0 && (
          <div className="mt-4">
            <h4 className="text-info">Question-by-Question Analysis:</h4>
            {feedback.questionAnalysis.map((qa, index) => (
              <div key={index} className="card my-3 p-3 bg-light">
                <p><strong>Question:</strong> {qa.question}</p>
                <p><strong>Candidate Answer:</strong> {qa.candidateAnswer}</p>
                <p><strong>Feedback:</strong> {qa.feedback}</p>
                <p><strong>Score:</strong> {qa.score}</p>
              </div>
            ))}
          </div>
        )}

        {feedback.recommendation && (
            <div className="mt-4">
                <h4 className="text-danger">Recommendation:</h4>
                <p><strong>Verdict:</strong> {feedback.recommendation}</p>
                <p><strong>Message:</strong> {feedback.recommendationMessage}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;