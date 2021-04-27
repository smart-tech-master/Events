import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'

const mockGet = axios.get as jest.Mock

it('should show team members', async () => {
  signInToOrganization()

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByText, findAllByLabelText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  user.click(await findByText(/team/i))

  expect((await findAllByLabelText('team member')).length).toBe(
    teamMembers.length,
  )
})
