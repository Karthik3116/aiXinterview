// import React, { useEffect, useState } from 'react';
// import { getWorkingApiBaseUrl } from '../utils/apiBase';
// import { FaServer, FaClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

// const ServerLogs = () => {
//   const [logs, setLogs] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [baseUrl, setBaseUrl] = useState('');

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const url = await getWorkingApiBaseUrl();
//         setBaseUrl(url);

//         const res = await fetch(`http://localhost:5000/details`);
//         if (!res.ok) throw new Error('Failed to fetch logs');
//         const data = await res.json();
//         setLogs(data);
//       } catch (err) {
//         setError('Unable to fetch logs. Please try again later.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//   }, []);

//   if (loading) return <div className="p-4 text-blue-600">Loading server logs...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center">📊 Server Logs</h2>
//       <p className="text-sm text-gray-500 text-center mb-4">Source: <code>{baseUrl}/details</code></p>

//       {Object.entries(logs).map(([serverName, entries]) => (
//         <div key={serverName} className="mb-8 bg-white rounded-xl shadow p-4 border">
//           <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
//             <FaServer className="text-indigo-600" />
//             {serverName}
//           </h3>

//           <div className="max-h-96 overflow-y-auto space-y-3">
//             {entries.slice().reverse().map((entry, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-md border ${
//                   entry.status === 200
//                     ? 'bg-green-50 border-green-400'
//                     : entry.status === 'Error'
//                     ? 'bg-red-50 border-red-400'
//                     : 'bg-yellow-50 border-yellow-400'
//                 }`}
//               >
//                 <div className="flex items-center gap-2 text-sm font-medium">
//                   {entry.status === 200 ? (
//                     <FaCheckCircle className="text-green-500" />
//                   ) : (
//                     <FaExclamationCircle className="text-red-500" />
//                   )}
//                   <span>{entry.status}</span>
//                 </div>
//                 <div className="text-sm text-gray-700 mt-1">
//                   <span className="font-semibold">Message:</span> {entry.message}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                   <FaClock />
//                   {new Date(entry.timestamp).toLocaleString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ServerLogs;

// import React, { useEffect, useState } from 'react';
// import { getWorkingApiBaseUrl } from '../utils/apiBase';
// import { FaServer, FaClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts';

// const ServerLogs = () => {
//   const [logs, setLogs] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [baseUrl, setBaseUrl] = useState('');

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const url = await getWorkingApiBaseUrl();
//         setBaseUrl(url);
//         const res = await fetch(`http://localhost:5000/details`);
//         if (!res.ok) throw new Error('Failed to fetch logs');
//         const data = await res.json();
//         setLogs(data);
//       } catch (err) {
//         setError('Unable to fetch logs. Please try again later.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//     const intervalId = setInterval(fetchLogs, 5000); // refresh every 5 seconds
//     return () => clearInterval(intervalId);
//   }, []);

//   if (loading) return <div className="p-4 text-blue-600">Loading server logs...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center">📊 Server Logs (Latency)</h2>
//       <p className="text-sm text-gray-500 text-center mb-4">
//         Source: <code>{baseUrl}/details</code>
//       </p>

//       {Object.entries(logs).map(([serverName, entries]) => (
//         <div key={serverName} className="mb-10 bg-white rounded-xl shadow p-4 border">
//           <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
//             <FaServer className="text-indigo-600" />
//             {serverName}
//           </h3>

//           <div className="max-h-96 overflow-y-auto space-y-3">
//             {entries.slice().reverse().map((entry, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-md border ${
//                   entry.status === 200
//                     ? 'bg-green-50 border-green-400'
//                     : entry.status === 'Error'
//                     ? 'bg-red-50 border-red-400'
//                     : 'bg-yellow-50 border-yellow-400'
//                 }`}
//               >
//                 <div className="flex items-center gap-2 text-sm font-medium">
//                   {entry.status === 200 ? (
//                     <FaCheckCircle className="text-green-500" />
//                   ) : (
//                     <FaExclamationCircle className="text-red-500" />
//                   )}
//                   <span>{entry.status}</span>
//                   {entry.responseTime !== undefined && (
//                     <span className="ml-2 text-xs text-gray-600">
//                       ({entry.responseTime} ms)
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-700 mt-1">
//                   <span className="font-semibold">Message:</span> {entry.message}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                   <FaClock />
//                   {new Date(entry.timestamp).toLocaleString()}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Graph for Response Time */}
//           <div className="h-64 mt-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={entries
//                   .slice(-20)
//                   .filter((log) => log.responseTime !== undefined)
//                   .map((log) => ({
//                     time: new Date(log.timestamp).toLocaleTimeString(),
//                     responseTime: log.responseTime,
//                   }))}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="time" />
//                 <YAxis unit="ms" allowDecimals={false} />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="responseTime"
//                   stroke="#10b981" // Tailwind green-500
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ServerLogs;

import React, { useEffect, useState, useCallback } from 'react';
import { getWorkingApiBaseUrl } from '../utils/apiBase'; // Assuming this correctly resolves your API base URL
import { FaServer, FaClock, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend // Import Legend for chart legends
} from 'recharts';

const ServerLogs = () => {
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [baseUrl, setBaseUrl] = useState('');

    // useCallback memoizes the function, preventing unnecessary re-creations
    const fetchLogs = useCallback(async () => {
        try {
            // Dynamically get API base URL for flexibility
            const dynamicBaseUrl = await getWorkingApiBaseUrl();
            setBaseUrl(dynamicBaseUrl);

            // Fetch logs from the backend
            // IMPORTANT: Use dynamicBaseUrl here, not hardcoded 'http://localhost:5000'
            const res = await fetch(`${dynamicBaseUrl}/details`);

            if (!res.ok) {
                const errorDetail = await res.text();
                throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText} - ${errorDetail}`);
            }

            const data = await res.json();

            // Process fetched data to ensure proper format for React state and charts
            const processedData = {};
            Object.keys(data).forEach(serverName => {
                // Ensure data[serverName] is an array before processing
                if (Array.isArray(data[serverName])) {
                    processedData[serverName] = data[serverName].map(entry => ({
                        ...entry,
                        // Ensure timestamp is a Date object for correct sorting and display
                        timestamp: new Date(entry.timestamp)
                    }));
                } else {
                    console.warn(`Unexpected data type for server ${serverName}:`, data[serverName]);
                    processedData[serverName] = []; // Default to empty array if unexpected
                }
            });
            setLogs(processedData);
            setError(''); // Clear any previous errors on successful fetch
        } catch (err) {
            setError(`Unable to fetch logs: ${err.message}. Please check console for more details.`);
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies needed for useCallback as getWorkingApiBaseUrl is stable

    // Effect hook for initial data fetch and setting up polling
    useEffect(() => {
        fetchLogs(); // Fetch data once on component mount

        // Set up polling interval (e.g., every 5 seconds for "live" feel)
        const intervalId = setInterval(fetchLogs, 5000); // Refresh every 5 seconds

        // Cleanup function: clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [fetchLogs]); // Re-run effect if fetchLogs changes (which it won't due to useCallback)

    // --- UI Rendering based on Loading/Error states ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-blue-600">
                <FaSpinner className="animate-spin text-4xl mb-4" />
                <p className="text-lg font-medium">Loading server logs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-600 p-8">
                <FaExclamationCircle className="text-5xl mb-4" />
                <h3 className="text-2xl font-bold mb-2">Error Loading Data</h3>
                <p className="text-lg text-center max-w-md">{error}</p>
                <p className="text-sm text-gray-500 mt-4">Please ensure your backend is running and accessible from: <code>{baseUrl}/details</code></p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
                📊 Real-time Server Monitor
            </h2>
            <p className="text-base text-gray-600 text-center mb-8">
            
            </p>

            {Object.entries(logs).length === 0 && (
                <div className="text-center text-gray-600 p-10 bg-white rounded-lg shadow-md mt-8">
                    <p className="text-lg font-semibold">No server logs available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Waiting for the first check to complete or log file might be empty.</p>
                </div>
            )}

            {Object.entries(logs).map(([serverName, entries]) => {
                // Ensure entries is an array and sort them for chronological order
                const sortedEntries = Array.isArray(entries)
                    ? [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                    : [];

                // Get the most recent entry for current status display
                const latestEntry = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;

                // Prepare data for Recharts graphs
                // Slice to get only the last 'N' entries for cleaner charts
                const chartData = sortedEntries.slice(-50).map((log) => ({
                    time: log.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    // Convert status to 1 for success (200) and 0 for error/other for plotting
                    status: log.status === 200 ? 1 : 0,
                    // Only include responseTime if it's a valid number
                    responseTime: typeof log.responseTime === 'number' && log.responseTime !== -1 ? log.responseTime : null,
                }));

                return (
                    <div key={serverName} className="mb-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
                        {/* Server Header */}
                        <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-gray-800">
                            <FaServer className="text-indigo-600 text-3xl" />
                            {serverName}
                            {latestEntry && (
                                <span
                                    className={`ml-4 text-base font-semibold px-4 py-1 rounded-full shadow-sm
                                        ${latestEntry.status === 200
                                            ? 'bg-green-100 text-green-700'
                                            : latestEntry.status === 'Error'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {latestEntry.status === 200 ? 'Online' : 'Offline / Error'}
                                </span>
                            )}
                        </h3>

                        {/* Current Status Details */}
                        {latestEntry && (
                            <div className="mb-6 text-gray-700 text-base flex flex-wrap items-center gap-x-6 gap-y-2">
                                <p className="flex items-center gap-2">
                                    <FaClock className="text-gray-500" />
                                    <span className="font-medium">Last Checked:</span> {latestEntry.timestamp.toLocaleString()}
                                </p>
                                {latestEntry.responseTime !== -1 && typeof latestEntry.responseTime === 'number' && (
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Response Time:</span>
                                        <span className="font-semibold text-indigo-600">{latestEntry.responseTime.toFixed(2)} ms</span>
                                    </p>
                                )}
                                <p className="flex items-center gap-2">
                                     <span className="font-medium">Message:</span> <span className="italic">{latestEntry.message}</span>
                                </p>
                            </div>
                        )}

                        {/* Response Time Graph */}
                        <h4 className="text-xl font-semibold mb-3 text-gray-800">Response Time (Last 50 Checks)</h4>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-72 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData.filter(d => d.responseTime !== null)} // Only plot if responseTime is available
                                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="time" interval="preserveStartEnd" tickFormatter={(tick) => tick.split(':').slice(0, 2).join(':')} />
                                    <YAxis
                                        unit="ms"
                                        allowDecimals={false}
                                        label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => [`${value.toFixed(2)} ms`, 'Response Time']}
                                        labelFormatter={(label) => `Time: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="responseTime"
                                        stroke="#22C55E" // Tailwind green-500
                                        strokeWidth={3}
                                        dot={{ r: 4 }} // Smaller dots for cleaner look
                                        activeDot={{ r: 8, strokeWidth: 2, fill: '#FFFFFF', stroke: '#22C55E' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Server Status Graph */}
                        <h4 className="text-xl font-semibold mb-3 text-gray-800">Server Status (Last 50 Checks)</h4>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="time" interval="preserveStartEnd" tickFormatter={(tick) => tick.split(':').slice(0, 2).join(':')} />
                                    <YAxis
                                        domain={[0, 1]}
                                        ticks={[0, 1]}
                                        label={{ value: 'Status (0=Down, 1=Up)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                        tickFormatter={(value) => (value === 1 ? 'Up' : 'Down')}
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => [(value === 1 ? 'Online' : 'Offline/Error'), 'Status']}
                                        labelFormatter={(label) => `Time: ${label}`}
                                    />
                                    <Line
                                        type="stepAfter" // Use stepAfter for clear status changes
                                        dataKey="status"
                                        stroke="#3B82F6" // Tailwind blue-500
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 8, strokeWidth: 2, fill: '#FFFFFF', stroke: '#3B82F6' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Log Entries */}
                        <h4 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Recent Activity Log</h4>
                        <div className="max-h-80 overflow-y-auto space-y-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            {sortedEntries.slice().reverse().map((entry, index) => ( // Displaying latest first
                                <div
                                    key={entry.timestamp.toISOString() + entry.url} // Use a unique key for list items
                                    className={`p-4 rounded-lg shadow-sm border
                                        ${entry.status === 200
                                            ? 'bg-green-50 border-green-400'
                                            : entry.status === 'Error'
                                                ? 'bg-red-50 border-red-400'
                                                : 'bg-yellow-50 border-yellow-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between text-sm font-medium mb-1">
                                        <div className="flex items-center gap-2">
                                            {entry.status === 200 ? (
                                                <FaCheckCircle className="text-green-500 text-lg" />
                                            ) : (
                                                <FaExclamationCircle className="text-red-500 text-lg" />
                                            )}
                                            <span className={`text-lg ${entry.status === 200 ? 'text-green-700' : 'text-red-700'}`}>
                                                {entry.status === 200 ? 'SUCCESS' : 'ERROR'} ({entry.status})
                                            </span>
                                        </div>
                                        {typeof entry.responseTime === 'number' && entry.responseTime !== -1 && (
                                            <span className="text-gray-600 font-normal">
                                                Response: <span className="font-semibold">{entry.responseTime.toFixed(2)} ms</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium mb-1">
                                        <span className="font-semibold text-gray-600">Message:</span> <span className="break-all">{entry.message}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaClock />
                                        {entry.timestamp.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {sortedEntries.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No recent activity logged for this server.</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ServerLogs;