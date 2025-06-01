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


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const winston = require('winston');
// const expressWinston = require('express-winston');
// const statusMonitor = require('express-status-monitor');

// // Routes
// const authRoutes = require('./routes/auth');
// const interviewRoutes = require('./routes/interview');

// const app = express();

// // ✅ Ensure logs folder exists
// if (!fs.existsSync('logs')) fs.mkdirSync('logs');

// // ✅ Connect MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };
// connectDB();

// // ✅ Middlewares
// // app.use(cors());
// const corsOptions = {
//   origin: '*', // allow all origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'x-auth-token'],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(statusMonitor()); // 📊 Add status monitor

// // ✅ Logging middleware (logs to file)
// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.File({ filename: 'logs/requests.log' }),
//     new winston.transports.Console()
//   ],
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   expressFormat: true,
//   colorize: false,
//   meta: true,
// }));

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/interview', interviewRoutes);

// // ✅ Health check
// app.get('/', (req, res) => {
//   res.send('API Running');
// });

// // ✅ Live Logs Dashboard
// app.get('/status', statusMonitor().pageRoute); // 👈 Route to live dashboard

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
//   console.log(`📊 Monitor dashboard at http://localhost:${PORT}/status`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const winston = require('winston');
const expressWinston = require('express-winston');
const statusMonitor = require('express-status-monitor');
const fetch = require('node-fetch'); // install with: npm install node-fetch@2

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

// ✅ CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(statusMonitor());

// ✅ Logging middleware
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
app.get('/status', statusMonitor().pageRoute);

// ✅ Monitoring External Servers
const monitoredServers = [
  { name: 'server1', url: 'https://aixinterview.onrender.com' },
  { name: 'server2', url: 'https://aixinterview-hbui.onrender.com/' },
  { name: 'chatApp', url: 'https://www.chat.karthik.top/' },
  { name: 'FlaskApp', url: 'https://collegify.pythonanywhere.com/' },
  
];

const logFile = 'log.json';

// Load existing logs from file if available
let logData = {};
if (fs.existsSync(logFile)) {
  try {
    const fileContent = fs.readFileSync(logFile, 'utf-8');
    logData = JSON.parse(fileContent);
  } catch (err) {
    console.error('⚠️ Failed to parse existing log.json. Starting fresh.');
    logData = {};
  }
}

// const checkServers = async () => {
//   for (const server of monitoredServers) {
//     const serverLogs = logData[server.name] || [];

//     try {
//       const response = await fetch(server.url);
//       const status = response.status;
//       const text = await response.text();

//       serverLogs.push({
//         url: server.url,
//         status,
//         timestamp: new Date().toISOString(),
//         message: text.slice(0, 100)
//       });
//     } catch (error) {
//       serverLogs.push({
//         url: server.url,
//         status: 'Error',
//         timestamp: new Date().toISOString(),
//         message: error.message
//       });
//     }

//     // Keep only last 50 logs
//     logData[server.name] = serverLogs.slice(-50);
//   }

//   // Save updated logs to file
//   fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
// };

const checkServers = async () => {
  for (const server of monitoredServers) {
    const serverLogs = logData[server.name] || [];

    const start = Date.now();
    try {
      const response = await fetch(server.url);
      const text = await response.text();
      const end = Date.now();

      serverLogs.push({
        url: server.url,
        status: response.status,
        timestamp: new Date().toISOString(),
        message: text.slice(0, 100),
        responseTime: end - start // in milliseconds
      });
    } catch (error) {
      const end = Date.now();
      serverLogs.push({
        url: server.url,
        status: 'Error',
        timestamp: new Date().toISOString(),
        message: error.message,
        responseTime: end - start
      });
    }

    logData[server.name] = serverLogs.slice(-50);
  }

  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
};


// ✅ Check servers every 5 minutes
setInterval(checkServers, 60* 1000);
checkServers(); // Initial check on startup

// ✅ Serve logs
app.get('/details', (req, res) => {
  if (fs.existsSync(logFile)) {
    const data = fs.readFileSync(logFile);
    res.header('Content-Type', 'application/json');
    res.send(data);
  } else {
    res.status(404).json({ error: 'No log file found.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📊 Monitor dashboard at http://localhost:${PORT}/status`);
  console.log(`📁 View external server logs at http://localhost:${PORT}/details`);
});
