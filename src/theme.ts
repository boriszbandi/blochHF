import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '0.05em',
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.1em',
      fontSize: '0.75rem',
      color: '#9e9e9e',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#26c6da',
        },
      },
    },
  },
});
