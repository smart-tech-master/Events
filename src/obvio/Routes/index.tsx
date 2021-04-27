import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {createRoutes} from 'lib/url'
import GuestRoutes from 'obvio/Routes/GuestRoutes'
import UserRoutes from 'obvio/Routes/UserRoutes'

export const obvioRoutes = createRoutes({
  login: '/login',
  registration: '/register',
  organizations: {
    create: '/create',
  },
})

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <div>loading...</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}
