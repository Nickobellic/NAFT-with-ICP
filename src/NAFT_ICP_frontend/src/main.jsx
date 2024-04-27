import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/pages/App';
import HomePage from "./pages/HomePage";
import './index.scss';
import disableDevtool from 'disable-devtool';

// disableDevtool(); // Enable this during showcase

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
