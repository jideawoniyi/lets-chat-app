// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#757575', // A medium grey shade for primary elements
      contrastText: '#fff', // White text for better readability on primary elements
    },
    secondary: {
      main: '#bdbdbd', // A lighter grey for secondary elements
      contrastText: '#000', // Black text for contrast on secondary elements
    },
    background: {
      default: '#121212', // Dark background color for the entire app
      paper: '#1a1a1a', // Slightly lighter dark shade for components like Paper
    },
    text: {
      primary: '#fff', // White text for primary typography
      secondary: '#ccc', // Light grey for secondary text, less prominent
    }
  },
  // Additional theme customizations can go here (e.g., typography, overrides)
});

export default theme;
