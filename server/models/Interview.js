// const mongoose = require('mongoose');

// const InterviewSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   jobRole: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   generatedQuestions: [
//     {
//       type: String,
//     },
//   ],
//   conversation: [
//     {
//       role: {
//         type: String,
//         enum: ['assistant', 'user'],
//         required: true,
//       },
//       content: {
//         type: String,
//         required: true,
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       }
//     },
//   ],
//   feedback: {
//     overallScore: {
//       type: Number,
//       min: 0,
//       max: 100,
//     },
//     strengths: [String],
//     areasForImprovement: [String],
//     detailedFeedback: {
//       type: String,
//     },
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Interview', InterviewSchema);
// models/Interview.js
const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  userId: { // Changed from 'user' to 'userId' for consistency with auth.req.user.id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: { // Renamed from jobRole to subject for consistency with frontend
    type: String,
    required: true,
    trim: true,
  },
  numQuestions: { // Added to store how many questions were asked
     type: Number,
     required: true,
  },
  questions: [ // Changed from generatedQuestions to questions
    {
      type: String,
    },
  ],
  conversation: [
    {
      role: {
        type: String,
        enum: ['assistant', 'user'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    },
  ],
  // Feedback structure embedded directly
  feedback: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengths: [String],
    areasForImprovement: [String],
    detailedFeedback: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  completed: { // New field to mark if interview is finished
     type: Boolean,
     default: false,
  },
});

module.exports = mongoose.model('Interview', InterviewSchema);