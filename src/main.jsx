
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// react-beautiful-dnd might have issues with React.StrictMode in dev.
// If issues persist, consider removing StrictMode for development
// or conditionally applying it. For now, keeping it.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
