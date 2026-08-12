import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Signal splash to hide once React has rendered
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('app-ready'));
  });
});
