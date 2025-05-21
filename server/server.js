
// // backend/server.js

// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Load environment variables from .env file
// dotenv.config();

// const FRONTEND_URL = process.env.FRONTEND_URL;

// const app = express();

// app.use(cors({
//   origin: FRONTEND_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true, // if you use cookies or authorization headers
// }));


// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json()); // Parses incoming JSON requests
// app.use(cors());         // Enables CORS for all origins (configure more strictly in production)

// // Routes
// app.use('/api/auth', require('./routes/auth'));           // User authentication
// app.use('/api/interview', require('./routes/interview')); // Interview question & feedback

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.send('AI Interview Backend API Running');
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview'); // Your interview routes

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS for all routes

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));