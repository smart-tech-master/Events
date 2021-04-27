import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import GuestRoutes from 'organization/Routes/GuestRoutes'
import OwnerProvider from 'organization/OwnerProvider'

export default function OrganizationRoutes() {
  const {user, loading} = useOrganizationAuth()

  if (loading) {
    return <div>loading...</div>
  }

  if (user) {
    return (
      <OwnerProvider>
        <UserRoutes />
      </OwnerProvider>
    )
  }

  return <GuestRoutes />
}
