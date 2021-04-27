import Login from 'obvio/auth/Login'
import Registration from 'obvio/auth/Registration'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function GuestRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.login}>
        <Login />
      </Route>
      <Route path={obvioRoutes.registration}>
        <Registration />
      </Route>
      <Redirect
        to={{
          pathname: obvioRoutes.login,
        }}
      />
    </Switch>
  )
}
