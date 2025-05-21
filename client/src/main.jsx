// src/main.jsx (or src/index.js)
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import App from './App.jsx'; // Your App component
import './index.css'; // Your global styles
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your App component with BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);