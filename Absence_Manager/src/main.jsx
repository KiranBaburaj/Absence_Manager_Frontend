// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create the root

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
