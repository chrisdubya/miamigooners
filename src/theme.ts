import {createTheme} from '@mui/material/styles'
import {red} from '@mui/material/colors'
import color from 'color'
import {roboto} from './font'

export {roboto}

const darken = (clr: string, val: number) =>
  color(clr).darken(val).rgb().string()

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
