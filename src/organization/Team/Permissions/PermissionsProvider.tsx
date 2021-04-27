import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'

export type Permission = string

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

interface PermissionsContextProps {
  permissions: Permission[]
  roles: Role[]
  addRole: (role: Role) => void
  removeRole: (role: Role) => void
  updateRole: (role: Role) => void
}

const PermissionsContext = React.createContext<
  PermissionsContextProps | undefined
>(undefined)

export default function PermissionsProvider(props: {
  children: React.ReactNode
}) {
  const [roles, setRoles] = useState<Role[]>([])
  const fetchRoles = useFetchRoles()
  const fetchPermissions = useFetchPermissions()
  const {data: fetchedRoles, loading: loadingRoles} = useAsync(fetchRoles)
  const {data: permissions, loading: loadingPermissions} = useAsync(
    fetchPermissions,
  )

  const loading = loadingRoles || loadingPermissions

  useEffect(() => {
    if (!fetchedRoles) {
      return
    }

    setRoles(fetchedRoles)
  }, [fetchedRoles])

  const add = (role: Role) => {
    setRoles([...roles, role])
  }

  const remove = (target: Role) => {
    const updated = roles.filter((r) => r.id !== target.id)
    setRoles(updated)
  }

  const update = (target: Role) => {
    const updated = roles.map((r) => {
      const isTarget = r.id === target.id
      if (!isTarget) {
        return r
      }

      return target
    })
    setRoles(updated)
  }

  if (loading) {
    return null
  }

  return (
    <PermissionsContext.Provider
      value={{
        permissions: permissions || [],
        roles,
        addRole: add,
        removeRole: remove,
        updateRole: update,
      }}
    >
      {props.children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = React.useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error(`usePermissions must be used within a PermissionsProvider`)
  }

  return context
}

function useFetchRoles() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/roles`)
    return client.get<Role[]>(url)
  }, [organization, client])
}

function useFetchPermissions() {
  const {client} = useOrganization()

  return useCallback(() => {
    const url = api(`/permissions`)
    return client.get<string[]>(url)
  }, [client])
}

export function useAddPermission() {
  const {client, organization} = useOrganization()

  return (role: Role, permission: Permission) => {
    const url = api(
      `/organizations/${organization.slug}/roles/${role.id}/permissions`,
    )

    return client.put<Role>(url, {permission})
  }
}

export function useRemovePermission() {
  const {client, organization} = useOrganization()

  return (role: Role, permission: Permission) => {
    const url = api(
      `/organizations/${organization.slug}/roles/${role.id}/permissions/${permission}`,
    )

    return client.delete<Role>(url)
  }
}
