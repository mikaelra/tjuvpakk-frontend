import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <img src="/images/logo.png" alt="Tjuvpakk-logo" className="logo-image" />
    <App />
  </React.StrictMode>,
);
