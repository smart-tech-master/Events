import MomentUtils from '@date-io/moment'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import React from 'react'

export default function Providers(props: {
  children: React.ReactNode
  // Allows passing in a mocked store provider for tests
  storeProvider: React.FunctionComponent<{children: React.ReactNode}>
}) {
  const StoreProvider = props.storeProvider

  return (
    <StoreProvider>
      <ThemeProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {props.children}
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
