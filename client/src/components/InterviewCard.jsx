// src/components/InterviewCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const InterviewCard = ({ interview }) => {
  const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card mb-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px' }}>
      <div className="card-body">
        <h5 className="card-title text-primary">{interview.subject} Interview</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Date: {formattedDate}
        </h6>
        <p className="card-text">Questions: {interview.numQuestions}</p>
        <p className="card-text">Status: {interview.completed ? 'Completed' : 'In Progress'}</p>

        <div className="d-flex flex-wrap gap-2">
            <Link to={`/interview/${interview._id}`} className="btn btn-sm btn-info">
              {interview.completed ? 'View Interview' : 'Continue Interview'}
            </Link>
            {interview.completed && interview.feedback && Object.keys(interview.feedback).length > 0 && (
                <Link to={`/interview/${interview._id}/feedback`} className="btn btn-sm btn-secondary">
                    View Feedback
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;