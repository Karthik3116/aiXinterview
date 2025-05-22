// src/components/NewInterviewForm.jsx
import React, { useState } from 'react';

const NewInterviewForm = ({ onCreateInterview, loading }) => {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateInterview(subject, numQuestions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="subject" className="form-label">
          <strong>Subject / Job Role:</strong>
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="form-control"
          placeholder="e.g., Software Engineer"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="numQuestions" className="form-label">
          <strong>Number of Questions:</strong>
        </label>
        <input
          id="numQuestions"
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="form-control"
          min={1}
          max={10}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
        {loading ? 'Starting...' : 'Start New Interview'}
      </button>
    </form>
  );
};

export default NewInterviewForm;