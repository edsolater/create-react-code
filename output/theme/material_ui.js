import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { grey, amber } from '@material-ui/core/colors'

const defaultSpacing = 8

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      // default: '#222',
      paper: '#353535'
    },
    primary: {
      main: grey[900]
    },
    secondary: {
      main: amber['A400']
    },
    text: {
      primary: '#eee'
    }
  },
  spacing: {
    unit: defaultSpacing,
    gutter: defaultSpacing * 3
  },
  typography: { useNextVariants: true },
  overrides: {
    MuiPaper: {
      root: {
        background: '#353535',
        padding: defaultSpacing,
        marginBottom: defaultSpacing * 3
      }
    },
    MuiCard: {
      root: {
        background: 'rgba(255, 255, 255, 0.1)',
        marginRight: defaultSpacing,
        marginBottom: defaultSpacing
      }
    }
  }
  // overrides: {
  //   // Name of the component ⚛️ / style sheet
  //   MuiButton: {
  //     // Name of the rule
  //     text: {
  //       // Some CSS
  //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //       borderRadius: 3,
  //       border: 0,
  //       color: 'white',
  //       height: 48,
  //       padding: '0 30px',
  //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  //     },
  //   },
  // },
  // props: {
  //   // Name of the component ⚛️
  //   MuiButtonBase: {
  //     // The properties to apply
  //   },
  // },
})

function ThemeNesting({ children }) {
  return <ThemeProvider theme={theme}>{children} </ThemeProvider>
}

export default ThemeNesting
