import Events from 'organization/EventList'
import CreateEventForm from 'organization/EventList/CreateEventForm'
import {RouteEventProvider} from 'Event/EventProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useOrganization} from 'organization/OrganizationProvider'
import EventRoutes from 'organization/Event/EventRoutes'
import Team from 'organization/Team'

export default function UserRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      {/*
          Handle login redirect. Placed first here, rather than on login success to
          avoid hitting the event catch-all below, and getting a React
          render error .
        */}
      <Redirect path={routes.login} to={routes.events.root} />

      <Route path={routes.events.create}>
        <CreateEventForm />
      </Route>
      <Route path={routes.events.root} exact>
        <Events />
      </Route>
      <Route path={routes.team}>
        <Team />
      </Route>
      <Route path={routes.events[':event'].root}>
        <RouteEventProvider>
          <EventRoutes />
        </RouteEventProvider>
      </Route>
      <Redirect to={routes.events.root} />
    </Switch>
  )
}
