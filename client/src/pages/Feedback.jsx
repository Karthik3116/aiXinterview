import React from 'react';
import { useParams } from 'react-router-dom';

const Feedback = () => {
  const { interviewId, feedbackId } = useParams();

  return (
    <div className="container mt-5">
      <h2>Feedback</h2>
      <p>Interview ID: {interviewId}</p>
      <p>Feedback ID: {feedbackId}</p>
      {/* You can fetch and show detailed feedback here */}
    </div>
  );
};

export default Feedback;
