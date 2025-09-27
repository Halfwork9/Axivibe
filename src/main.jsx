import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store'; // Adjust path as needed
import App from './App'; // Adjust to your root component (e.g., App.jsx or Router)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
