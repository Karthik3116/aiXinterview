

import React, { useState } from 'react';

const NewInterviewForm = ({ onCreateInterview, loading }) => {
    const [subject, setSubject] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    // State for job description and resume file
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
        } else {
            setResume(null);
            setFileName('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass all data, including new fields, to the parent handler
        onCreateInterview(subject, numQuestions, jobDescription, resume);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Start a New Interview</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="subject" className="form-label">Interview Subject / Role</label>
                        <input
                            type="text"
                            className="form-control"
                            id="subject"
                            placeholder="e.g., Senior React Developer"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="numQuestions" className="form-label">Number of Questions</label>
                        <input
                            type="number"
                            className="form-control"
                            id="numQuestions"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                            min="1"
                            max="15"
                            required
                        />
                    </div>

                    {/* Job Description Textarea */}
                    <div className="form-group mb-3">
                        <label htmlFor="jobDescription" className="form-label">Job Description (Optional)</label>
                        <textarea
                            className="form-control"
                            id="jobDescription"
                            rows="6"
                            placeholder="Paste job description here for more tailored questions..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                         <small className="form-text text-muted">Providing a job description helps the AI generate highly relevant questions.</small>
                    </div>

                    {/* Resume File Input */}
                    <div className="form-group mb-4">
                        <label htmlFor="resume" className="form-label">Upload Resume (Optional)</label>
                        <input
                            type="file"
                            className="form-control"
                            id="resume"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                        />
                         {fileName && <small className="form-text text-success mt-1">Selected: {fileName}</small>}
                    </div>


                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Preparing Interview...' : 'Create & Start Interview'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewInterviewForm;