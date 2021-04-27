import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {wait} from '@testing-library/react'
import {signInToOrganization} from 'organization/__utils__/authenticate'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('remove a team member', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({authUser, owner: authUser})

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByText, findAllByLabelText, queryByText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  user.click(await findByText(/team/i))

  expect((await findAllByLabelText('team member')).length).toBe(
    teamMembers.length,
  )

  const targetIndex = faker.random.number({min: 0, max: teamMembers.length - 1})
  const target = teamMembers[targetIndex]

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: target}))

  user.click((await findAllByLabelText('remove team member'))[targetIndex])

  await wait(() => {
    expect(queryByText(new RegExp(target.first_name))).not.toBeInTheDocument()
  })
})
