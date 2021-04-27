import styled from 'styled-components'
import {TeamMember} from 'organization/Team'
import React from 'react'
import DeleteIconButton from 'lib/ui/IconButton/DeleteIconButton'
import IfOwner from 'organization/auth/IfOwner'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useTeam} from 'organization/Team/TeamProvider'

export default function TeamMemberList() {
  const {members, remove: removeFromList} = useTeam()
  const removeOnServer = useRemove()
  const handleRemove = (target: TeamMember) => {
    removeOnServer(target).then(removeFromList)
  }

  const hasTeamMembers = members.length > 0
  if (!hasTeamMembers) {
    return <EmptyPlaceholder>No team members have been added.</EmptyPlaceholder>
  }

  return (
    <ul>
      {members.map((t) => (
        <Item key={t.email} aria-label="team member">
          <div>
            {t.first_name} {t.last_name} - {t.email}
          </div>
          <IfOwner>
            <DeleteIconButton
              onClick={() => handleRemove(t)}
              aria-label="remove team member"
            />
          </IfOwner>
        </Item>
      ))}
    </ul>
  )
}

function useRemove() {
  const {organization, client} = useOrganization()

  return (target: TeamMember) => {
    const url = api(
      `/organizations/${organization.slug}/team_members/${target.id}`,
    )

    return client.delete<TeamMember>(url)
  }
}

const EmptyPlaceholder = styled.p`
  text-align: center;
`

const Item = styled.li`
  display: flex;
  justify-content: space-between;
`
