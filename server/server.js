
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs');
// const tough = require("tough-cookie");

// const winston = require('winston');
// const expressWinston = require('express-winston');
// const statusMonitor = require('express-status-monitor');
// const fetch = require('node-fetch'); // install with: npm install node-fetch@2

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

// // ✅ CORS
// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'x-auth-token'],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(statusMonitor());

// // ✅ Logging middleware
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
// app.get('/status', statusMonitor().pageRoute);

// // ✅ Monitoring External Servers
// const monitoredServers = [
//   { name: 'RAGAPP', url: 'https://grokbot.streamlit.app/' },
//   { name: 'server1', url: 'https://aixinterview.onrender.com' },
//   { name: 'server2', url: 'https://aixinterview-hbui.onrender.com/' },
//   { name: 'chatApp', url: 'https://www.chat.karthik.top/' },
//   { name: 'FlaskApp', url: 'https://collegify.pythonanywhere.com/' },
  
// ];

// const logFile = 'log.json';

// // Load existing logs from file if available
// let logData = {};
// if (fs.existsSync(logFile)) {
//   try {
//     const fileContent = fs.readFileSync(logFile, 'utf-8');
//     logData = JSON.parse(fileContent);
//   } catch (err) {
//     console.error('⚠️ Failed to parse existing log.json. Starting fresh.');
//     logData = {};
//   }
// }

// // const checkServers = async () => {
// //   for (const server of monitoredServers) {
// //     const serverLogs = logData[server.name] || [];

// //     try {
// //       const response = await fetch(server.url);
// //       const status = response.status;
// //       const text = await response.text();

// //       serverLogs.push({
// //         url: server.url,
// //         status,
// //         timestamp: new Date().toISOString(),
// //         message: text.slice(0, 100)
// //       });
// //     } catch (error) {
// //       serverLogs.push({
// //         url: server.url,
// //         status: 'Error',
// //         timestamp: new Date().toISOString(),
// //         message: error.message
// //       });
// //     }

// //     // Keep only last 50 logs
// //     logData[server.name] = serverLogs.slice(-50);
// //   }

// //   // Save updated logs to file
// //   fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
// // };

// // const checkServers = async () => {
// //   for (const server of monitoredServers) {
// //     const serverLogs = logData[server.name] || [];

// //     const start = Date.now();
// //     try {
// //       const response = await fetch(server.url);
// //       const text = await response.text();
// //       const end = Date.now();

// //       serverLogs.push({
// //         url: server.url,
// //         status: response.status,
// //         timestamp: new Date().toISOString(),
// //         message: text.slice(0, 100),
// //         responseTime: end - start // in milliseconds
// //       });
// //     } catch (error) {
// //       const end = Date.now();
// //       serverLogs.push({
// //         url: server.url,
// //         status: 'Error',
// //         timestamp: new Date().toISOString(),
// //         message: error.message,
// //         responseTime: end - start
// //       });
// //     }

// //     logData[server.name] = serverLogs.slice(-50);
// //   }

// //   fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
// // };

// const checkServers = async () => {
//   for (const server of monitoredServers) {
//     // Ensure we have an array to push logs into:
//     const serverLogs = logData[server.name] || [];

//     const start = Date.now();
//     try {
//       let status, messageSnippet;

//       // ─────────────────────────────────────────────
//       // If this is RAGAPP, use axios + cookie‐jar to follow Streamlit’s redirect chain.
//       if (server.name === "RAGAPP") {
//         // 1) Dynamically import axios‐cookiejar‐support (ESM) at runtime
//         const { wrapper } = await import("axios-cookiejar-support");
//         // 2) Create a fresh cookie jar for this single request
//         const cookieJar = new tough.CookieJar();
//         // 3) Wrap an axios instance so it uses our cookieJar
//         const client = wrapper(
//           axios.create({
//             jar: cookieJar,
//             withCredentials: true, // ← important: send cookies on cross‐domain redirects
//           })
//         );

//         // 4) Perform the GET with browser‐like headers
//         const response = await client.get(server.url, {
//           maxRedirects: 10,
//           headers: {
//             // Fake a desktop Chrome UA so Streamlit doesn’t treat us like a bot
//             "User-Agent":
//               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
//               "AppleWebKit/537.36 (KHTML, like Gecko) " +
//               "Chrome/115.0.0.0 Safari/537.36",
//             Accept:
//               "text/html,application/xhtml+xml,application/xml;q=0.9," +
//               "image/avif,image/webp,image/apng,*/*;q=0.8",
//             "Accept-Language": "en-US,en;q=0.9",
//             "Accept-Encoding": "gzip, deflate, br",
//             Referer: server.url,
//           },
//           timeout: 15000,
//         });

//         status = response.status;
//         // Take the first 100 chars (or however many you want) as a “message snippet”
//         messageSnippet = (typeof response.data === "string"
//           ? response.data
//           : "")
//           .slice(0, 100);
//       }
//       // ─────────────────────────────────────────────
//       // Otherwise, use the standard fetch() for all other URLs:
//       else {
//         const response = await fetch(server.url, { method: "GET" });
//         const text = await response.text();
//         status = response.status;
//         messageSnippet = text.slice(0, 100);
//       }

//       const end = Date.now();
//       serverLogs.push({
//         url: server.url,
//         status: status,
//         timestamp: new Date().toISOString(),
//         message: messageSnippet,
//         responseTime: end - start, // in milliseconds
//       });
//     } catch (error) {
//       const end = Date.now();
//       serverLogs.push({
//         url: server.url,
//         status: "Error",
//         timestamp: new Date().toISOString(),
//         message: error.message,
//         responseTime: end - start,
//       });
//     }

//     // Only keep the last 50 entries per server:
//     logData[server.name] = serverLogs.slice(-50);
//   }

//   // Write out the JSON to disk (overwriting the file each time):
//   fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
// };



// // ✅ Check servers every 5 minutes
// setInterval(checkServers, 60* 1000);
// checkServers(); // Initial check on startup

// // ✅ Serve logs
// app.get('/details', (req, res) => {
//   if (fs.existsSync(logFile)) {
//     const data = fs.readFileSync(logFile);
//     res.header('Content-Type', 'application/json');
//     res.send(data);
//   } else {
//     res.status(404).json({ error: 'No log file found.' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
//   console.log(`📊 Monitor dashboard at http://localhost:${PORT}/status`);
//   console.log(`📁 View external server logs at http://localhost:${PORT}/details`);
// });


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const tough = require('tough-cookie');
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
  { name: 'RAGAPP',   url: 'https://grokbot.streamlit.app/' },
  { name: 'server1',  url: 'https://aixinterview.onrender.com' },
  { name: 'server2',  url: 'https://aixinterview-hbui.onrender.com/' },
  { name: 'chatApp',  url: 'https://www.chat.karthik.top/' },
  { name: 'FlaskApp', url: 'https://collegify.pythonanywhere.com/' },
  { name: 'BioValut_API', url: 'https://karthik3116-deepface-api.hf.space/' },
  { name: 'BioValut_SERVER', url: 'https://biovault-txua.onrender.com/' },
  
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

const checkServers = async () => {
  for (const server of monitoredServers) {
    // Ensure we have an array to push logs into:
    const serverLogs = logData[server.name] || [];

    const start = Date.now();
    try {
      let status, messageSnippet;

      // ─────────────────────────────────────────────
      // If this is RAGAPP, use axios + cookie‐jar to follow Streamlit’s redirect chain.
      if (server.name === 'RAGAPP') {
        // 1) Dynamically import axios‐cookiejar‐support (ESM) at runtime
        const { wrapper } = await import('axios-cookiejar-support');
        // 2) Create a fresh cookie jar for this single request
        const cookieJar = new tough.CookieJar();
        // 3) Wrap an axios instance so it uses our cookieJar
        const client = wrapper(
          axios.create({
            jar: cookieJar,
            withCredentials: true, // ← important: send cookies on cross‐domain redirects
          })
        );

        // 4) Perform the GET with browser‐like headers
        const response = await client.get(server.url, {
          maxRedirects: 10,
          headers: {
            // Fake a desktop Chrome UA so Streamlit doesn’t treat us like a bot
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
              'AppleWebKit/537.36 (KHTML, like Gecko) ' +
              'Chrome/115.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,' +
              'image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Referer: server.url,
          },
          timeout: 15000,
        });

        status = response.status;
        // Take the first 100 chars (or however many you want) as a “message snippet”
        messageSnippet = (typeof response.data === 'string'
          ? response.data
          : ''
        ).slice(0, 100);
      }
      // ─────────────────────────────────────────────
      // Otherwise, use the standard fetch() for all other URLs:
      else {
        const response = await fetch(server.url, { method: 'GET' });
        const text = await response.text();
        status = response.status;
        messageSnippet = text.slice(0, 100);
      }

      const end = Date.now();
      serverLogs.push({
        url: server.url,
        status: status,
        timestamp: new Date().toISOString(),
        message: messageSnippet,
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

    // Only keep the last 50 entries per server:
    logData[server.name] = serverLogs.slice(-20);
  }

  // Write out the JSON to disk (overwriting the file each time):
  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
};

// ✅ Check servers every 5 minutes
setInterval(checkServers, 5*60 * 1000);
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
