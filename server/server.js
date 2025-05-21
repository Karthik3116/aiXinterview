// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// const interviewRoutes = require('./routes/interview');
// app.use('/api/interview', interviewRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// backend/server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // if you use cookies or authorization headers
}));


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors());         // Enables CORS for all origins (configure more strictly in production)

// Routes
app.use('/api/auth', require('./routes/auth'));           // User authentication
app.use('/api/interview', require('./routes/interview')); // Interview question & feedback

// Health check endpoint
app.get('/', (req, res) => {
  res.send('AI Interview Backend API Running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
