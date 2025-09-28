
// // const express = require('express');
// // const router = express.Router();
// // const interviewController = require('../controllers/interviewController');
// // const auth = require('../middleware/auth');

// // router.post('/generate', auth, interviewController.generateQuestions);
// // router.post('/feedback/:interviewId', auth, interviewController.generateFeedback);
// // router.get('/feedback/:feedbackId', auth, interviewController.getInterviewFeedback);

// // module.exports = router;


// // routes/interview.js
// const express = require('express');
// const router = express.Router();
// const interviewController = require('../controllers/interviewController');
// const auth = require('../middleware/auth');

// // Generate questions and create a new interview record
// router.post('/generate', auth, interviewController.generateQuestions);

// router.post('/:id/regenerate', auth, interviewController.regenerateQuestions); // <--- ADDED THIS LINE

// // Get all interviews for the authenticated user
// router.get('/', auth, interviewController.getAllInterviews);

// // Get a specific interview by ID (for viewing/continuing)
// router.get('/:id', auth, interviewController.getInterviewById);

// // Complete an interview (save conversation, mark as completed)
// router.post('/:id/complete', auth, interviewController.completeInterview);

// // Generate and save feedback for a specific interview
// router.post('/:interviewId/feedback', auth, interviewController.generateFeedback);

// // Get feedback for a specific interview (now by interviewId, as feedback is embedded)
// router.get('/:interviewId/feedback', auth, interviewController.getInterviewFeedback);


// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');

const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth'); // Assuming your auth middleware is in ../middleware/auth

// Configure multer for file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
        }
    },
});

// Validator middleware to run before the controller
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @route   POST api/interview/generate
// @desc    Generate interview questions and create a new interview record
// @access  Private
router.post(
    '/generate',
    [
        auth,
        upload.single('resume'), // 'resume' is the field name from the form
        check('subject', 'Subject is required').notEmpty(),
        check('numQuestions', 'Number of questions must be a positive integer').isInt({ min: 1 }),
    ],
    validateRequest,
    interviewController.generateQuestions
);

// @route   POST api/interview/:id/regenerate
// @desc    Regenerate questions for an existing interview
// @access  Private
router.post('/:id/regenerate', auth, interviewController.regenerateQuestions);

// @route   POST api/interview/:id/complete
// @desc    Update interview with conversation and mark as completed
// @access  Private
router.post('/:id/complete', auth, interviewController.completeInterview);

// @route   POST api/interview/:interviewId/feedback
// @desc    Generate and save feedback for an interview
// @access  Private
router.post(
    '/:interviewId/feedback',
    [
        auth,
        check('conversation', 'Conversation is required').isArray({ min: 1 }),
        check('jobRole', 'Job role is required').notEmpty(),
        check('candidateName', 'Candidate name is required').notEmpty(),
    ],
    validateRequest,
    interviewController.generateFeedback
);

// @route   GET api/interview/
// @desc    Get all interviews for the authenticated user
// @access  Private
router.get('/', auth, interviewController.getAllInterviews);

// @route   GET api/interview/:id
// @desc    Get a single interview by ID
// @access  Private
router.get('/:id', auth, interviewController.getInterviewById);

// @route   GET api/interview/:interviewId/feedback
// @desc    Get feedback for a specific interview
// @access  Private
router.get('/:interviewId/feedback', auth, interviewController.getInterviewFeedback);

// @route   GET api/interview/:id/history
// @desc    Get score history for a specific interview
// @access  Private
router.get('/:id/history', auth, interviewController.getInterviewHistory);


module.exports = router;