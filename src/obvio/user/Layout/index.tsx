import Container from '@material-ui/core/Container'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import AppBar from 'obvio/user/Layout/AppBar'
import React from 'react'

export default function Layout(props: {children: React.ReactElement}) {
  return (
    <>
      <AppBar />
      <StyledContainer maxWidth="lg">{props.children}</StyledContainer>
    </>
  )
}

const StyledContainer = withStyles({
  root: {
    paddingTop: spacing[24], // Account for fixed app bar height
  },
})(Container)
