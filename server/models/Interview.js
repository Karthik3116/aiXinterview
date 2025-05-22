

// const mongoose = require('mongoose');

// const InterviewSchema = new mongoose.Schema({
//   userId: { // Changed from 'user' to 'userId' for consistency with auth.req.user.id
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   subject: { // Renamed from jobRole to subject for consistency with frontend
//     type: String,
//     required: true,
//     trim: true,
//   },
//   numQuestions: { // Added to store how many questions were asked
//      type: Number,
//      required: true,
//   },
//   questions: [ // Changed from generatedQuestions to questions
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
//   // Feedback structure embedded directly
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
//   // History field to track all feedback scores over time
//   history: [
//     {
//       overallScore: {
//         type: Number,
//         min: 0,
//         max: 100,
//         required: true,
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },
//       retakeNumber: {
//         type: Number,
//         default: 1,
//       }
//     }
//   ],
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   completed: { // New field to mark if interview is finished
//      type: Boolean,
//      default: false,
//   },
// });

// module.exports = mongoose.model('Interview', InterviewSchema);


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
    // New fields for Vapi recording URL and full transcript
    vapiRecordingUrl: {
        type: String, // URL to the audio file (e.g., from Vapi's CDN/storage)
        required: false, // Not required until the call successfully ends
    },
    fullTranscript: {
        type: String, // The complete, concatenated transcript from Vapi's end-of-call-report
        required: false, // Not required until the call successfully ends
    },
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
    // History field to track all feedback scores over time
    history: [
        {
            overallScore: {
                type: Number,
                min: 0,
                max: 100,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            retakeNumber: {
                type: Number,
                default: 1,
            }
        }
    ],
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