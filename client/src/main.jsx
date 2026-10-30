import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { BrandForgeProvider } from './state/BrandForgeContext.jsx';
import './styles.css';
import './i18n.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrandForgeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BrandForgeProvider>
  </React.StrictMode>
);
