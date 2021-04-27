import React from 'react'
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import {ThemeProvider as StyledThemeProvider} from 'styled-components'
import {spacing, breakpoints, colors, muiTheme} from 'lib/ui/theme'

export default function ThemeProvider(props: {children: React.ReactNode}) {
  return (
    <StyledThemeProvider
      theme={{
        spacing,
        breakpoints,
        colors,
      }}
    >
      <MuiThemeProvider theme={muiTheme}>{props.children}</MuiThemeProvider>
    </StyledThemeProvider>
  )
}

declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: typeof spacing
    breakpoints: typeof breakpoints
    colors: typeof colors
  }
}
