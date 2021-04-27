import {fakeUser} from 'auth/user/__utils__/factory'
import {TeamMember} from 'organization/Team'

export const fakeTeamMember = (
  overrides?: Partial<TeamMember>,
): TeamMember => ({
  ...fakeUser(),
  permissions: [],
  ...overrides,
})
