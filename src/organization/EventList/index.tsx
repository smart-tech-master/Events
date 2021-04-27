import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {useAsync} from 'lib/async'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'
import Card from 'organization/EventList/Card'
import Page from 'organization/user/Layout/Page'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'

export default function Events() {
  const {organization, routes, client} = useOrganization()

  const fetch = useCallback(() => {
    const url = api(`/organizations/${organization.slug}/events`)
    return client.get<ObvioEvent[]>(url)
  }, [client, organization])

  const {data: events, loading} = useAsync(fetch)
  if (loading || !events) {
    return null
  }

  const empty = events.length === 0
  if (empty) {
    return (
      <Layout>
        <EmptyBox>
          <p>No events have been created</p>
          <RelativeLink to={routes.events.create} disableStyles>
            <Button variant="outlined" color="primary">
              Create Event
            </Button>
          </RelativeLink>
        </EmptyBox>
      </Layout>
    )
  }

  return (
    <Layout>
      <Page>
        <Header>
          <RelativeLink to={routes.events.create} disableStyles>
            <Button variant="contained" color="primary">
              Create
            </Button>
          </RelativeLink>
        </Header>
        {events.map((e) => (
          <Card key={e.id} event={e} />
        ))}
      </Page>
    </Layout>
  )
}

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`

const Header = styled.div`
  text-align: right;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
