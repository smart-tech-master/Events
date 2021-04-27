import Container from '@material-ui/core/Container'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import AppBar from 'organization/user/Layout/AppBar'
import React from 'react'

export default function Layout(props: {children: React.ReactElement}) {
  return (
    <>
      <AppBar />
      <StyledContainer maxWidth={false} disableGutters>
        {props.children}
      </StyledContainer>
    </>
  )
}

const StyledContainer = withStyles({
  root: {
    paddingTop: spacing[16], // Account for fixed app bar height
  },
})(Container)
