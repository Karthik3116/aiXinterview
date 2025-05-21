const { check, validationResult } = require('express-validator');

exports.validateQuestionGeneration = [
  check('subject', 'Subject is required').notEmpty(),
  check('numQuestions', 'Must be a positive integer').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

exports.validateFeedbackRequest = [
  check('conversation', 'Conversation must be a non-empty array').isArray({ min: 1 }),
  check('jobRole', 'Job role is required').notEmpty(),
  check('candidateName', 'Candidate name is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
