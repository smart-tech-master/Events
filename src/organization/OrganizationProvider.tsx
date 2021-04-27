import {client, RequestOptions} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api, createRoutes} from 'lib/url'
import {Organization} from 'organization'
import {organizationTokenKey} from 'organization/auth'
import {obvioClient} from 'obvio/obvio-client'
import React, {useCallback, useMemo} from 'react'
import {useLocation} from 'react-router-dom'

export type OrganizationClient = NonNullable<ReturnType<typeof useClient>>
export type OrganizationRoutes = ReturnType<typeof createRoutesFor>

interface OrganizationContextProps {
  organization: Organization
  routes: OrganizationRoutes
  client: OrganizationClient
}

export const OrganizationContext = React.createContext<
  OrganizationContextProps | undefined
>(undefined)

export default function OrganizationProvider(props: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const slug = location.pathname.split('/')[2]

  const find = useCallback(() => {
    return findOrganization(slug)
  }, [slug])
  const {data: organization, loading} = useAsync(find)
  const client = useClient(organization)

  if (loading) {
    return null
  }

  if (!organization || !client) {
    return (
      <div>
        <h1>404 - Organization '{slug}' not found.</h1>
      </div>
    )
  }

  const routes = createRoutesFor(organization)

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        routes,
        client,
      }}
    >
      {props.children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = React.useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within a OrganizationProvider',
    )
  }

  return context
}

export function createRoutesFor(organization: Organization) {
  return createRoutes(
    {
      login: '/login',
      team: '/team',
      events: {
        create: '/create',
        ':event': {
          dashboard: '/dashboard',
          waiver: '/waiver',
          emoji: '/emoji',
          speaker: '/speaker',
          tech_check: '/tech_check',
          attendees: '/attendees',
          areas: {
            create: '/create',
            ':area': {
              rooms: {
                create: '/create',
                ':room': {},
              },
            },
          },
        },
      },
    },
    // Namespace
    `organization/${organization.slug}`,
  )
}

export function useClient(
  organization: Organization | null,
): typeof client | null {
  return useMemo(() => {
    if (!organization) {
      return null
    }

    const tokenKey = organizationTokenKey(organization.slug)
    return {
      get: (url: string, options?: RequestOptions) =>
        client.get(url, {...options, tokenKey}),
      post: (url: string, data: {}, options?: RequestOptions) =>
        client.post(url, data, {...options, tokenKey}),
      put: (url: string, data: {}, options?: RequestOptions) =>
        client.put(url, data, {...options, tokenKey}),
      patch: (url: string, data: {} = {}, options?: RequestOptions) =>
        client.patch(url, data, {...options, tokenKey}),
      delete: (url: string, options?: RequestOptions) =>
        client.delete(url, {...options, tokenKey}),
    }
  }, [organization])
}

function findOrganization(slug: string) {
  const url = api(`/organizations/${slug}`)
  return obvioClient.get<Organization>(url)
}
