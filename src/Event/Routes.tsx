import Event from 'Event'
import {useEventAuth} from 'Event/auth'
import Login from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import Step1 from 'Event/Step1'
import Step2 from 'Event/Step2'
import Step3 from 'Event/Step3'
import {createRoutes} from 'lib/url'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Speakers from './SpeakersPage'
import UnderConstruction from './UnderConstruction'

export const eventRoutes = createRoutes({
  login: '/login',
  step1: '/step_1',
  step2: '/step_2',
  step3: '/step_3',
  speakers: '/our-speakers',
})

export default function Routes() {
  const {user, loading} = useEventAuth()
  const {event} = useEvent()

  if (!event.waiver) {
    return <UnderConstruction />
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}

function UserRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.step1}>
        <Step1 />
      </Route>
      <Route path={eventRoutes.step2}>
        <Step2 />
      </Route>
      <Route path={eventRoutes.step3}>
        <Step3 />
      </Route>
      <Route path={eventRoutes.root} exact>
        <Event />
      </Route>
      <Route path={eventRoutes.speakers} exact>
        <Speakers />
      </Route>
      <Redirect to={eventRoutes.root} />
    </Switch>
  )
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.login}>
        <Login />
      </Route>
      <Redirect to={eventRoutes.login} />
    </Switch>
  )
}
