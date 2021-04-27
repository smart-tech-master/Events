import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {User} from 'auth/user'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import MainTitle, {
  SPEAKERS_TITLE,
} from 'Event/template/SimpleBlog/Speakers/MainTitle'
import SpeakerList from 'Event/Speakers/components/SpeakerList'

export default function SimpleBlogSpeakers(props: {user: User}) {
  return (
    <SimpleBlogPage user={props.user}>
      <EditComponent component={{type: SPEAKERS_TITLE}}>
        <MainTitle />
      </EditComponent>
      <Speakers>
        <Grid item xs={12}>
          <SpeakerList />
        </Grid>
      </Speakers>
    </SimpleBlogPage>
  )
}

const Speakers = styled.div`
  margin-bottom: 30px;
`
