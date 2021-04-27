import {Organization} from 'organization'
import React from 'react'
import {
  createRoutesFor,
  OrganizationContext,
  useClient,
} from 'organization/OrganizationProvider'

export default function StaticOrganizationProvider(props: {
  organization: Organization
  children: React.ReactNode
}) {
  const client = useClient(props.organization)
  const routes = createRoutesFor(props.organization)

  if (!client) {
    throw new Error('Missing organization')
  }

  return (
    <OrganizationContext.Provider
      value={{
        organization: props.organization,
        routes,
        client,
      }}
    >
      {props.children}
    </OrganizationContext.Provider>
  )
}
