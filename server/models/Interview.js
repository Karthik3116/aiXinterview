const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
  },
  generatedQuestions: [
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
});

module.exports = mongoose.model('Interview', InterviewSchema);
