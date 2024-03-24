import {Inter} from 'next/font/google'
import {createTheme} from '@mui/material/styles'
import {red} from '@mui/material/colors'
import color from 'color'
const darken = (clr: string, val: number) =>
  color(clr).darken(val).rgb().string()

export const roboto = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
      dark: darken('#ff0000', 0.5),
    },
    secondary: {
      main: '#000000',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
})

export default theme
