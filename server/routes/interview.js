
// const express = require('express');
// const router = express.Router();
// const interviewController = require('../controllers/interviewController');
// const auth = require('../middleware/auth');

// router.post('/generate', auth, interviewController.generateQuestions);
// router.post('/feedback/:interviewId', auth, interviewController.generateFeedback);
// router.get('/feedback/:feedbackId', auth, interviewController.getInterviewFeedback);

// module.exports = router;


// routes/interview.js
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

// Generate questions and create a new interview record
router.post('/generate', auth, interviewController.generateQuestions);

router.post('/:id/regenerate', auth, interviewController.regenerateQuestions); // <--- ADDED THIS LINE

// Get all interviews for the authenticated user
router.get('/', auth, interviewController.getAllInterviews);

// Get a specific interview by ID (for viewing/continuing)
router.get('/:id', auth, interviewController.getInterviewById);

// Complete an interview (save conversation, mark as completed)
router.post('/:id/complete', auth, interviewController.completeInterview);

// Generate and save feedback for a specific interview
router.post('/:interviewId/feedback', auth, interviewController.generateFeedback);

// Get feedback for a specific interview (now by interviewId, as feedback is embedded)
router.get('/:interviewId/feedback', auth, interviewController.getInterviewFeedback);


module.exports = router;