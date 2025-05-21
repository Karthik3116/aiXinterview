const Interview = require('../models/Interview');
const mongoose = require('mongoose');
const model = require('../services/geminiModel');   // Import Gemini model service




exports.generateQuestions = async (req, res) => {
  const { subject, numQuestions } = req.body;
  try {
    const prompt = `Generate ${numQuestions} interview questions for a ${subject} role. Format as "1. Question..."`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const questions = text.split('\n')
      .map(q => q.trim())
      .filter(q => /^\d+\.\s/.test(q))
      .map(q => q.replace(/^\d+\.\s/, ''));

    if (!questions.length) return res.status(500).json({ msg: "Gemini failed to format questions correctly" });

    res.json({ questions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error generating questions');
  }
};


exports.generateFeedback = async (req, res) => {
  const { conversation, jobRole, candidateName } = req.body;
  const interviewId = req.params.interviewId;
  const userId = req.user.id;

  console.log("Feedback request received for interview ID:", interviewId);

  try {
    const interview = (interviewId !== 'new' && mongoose.Types.ObjectId.isValid(interviewId))
      ? await Interview.findById(interviewId)
      : null;

    if (interview && interview.user.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized or interview not found' });
    }

    const prompt = generateFeedbackPrompt(conversation, jobRole, candidateName);
    const response = await model.generateContent(prompt);
    const rawText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: "Model response missing or malformed", rawText });
    }

    const feedback = parseStructuredFeedback(rawText);

    const feedbackData = {
      interviewId,
      userId,
      jobRole,
      candidateName,
      questionAnalysis: feedback.feedback.questionAnalysis,
      overallRating: feedback.feedback.overallRating,
      overallSummary: feedback.feedback.overallSummary,
      recommendation: feedback.feedback.recommendation,
      recommendationMessage: feedback.feedback.recommendationMessage,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db.collection("feedbacks").add(feedbackData);
    const feedbackId = docRef.id;

    console.log("Feedback saved to Firebase with ID:", feedbackId);
    res.status(200).json({ feedbackId });
  } catch (error) {
    console.error("Error generating or parsing feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback", details: error.message });
  }
};



exports.getInterviewFeedback = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.feedbackId).populate('user', 'username email');
    if (!interview) return res.status(404).json({ msg: 'Feedback not found' });
    if (interview.user._id.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    res.json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error retrieving feedback');
  }
};
