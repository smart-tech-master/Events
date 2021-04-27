import Login from 'organization/auth/Login'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function GuestRoutes() {
  const {routes} = useOrganization()
  return (
    <Switch>
      <Route path={routes.login}>
        <Login />
      </Route>
      <Redirect
        to={{
          pathname: routes.login,
        }}
      />
    </Switch>
  )
}
