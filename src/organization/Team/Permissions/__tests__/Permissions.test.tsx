import axios from 'axios'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import {
  fakePermission,
  fakeRole,
} from 'organization/Team/Permissions/__utils__/factory'

const mockGet = axios.get as jest.Mock

it('should show permissions table', async () => {
  signInToOrganization()

  const {findByText, findAllByLabelText} = render(<App />)

  const roles = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeRole,
  )

  const permissions = Array.from(
    {
      length: faker.random.number({min: 1, max: 3}),
    },
    fakePermission,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // team members
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roles}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: permissions}))

  // Go to team page
  user.click(await findByText(/team/i))
  user.click(await findByText(/permissions/i))

  // shows all rows
  for (const role of roles) {
    expect(await findByText(new RegExp(role.name))).toBeInTheDocument()
  }

  // shows all permissions
  for (const permission of permissions) {
    expect(await findByText(new RegExp(permission))).toBeInTheDocument()
  }

  // shows permission checkbox
  const numCheckboxes = roles.length * permissions.length
  expect((await findAllByLabelText('toggle permission')).length).toBe(
    numCheckboxes,
  )
})
