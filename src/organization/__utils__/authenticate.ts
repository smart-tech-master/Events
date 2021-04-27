import faker from 'faker'
import {ObvioEvent} from 'Event'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {organizationTokenKey} from 'organization/auth'
import {TeamMember} from 'organization/Team'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

export function signInToOrganization(
  overrides: {
    events?: ObvioEvent[]
    authUser?: TeamMember
    owner?: TeamMember
  } = {},
) {
  const events = overrides.events || []
  const authUser = overrides.authUser || fakeTeamMember()
  const owner = overrides.owner || fakeTeamMember()

  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  // is already logged in user
  window.localStorage.setItem(organizationTokenKey(organization.slug), token)
  mockUseLocation.mockImplementationOnce(() => ({
    pathname: `/organization/${organization.slug}`,
  }))

  // Is vaild organization slug
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  // Authenticated
  mockGet.mockImplementationOnce(() => Promise.resolve({data: authUser}))
  // Organization Owner
  mockGet.mockImplementationOnce(() => Promise.resolve({data: owner}))
  // Fetch events
  mockGet.mockImplementationOnce(() => Promise.resolve({data: events}))

  return {organization, authUser, owner, token}
}
