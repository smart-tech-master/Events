import React from 'react'
import faker from 'faker'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {fakeRole} from 'organization/Team/Permissions/__utils__/factory'
import user from '@testing-library/user-event'
import {render} from '__utils__/render'
import App from 'App'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('adds a new role', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({authUser, owner: authUser})
  const {findByText, findByLabelText} = render(<App />)

  const roles = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeRole,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // team members
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roles}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // permissions

  // Go to team page
  user.click(await findByText(/team/i))
  user.click(await findByText(/permissions/i))

  const name = faker.random.word()
  const addedRole = fakeRole({name})
  mockPost.mockImplementationOnce(() => Promise.resolve({data: addedRole}))

  user.type(await findByLabelText('new role name'), name)
  user.click(await findByLabelText('add role'))

  expect(await findByText(new RegExp(name))).toBeInTheDocument()
})
