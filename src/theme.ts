import {createTheme} from '@mui/material/styles'
import {inter, doppler} from './font'

export {inter as roboto}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#DB0007',
      light: '#FF1A22',
      dark: '#A30005',
    },
    secondary: {
      main: '#D4A843',
      light: '#E8C96A',
      dark: '#B08A2E',
    },
    background: {
      default: '#0A0A0B',
      paper: '#111113',
    },
    text: {
      primary: '#F5F5F7',
      secondary: '#A1A1AA',
      disabled: '#71717A',
    },
    success: {main: '#22C55E'},
    warning: {main: '#EAB308'},
    error: {main: '#EF4444'},
    info: {main: '#3B82F6'},
    divider: '#2E2E38',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontFamily: doppler.style.fontFamily,
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      textTransform: 'lowercase' as const,
    },
    h2: {
      fontFamily: doppler.style.fontFamily,
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      textTransform: 'lowercase' as const,
    },
    h3: {
      fontFamily: doppler.style.fontFamily,
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      textTransform: 'lowercase' as const,
    },
    h4: {
      fontFamily: doppler.style.fontFamily,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      textTransform: 'lowercase' as const,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.005em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    button: {
      fontFamily: inter.style.fontFamily,
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111113',
          border: '1px solid #2E2E38',
          borderRadius: 12,
          transition: 'all 200ms ease',
          '&:hover': {
            borderColor: '#3A3A46',
            boxShadow:
              '0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase' as const,
          fontWeight: 600,
          letterSpacing: '0.05em',
          boxShadow: 'none',
          transition: 'transform 0.1s ease, background-color 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#FF1A22',
          },
        },
        outlinedPrimary: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '0.75rem',
          height: 28,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          '&:before': {display: 'none'},
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2A2A32',
          fontSize: '0.75rem',
          borderRadius: 4,
          padding: '6px 12px',
        },
      },
    },
  },
})

export default theme
