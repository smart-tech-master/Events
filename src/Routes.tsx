import React from 'react'
import {OBVIO_SUBDOMAIN} from 'App'
import {getSubdomain} from 'lib/url'
import {useOrganizationUrl} from 'organization/url'
import OrganizationProvider from 'organization/OrganizationProvider'
import OrganizationRoutes from 'organization/Routes'
import ObvioRoutes from 'obvio/Routes'
import {DomainEventProvider} from 'Event/EventProvider'
import EventRoutes from 'Event/Routes'

export default function Routes() {
  const subdomain = getSubdomain(window.location.host)
  const isObvioAppDomain = subdomain === OBVIO_SUBDOMAIN
  if (!subdomain || isObvioAppDomain) {
    return <AppRoutes />
  }

  return (
    <DomainEventProvider>
      <EventRoutes />
    </DomainEventProvider>
  )
}

function AppRoutes() {
  const {isOrganizationRoute} = useOrganizationUrl()
  if (isOrganizationRoute) {
    return (
      <OrganizationProvider>
        <OrganizationRoutes />
      </OrganizationProvider>
    )
  }

  return <ObvioRoutes />
}
