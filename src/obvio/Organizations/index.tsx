import React from 'react'
import UserOrganizationsProvier from 'obvio/Organizations/UserOrganizationsProvider'
import Collection from 'obvio/Organizations/Collection'

export default function Organizations() {
  return (
    <UserOrganizationsProvier>
      <Collection />
    </UserOrganizationsProvier>
  )
}
