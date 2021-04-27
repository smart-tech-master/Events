import {User} from 'auth/user'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganizationAuth} from 'organization/auth'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'

type OwnerContextProps = User

const OwnerContext = React.createContext<OwnerContextProps | undefined>(
  undefined,
)

export default function OwnerProvider(props: {children: React.ReactNode}) {
  const {organization, client} = useOrganization()

  const fetch = useCallback(() => {
    const url = api(`/organizations/${organization.slug}/owner`)
    return client.get<User>(url)
  }, [organization, client])

  const {data: owner, loading} = useAsync(fetch)

  if (loading) {
    return <div>loading...</div>
  }

  if (!owner) {
    throw new Error(
      `Failed to fetch owner for organization: ${organization.slug}`,
    )
  }

  return (
    <OwnerContext.Provider value={owner}>
      {props.children}
    </OwnerContext.Provider>
  )
}

export function useOwner() {
  const context = React.useContext(OwnerContext)
  if (context === undefined) {
    throw new Error(`useOwner must be used within a OwnerProvider`)
  }

  return context
}

export function useIsOwner() {
  const owner = useOwner()
  const {user} = useOrganizationAuth()

  if (!user || !owner) {
    return false
  }

  return user.email === owner.email
}
