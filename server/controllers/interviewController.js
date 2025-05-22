
const Interview = require('../models/Interview');
const mongoose = require('mongoose');
const model = require('../services/geminiModel'); // Import Gemini model service

// Helper function to parse JSON from Gemini's text response
function parseJsonFromText(text) {
    try {
        // Find the first and last curly braces to extract the JSON string
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
            return JSON.parse(jsonString);
        }
        console.warn("Could not find JSON object in text:", text);
        return null;
    } catch (e) {
        console.error("Error parsing JSON from text:", e, "Original text:", text);
        return null;
    }
}

// Helper function to generate feedback prompt
// const generateFeedbackPrompt = (conversation, jobRole, candidateName) => {
//     let conversationLog = conversation.map(turn => `${turn.role === 'user' ? 'Candidate' : 'Interviewer'}: ${turn.content}`).join('\n');

//     return `
//     You are an advanced AI interview feedback generator. Analyze the following conversation between an interviewer and a candidate for the "${jobRole}" position.
// The candidate's name is "${candidateName}".

//     Conversation Log:
//     ${conversationLog}

//     Please provide a structured feedback report in JSON format, with the following keys:
//     {
//       "overallScore": "Number between 0 and 100, representing the candidate's overall performance.",
//       "overallSummary": "A concise paragraph summarizing the candidate's overall performance, strengths, and weaknesses.",
//       "strengths": ["Array of key strengths observed, e.g., 'Strong problem-solving skills', 'Clear communication'"],
//       "areasForImprovement": ["Array of areas where the candidate could improve, e.g., 'Needs to deepen technical knowledge', 'Could elaborate more on examples'"],
//       "questionAnalysis": [
//         {
//           "question": "The interviewer's question text.",
//           "candidateAnswer": "The candidate's answer text.",
//           "feedback": "Specific feedback on this answer, highlighting pros and cons.",
//           "score": "Score for this specific answer (e.g., 1-10 or Bad/Average/Good)"
//         },
//         // ... more objects for each question-answer pair
//       ],
//       "recommendation": "One of: 'Strong Hire', 'Consider for another role', 'Further Interview Needed', 'Do Not Hire'",
//       "recommendationMessage": "A brief message explaining the recommendation."
//     }
//     Ensure the JSON is perfectly valid and self-contained within curly braces.
//     `;
// };


const generateFeedbackPrompt = (conversation, jobRole, candidateName) => {
  let conversationLog = conversation
    .map(turn => `${turn.role === 'user' ? 'Candidate' : 'Interviewer'}: ${turn.content}`)
    .join('\n');

  const sanitizedConversationLog = conversationLog.replace(/`/g, "'");

  const meaningfulTurns = conversation.filter(
    turn =>
      turn.role === 'user' &&
      turn.content &&
      turn.content.trim() !== '' &&
      !['yeah', 'yes', 'yep', 'okay', 'ok'].includes(turn.content.trim().toLowerCase())
  );
  const hasMeaningfulInteraction = meaningfulTurns.length > 0;

  if (!hasMeaningfulInteraction) {
    return `
You are an advanced AI interview feedback generator. The interview is for the "${jobRole}" position and the candidate's name is "${candidateName}".

Conversation Log:
\`\`\`
${sanitizedConversationLog}
\`\`\`

The interview is extremely short or uninformative. Generate a single, valid JSON object with the following fields exactly:

{
  "overallScore": 0,
  "overallSummary": "The interview was too short or uninformative to assess.",
  "strengths": ["Insufficient information to determine strengths"],
  "areasForImprovement": ["Candidate needs to complete a full interview to be assessed"],
  "questionAnalysis": [],
  "recommendation": "Insufficient Data",
  "recommendationMessage": "Not enough data to provide a recommendation."
}
    `;
  }

  // Full-instruction prompt, with all internal backticks escaped
  return `
You are an advanced AI interview feedback generator. Your primary task is to analyze the provided conversation log and generate a structured, valid JSON feedback report.
The interview is for the "${jobRole}" position, and the candidate's name is "${candidateName}".

Conversation Log:
\`\`\`
${sanitizedConversationLog}
\`\`\`

Please adhere strictly to the following instructions to ensure stable and reliable feedback:

1. **JSON Output Format:** The output MUST be a single, valid JSON object. Do not include any text or commentary before the opening \'{\' or after the closing \'}\'.
2. **Data Handling:**
   - If the conversation is extremely short, incomplete, or the candidate provides uncooperative/irrelevant answers, use the default incomplete-interview structure (score = 0, etc.).
   - Otherwise, populate fields based on actual performance.
3. **String Content:** Escape special characters when including conversation text.

JSON Structure:
\`\`\`json
{
  "overallScore": "Number between 0 and 100.",
  "overallSummary": "Concise summary of performance.",
  "strengths": ["..."],
  "areasForImprovement": ["..."],
  "questionAnalysis": [
    {
      "question": "...",
      "candidateAnswer": "...",
      "feedback": "...",
      "score": "0-10"
    }
    // ... more
  ],
  "recommendation": "Strong Hire | Consider for Hire | Further Interview Needed | Not a Fit at This Time",
  "recommendationMessage": "..."
}
\`\`\`

Analyze and construct the JSON accordingly.
  `;
};



// @route   POST api/interview/generate
// @desc    Generate interview questions and create a new interview record
// @access  Private
exports.generateQuestions = async (req, res) => {
  const { subject, numQuestions } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    // 1. Call Gemini to generate questions
    const prompt = `Generate exactly ${numQuestions} interview questions for a ${subject} role. Provide them as a JSON array of strings, like this: {"questions": ["Question 1?", "Question 2?", ...]}.`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const parsedResult = parseJsonFromText(text);
    const questions = parsedResult?.questions;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.error("Gemini failed to format questions correctly or returned empty:", text);
        return res.status(500).json({ msg: "Failed to generate questions or received malformed response." });
    }

    // 2. Save the new interview record
    const newInterview = new Interview({
      userId,
      subject,
      numQuestions,
      questions,
      completed: false, // Mark as not completed initially
      history: [], // Initialize empty history
    });

    await newInterview.save();

    res.status(201).json({ interviewId: newInterview._id, questions: newInterview.questions });
  } catch (err) {
    console.error("Error in generateQuestions:", err.message);
    if (err.response) {
      console.error("Gemini API error data:", err.response.data);
    }
    res.status(500).send('Server Error during question generation');
  }
};

// @route   POST api/interview/:id/regenerate
// @desc    Regenerate questions for existing interview and reset for retake
// @access  Private
exports.regenerateQuestions = async (req, res) => {
    const { subject, numQuestions } = req.body;
    const interviewId = req.params.id;
    const userId = req.user.id; // From auth middleware

    try {
        // Find the existing interview by ID and ensure it belongs to the user
        let interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }

        // Authorization check: Ensure the interview belongs to the authenticated user
        if (interview.userId.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Generate new questions using the Gemini model
        const prompt = `Generate exactly ${numQuestions} interview questions for a ${subject} role. Provide them as a JSON array of strings, like this: {"questions": ["Question 1?", "Question 2?", ...]}.`;
        const result = await model.generateContent(prompt);
        const text = await result.response.text(); // Get the plain text response from Gemini

        // Parse the questions from the AI's text response
        const parsedResult = parseJsonFromText(text);
        const questions = parsedResult?.questions;

        // Validate the generated questions
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            console.error("Gemini failed to format questions correctly or returned empty:", text);
            return res.status(500).json({ msg: "Failed to generate questions or received malformed response." });
        }

        // Update the existing interview record for a retake
        interview.questions = questions;       // Replace with new questions
        interview.conversation = [];           // Clear previous conversation
        interview.completed = false;           // Mark as incomplete for a new attempt
        // Note: The 'feedback' and 'history' are NOT reset here.
        // A new feedback entry will be added to history, and the main
        // feedback field will be updated when this new interview is completed.

        await interview.save(); // Save the updated interview record

        // Send back the new questions
        res.json({ questions: interview.questions });

    } catch (err) {
        console.error("Error in regenerateQuestions:", err.message);
        if (err.response) {
            // Log specific error data from the Gemini API if available
            console.error("Gemini API error data:", err.response.data);
        }
        res.status(500).send('Server Error during question regeneration');
    }
};


// @route   POST api/interview/:id/complete
// @desc    Update interview with conversation and mark as completed
// @access  Private
exports.completeInterview = async (req, res) => {
    const { conversation } = req.body;
    const interviewId = req.params.id;
    const userId = req.user.id; // From auth middleware

    try {
        let interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }

        // Ensure the interview belongs to the user
        if (interview.userId.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        interview.conversation = conversation;
        interview.completed = true; // Mark as completed

        await interview.save();
        res.json({ msg: 'Interview completed and conversation saved successfully', interviewId: interview._id });
    } catch (err) {
        console.error("Error in completeInterview:", err.message);
        res.status(500).send('Server Error during interview completion');
    }
};


// @route   POST api/interview/feedback/:interviewId
// @desc    Generate and save feedback for an interview
// @access  Private
exports.generateFeedback = async (req, res) => {
    const { conversation, jobRole, candidateName } = req.body;
    const interviewId = req.params.interviewId;
    const userId = req.user.id;

    console.log("Feedback request received for interview ID:", interviewId);

    try {
        let interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }

        if (interview.userId.toString() !== userId) {
            return res.status(401).json({ msg: 'Not authorized for this interview' });
        }

        const prompt = generateFeedbackPrompt(conversation, jobRole, candidateName);
        const result = await model.generateContent(prompt);
        const rawText = result.response.text(); // Use .text() for plain text response

        if (!rawText) {
            return res.status(500).json({ error: "Model response missing or malformed", rawText });
        }

        // Parse the structured feedback from the text
        const feedbackData = parseJsonFromText(rawText);

        if (!feedbackData || !feedbackData.overallScore) { // Basic validation
            console.error("Parsed feedback is invalid or missing required fields:", feedbackData);
            return res.status(500).json({ error: "Failed to parse structured feedback from model.", rawText });
        }

        // Calculate the retake number based on existing history
        const retakeNumber = interview.history ? interview.history.length + 1 : 1;

        // Add current score to history before updating feedback
        if (!interview.history) {
            interview.history = [];
        }

        interview.history.push({
            overallScore: feedbackData.overallScore,
            timestamp: new Date(),
            retakeNumber: retakeNumber
        });

        // Update the interview record with the generated feedback
        interview.feedback = {
            overallScore: feedbackData.overallScore,
            strengths: feedbackData.strengths || [],
            areasForImprovement: feedbackData.areasForImprovement || [],
            detailedFeedback: feedbackData.overallSummary || '',
            // You can add more fields if your model generates them and your schema supports them
        };

        await interview.save();

        console.log("Feedback saved to Interview record with ID:", interviewId);
        res.status(200).json({
            msg: "Feedback generated and saved successfully",
            feedback: interview.feedback,
            history: interview.history,
            interviewId: interview._id
        });
    } catch (error) {
        console.error("Error generating or parsing feedback:", error);
        res.status(500).json({ error: "Failed to generate feedback", details: error.message });
    }
};

// @route   GET api/interview/
// @desc    Get all interviews for the authenticated user
// @access  Private
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id }).sort({ date: -1 }); // Sort by creation date
    res.json(interviews);
  } catch (err) {
    console.error("Error in getAllInterviews:", err.message);
    res.status(500).send('Server Error retrieving interviews');
  }
};

// @route   GET api/interview/:id
// @desc    Get a single interview by ID for the authenticated user
// @access  Private
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });

    if (!interview) {
      return res.status(404).json({ msg: 'Interview not found or not authorized' });
    }
    res.json(interview);
  } catch (err) {
    console.error("Error in getInterviewById:", err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Interview not found' });
    }
    res.status(500).send('Server Error retrieving interview');
  }
};

// @route   GET api/interview/feedback/:interviewId
// @desc    Get feedback for a specific interview
// @access  Private
// NOTE: This endpoint now gets feedback *from* the interview record itself.
exports.getInterviewFeedback = async (req, res) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.interviewId, userId: req.user.id });

        if (!interview) {
            return res.status(404).json({ msg: 'Interview or feedback not found or not authorized' });
        }
        if (!interview.feedback || Object.keys(interview.feedback).length === 0) {
            return res.status(404).json({ msg: 'Feedback not yet generated for this interview.' });
        }
        res.json({
            feedback: interview.feedback,
            history: interview.history || [],
            interviewId: interview._id
        });
    } catch (err) {
        console.error("Error in getInterviewFeedback:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid interview ID' });
        }
        res.status(500).send('Error retrieving feedback');
    }
};

// @route   GET api/interview/:id/history
// @desc    Get score history for a specific interview
// @access  Private
exports.getInterviewHistory = async (req, res) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found or not authorized' });
        }

        res.json({
            history: interview.history || [],
            subject: interview.subject,
            interviewId: interview._id
        });
    } catch (err) {
        console.error("Error in getInterviewHistory:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid interview ID' });
        }
        res.status(500).send('Error retrieving interview history');
    }
};
