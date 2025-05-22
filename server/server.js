// // server.js
// require('dotenv').config(); // Load environment variables from .env file
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Import cors middleware
// const authRoutes = require('./routes/auth');
// const interviewRoutes = require('./routes/interview'); // Your interview routes

// const app = express();

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1); // Exit process with failure
//   }
// };
// connectDB();

// // Middleware
// app.use(express.json()); // Body parser for JSON
// app.use(cors()); // Enable CORS for all routes

// // Define Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/interview', interviewRoutes);

// // Basic route for testing
// app.get('/', (req, res) => {
//   res.send('API Running');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const winston = require('winston');
const expressWinston = require('express-winston');
const statusMonitor = require('express-status-monitor');

// Routes
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');

const app = express();

// ✅ Ensure logs folder exists
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

// ✅ Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(statusMonitor()); // 📊 Add status monitor

// ✅ Logging middleware (logs to file)
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  expressFormat: true,
  colorize: false,
  meta: true,
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('API Running');
});

// ✅ Live Logs Dashboard
app.get('/status', statusMonitor().pageRoute); // 👈 Route to live dashboard

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📊 Monitor dashboard at http://localhost:${PORT}/status`);
});
