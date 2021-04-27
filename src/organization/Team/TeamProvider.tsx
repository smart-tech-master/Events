import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {TeamMember} from 'organization/Team'
import React, {useCallback, useEffect, useState} from 'react'

interface TeamContextProps {
  loading: boolean
  members: TeamMember[]
  add: (teamMember: TeamMember) => void
  remove: (teamMember: TeamMember) => void
}

const TeamContext = React.createContext<TeamContextProps | undefined>(undefined)

export default function TeamProvider(props: {children: React.ReactNode}) {
  const fetchTeamMembers = useFetchTeamMembers()
  const {data: savedMembers, loading} = useAsync(fetchTeamMembers)
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    if (!savedMembers) {
      return
    }

    setMembers(savedMembers)
  }, [savedMembers])

  const add = (teamMember: TeamMember) => {
    setMembers([teamMember, ...members])
  }

  const remove = (target: TeamMember) => {
    const updated = members.filter((tm) => tm.id !== target.id)
    setMembers(updated)
  }

  if (loading) {
    return null
  }

  return (
    <TeamContext.Provider
      value={{
        loading,
        members,
        add,
        remove,
      }}
    >
      {props.children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = React.useContext(TeamContext)
  if (context === undefined) {
    throw new Error(`useTeam must be used within a TeamProvider`)
  }

  return context
}

function useFetchTeamMembers() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/team_members`)
    return client.get<TeamMember[]>(url)
  }, [organization, client])
}
