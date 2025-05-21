// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.post('/', async (req, res) => {
//   const { subject, numQuestions } = req.body;

//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//     const prompt = `Generate ${numQuestions} clear and concise interview questions on the topic: ${subject}. Format each question as a separate line.`;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     const questions = text
//       .split('\n')
//       .map((line) => line.replace(/^\d+\.\s*/, '').trim())
//       .filter((q) => q.length > 0);

//     res.json({ questions });
//   } catch (error) {
//     console.error('Gemini Error:', error);
//     res.status(500).json({ error: 'Failed to generate questions' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.post('/generate', auth, interviewController.generateQuestions);
router.post('/feedback/:interviewId', auth, interviewController.generateFeedback);
router.get('/feedback/:feedbackId', auth, interviewController.getInterviewFeedback);

module.exports = router;
