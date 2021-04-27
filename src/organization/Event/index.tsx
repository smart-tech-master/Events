import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import Page from 'organization/user/Layout/Page'
import React from 'react'
import Layout from 'organization/user/Layout'
import AreaList from 'organization/Event/area/AreaList'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function Event() {
  const routes = useEventRoutes()
  const {event} = useEvent()

  return (
    <Layout>
      <Page>
        <h2>{event.name}</h2>

        <ConfigButtons>
          <RelativeLink disableStyles to={routes.waiver}>
            <Button
              variant="contained"
              color="primary"
              aria-label="configure waiver"
            >
              Configure Waiver
            </Button>
          </RelativeLink>

          <RelativeLink disableStyles to={routes.dashboard}>
            <Button
              variant="contained"
              color="primary"
              aria-label="configure dashboard"
            >
              Configure Dashboard
            </Button>
          </RelativeLink>

          <RelativeLink disableStyles to={routes.tech_check}>
            <Button
              variant="contained"
              color="primary"
              aria-label="configure tech check"
            >
              Configure Tech Check
            </Button>
          </RelativeLink>

          <RelativeLink disableStyles to={routes.attendees}>
            <Button
              variant="contained"
              color="primary"
              aria-label="view attendees"
            >
              Attendees
            </Button>
          </RelativeLink>

          <RelativeLink disableStyles to={routes.emoji}>
            <Button
              variant="contained"
              color="primary"
              aria-label="view emoji page"
            >
              Go To Emoji Page
            </Button>
          </RelativeLink>

          <RelativeLink disableStyles to={routes.speaker}>
            <Button
              variant="contained"
              color="primary"
              aria-label="configure speakers"
            >
              Configure Speakers
            </Button>
          </RelativeLink>
          <RelativeLink disableStyles to={routes.emoji}>
            <Button
              variant="contained"
              color="primary"
              aria-label="view emoji page"
            >
              Go To Emoji Page
            </Button>
          </RelativeLink>
          <RelativeLink disableStyles to={routes.areas.create}>
            <Button
              variant="contained"
              color="primary"
              aria-label="create area"
            >
              Create Area
            </Button>
          </RelativeLink>
        </ConfigButtons>
        <AreaList />
      </Page>
    </Layout>
  )
}

const ConfigButtons = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
