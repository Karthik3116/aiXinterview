import React, { useEffect, useState, useCallback } from 'react';
import { getWorkingApiBaseUrl } from '../utils/apiBase'; // Adjust as needed
import {
  FaServer,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaSignal,
  FaChartLine,
  FaNetworkWired,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Utility CSS classes for cards
// Added `h-full` so that nested fixed‐height chart containers render correctly
const CARD_CONTAINER_CLASSES =
  'bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col h-full';

const ServerLogs = () => {
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  // Fetch logs from backend and process them
  const fetchLogs = useCallback(async () => {
    try {
      const dynamicBaseUrl = await getWorkingApiBaseUrl();
      setBaseUrl(dynamicBaseUrl);

      const res = await fetch(`${dynamicBaseUrl}/details`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to fetch logs: ${res.status} ${res.statusText} - ${text}`
        );
      }
      const data = await res.json();

      const processedData = {};
      Object.keys(data).forEach((serverName) => {
        if (Array.isArray(data[serverName])) {
          processedData[serverName] = data[serverName].map((entry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }));
        } else {
          processedData[serverName] = [];
        }
      });

      setLogs(processedData);
      setError('');
    } catch (err) {
      setError(`Unable to fetch logs: ${err.message}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 50000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchLogs]);

  // Helper functions to compute summary metrics
  const computeSummary = () => {
    const serverNames = Object.keys(logs);
    const totalServers = serverNames.length;

    let onlineCount = 0;
    let totalResponseSum = 0;
    let responseCount = 0;

    serverNames.forEach((name) => {
      const entries = logs[name];
      if (Array.isArray(entries) && entries.length > 0) {
        const latest = entries[entries.length - 1];
        if (latest.status === 200) onlineCount++;
        if (
          typeof latest.responseTime === 'number' &&
          latest.responseTime >= 0
        ) {
          totalResponseSum += latest.responseTime;
          responseCount++;
        }
      }
    });

    const averageResponse =
      responseCount > 0 ? totalResponseSum / responseCount : 0;

    return {
      totalServers,
      onlineCount,
      offlineCount: totalServers - onlineCount,
      averageResponse: averageResponse.toFixed(2),
    };
  };

  // Build a global time series of average response time across all servers
  const buildGlobalChartData = () => {
    // Align timestamps by rounding to minute: "HH:MM"
    const allEntries = [];
    Object.values(logs).forEach((entries) => {
      entries.forEach((entry) => {
        if (
          typeof entry.responseTime === 'number' &&
          entry.responseTime >= 0
        ) {
          const timeKey = entry.timestamp
            .toLocaleTimeString('en-US', { hour12: false })
            .split(':')
            .slice(0, 2)
            .join(':'); // e.g. "14:05"
          allEntries.push({ timeKey, responseTime: entry.responseTime });
        }
      });
    });

    // Group by timeKey
    const grouped = {};
    allEntries.forEach(({ timeKey, responseTime }) => {
      if (!grouped[timeKey]) grouped[timeKey] = [];
      grouped[timeKey].push(responseTime);
    });

    // Compute average for each timeKey and sort chronologically
    const result = Object.keys(grouped)
      .map((t) => {
        const arr = grouped[t];
        const sum = arr.reduce((a, b) => a + b, 0);
        const avg = sum / arr.length;
        return { time: t, avgResponse: Number(avg.toFixed(2)) };
      })
      .sort((a, b) => {
        const [hA, mA] = a.time.split(':').map(Number);
        const [hB, mB] = b.time.split(':').map(Number);
        return hA === hB ? mA - mB : hA - hB;
      });

    return result;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-blue-600">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="text-lg font-medium">Loading ServerLogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-600 p-8">
        <FaExclamationCircle className="text-5xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">Error Loading ServerLogs</h3>
        <p className="text-lg text-center max-w-md">{error}</p>
        <p className="text-sm text-gray-500 mt-4">
          Ensure backend is running at: <code>{baseUrl}/details</code>
        </p>
      </div>
    );
  }

  // Compute summary and global data
  const { totalServers, onlineCount, offlineCount, averageResponse } =
    computeSummary();
  const globalChartData = buildGlobalChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ===== ServerLogs Header ===== */}
      <header className="mb-8">
        <br /><br /><br /><br /><br />
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-2">
          🌐 Server Monitoring Dashboard
        </h1>
        <p className="text-center text-gray-600">
          Real-time overview of uptime and response times
        </p>
      </header>

      {/* ===== Summary Metrics ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center gap-4">
          <FaNetworkWired className="text-indigo-600 text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Total Servers</p>
            <p className="text-3xl font-bold text-gray-800">{totalServers}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center gap-4">
          <FaCheckCircle className="text-green-600 text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Online</p>
            <p className="text-3xl font-bold text-green-800">{onlineCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center gap-4">
          <FaExclamationCircle className="text-red-600 text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Offline / Error</p>
            <p className="text-3xl font-bold text-red-800">{offlineCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center gap-4">
          <FaSignal className="text-yellow-600 text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Avg. Response Time</p>
            <p className="text-3xl font-bold text-yellow-800">
              {averageResponse} ms
            </p>
          </div>
        </div>
      </section>

      {/* ===== Global Response Time Chart ===== */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartLine className="text-indigo-600" />
          Global Avg. Response Time
        </h2>
        <div className="h-64 bg-gray-50 rounded-lg p-4 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={globalChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                tickFormatter={(tick) => tick}
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                unit="ms"
                allowDecimals={false}
                tickFormatter={(v) => v}
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip
                formatter={(value) => [`${value.toFixed(2)} ms`, 'Avg Response']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend verticalAlign="top" />
              <Line
                type="monotone"
                dataKey="avgResponse"
                name="Avg Response"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: '#FFFFFF',
                  stroke: '#10B981',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== Per-Server Detail Panels ===== */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Individual Server Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(logs).map(([serverName, entries]) => {
            const sortedEntries = Array.isArray(entries)
              ? [...entries].sort((a, b) => a.timestamp - b.timestamp)
              : [];
            const latestEntry =
              sortedEntries.length > 0
                ? sortedEntries[sortedEntries.length - 1]
                : null;

            // Build per-server chart data (last 50)
            const chartData = sortedEntries.slice(-50).map((log) => ({
              time: log.timestamp
                .toLocaleTimeString('en-US', { hour12: false })
                .split(':')
                .slice(0, 2)
                .join(':'), // e.g. "14:05"
              status: log.status === 200 ? 1 : 0,
              responseTime:
                typeof log.responseTime === 'number' && log.responseTime >= 0
                  ? log.responseTime
                  : null,
            }));

            // Compute moving average for each entry
            const movingAvgData = [];
            let sumSoFar = 0;
            let countSoFar = 0;
            chartData.forEach((item) => {
              if (item.responseTime !== null) {
                sumSoFar += item.responseTime;
                countSoFar += 1;
                movingAvgData.push({
                  time: item.time,
                  movingAvg: Number((sumSoFar / countSoFar).toFixed(2)),
                });
              }
            });

            return (
              <div key={serverName} className={CARD_CONTAINER_CLASSES}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaServer className="text-indigo-600 text-3xl" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      {serverName}
                    </h3>
                  </div>
                  {latestEntry && (
                    <span
                      className={`text-base font-semibold px-4 py-1 rounded-full shadow-sm ${
                        latestEntry.status === 200
                          ? 'bg-green-100 text-green-800'
                          : latestEntry.status === 'Error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {latestEntry.status === 200
                        ? 'Online'
                        : 'Offline/Error'}
                    </span>
                  )}
                </div>

                {/* Top Stats */}
                {latestEntry && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaClock className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Last Checked</p>
                        <p className="text-base">
                          {latestEntry.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {typeof latestEntry.responseTime === 'number' &&
                      latestEntry.responseTime >= 0 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">
                              Response Time
                            </p>
                            <p className="text-base text-indigo-600">
                              {latestEntry.responseTime.toFixed(2)} ms
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Charts Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1">
                  {/* Response Time Chart */}
                  <div className="flex flex-col">
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">
                      Response Time
                    </h4>
                    {/* Fixed height to ensure chart is visible */}
                    <div className="bg-gray-50 p-3 rounded-lg shadow-inner h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData.filter((d) => d.responseTime !== null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis
                            dataKey="time"
                            tickFormatter={(tick) => tick}
                            interval="preserveStartEnd"
                            style={{ fontSize: '0.75rem' }}
                          />
                          <YAxis
                            unit="ms"
                            allowDecimals={false}
                            tickFormatter={(v) => v}
                            style={{ fontSize: '0.75rem' }}
                          />
                          <Tooltip
                            formatter={(value) => [`${value.toFixed(2)} ms`, 'Response']}
                            labelFormatter={(label) => `Time: ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="responseTime"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                              r: 5,
                              strokeWidth: 2,
                              fill: '#FFFFFF',
                              stroke: '#10B981',
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Chart */}
                  <div className="flex flex-col">
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">
                      Uptime Status
                    </h4>
                    {/* Fixed height to ensure chart is visible */}
                    <div className="bg-gray-50 p-3 rounded-lg shadow-inner h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis
                            dataKey="time"
                            tickFormatter={(tick) => tick}
                            interval="preserveStartEnd"
                            style={{ fontSize: '0.75rem' }}
                          />
                          <YAxis
                            domain={[0, 1]}
                            ticks={[0, 1]}
                            tickFormatter={(v) => (v === 1 ? 'Up' : 'Down')}
                            style={{ fontSize: '0.75rem' }}
                          />
                          <Tooltip
                            formatter={(value) =>
                              [value === 1 ? 'Online' : 'Offline/Error', 'Status']
                            }
                            labelFormatter={(label) => `Time: ${label}`}
                          />
                          <Line
                            type="stepAfter"
                            dataKey="status"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                              r: 5,
                              strokeWidth: 2,
                              fill: '#FFFFFF',
                              stroke: '#3B82F6',
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Moving Average Chart */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">
                    Moving Avg. Response
                  </h4>
                  {/* Fixed height to ensure chart is visible */}
                  <div className="bg-gray-50 p-3 rounded-lg shadow-inner h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={movingAvgData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="time"
                          tickFormatter={(tick) => tick}
                          interval="preserveStartEnd"
                          style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                          unit="ms"
                          allowDecimals={false}
                          tickFormatter={(v) => v}
                          style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value.toFixed(2)} ms`, 'Avg']}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="movingAvg"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 5,
                            strokeWidth: 2,
                            fill: '#FFFFFF',
                            stroke: '#F59E0B',
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="flex flex-col">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">
                    Recent Activity
                  </h4>
                  <div className="overflow-y-auto max-h-48 space-y-3">
                    {sortedEntries.length > 0 ? (
                      sortedEntries.slice(-10).reverse().map((entry) => (
                        <div
                          key={`${entry.timestamp.toISOString()}-${entry.url}`}
                          className={`p-3 rounded-lg border ${
                            entry.status === 200
                              ? 'bg-green-50 border-green-300'
                              : entry.status === 'Error'
                              ? 'bg-red-50 border-red-300'
                              : 'bg-yellow-50 border-yellow-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              {entry.status === 200 ? (
                                <FaCheckCircle className="text-green-500" />
                              ) : (
                                <FaExclamationCircle className="text-red-500" />
                              )}
                              <span
                                className={`font-medium ${
                                  entry.status === 200
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}
                              >
                                {entry.status === 200 ? 'SUCCESS' : 'ERROR'} (
                                {entry.status})
                              </span>
                            </div>
                            {typeof entry.responseTime === 'number' &&
                              entry.responseTime >= 0 && (
                                <span className="text-sm text-gray-600">
                                  {entry.responseTime.toFixed(2)} ms
                                </span>
                              )}
                          </div>
                          <p className="text-sm text-gray-800 italic mb-1 break-all">
                            {entry.message}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock /> {entry.timestamp.toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No recent activity.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServerLogs;
