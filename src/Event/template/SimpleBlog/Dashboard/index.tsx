import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {User} from 'auth/user'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Event/template/SimpleBlog/Dashboard/BlogPosts'
import Sidebar from 'Event/template/SimpleBlog/Dashboard/Sidebar'
import {withStyles} from '@material-ui/core'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import MainNav from 'Event/template/SimpleBlog/Dashboard/MainNav'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import WelcomeText, {
  WELCOME_TEXT,
} from 'Event/template/SimpleBlog/Dashboard/WelcomeText'

export default function SimpleBlogDashboard(props: {user: User}) {
  return (
    <SimpleBlogPage user={props.user}>
      <EditComponent component={{type: WELCOME_TEXT}}>
        <WelcomeText />
      </EditComponent>
      <MainNavButtons>
        <Grid container spacing={2}>
          <MainNav />
        </Grid>
      </MainNavButtons>
      <FullHeightGrid container spacing={4}>
        <Hidden mdUp>
          <Grid item xs={12}>
            <Sidebar />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={8}>
          <BlogPosts />
        </Grid>
        <Hidden smDown>
          <Grid item xs={12} md={4}>
            <Sidebar />
          </Grid>
        </Hidden>
      </FullHeightGrid>
    </SimpleBlogPage>
  )
}

const MainNavButtons = styled.div`
  margin-bottom: 30px;
`

const FullHeightGrid = withStyles({
  root: {
    flex: 1,
  },
})(Grid)
