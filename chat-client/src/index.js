import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Import the App component
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import the custom theme
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App /> {/* Render the App component */}
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
