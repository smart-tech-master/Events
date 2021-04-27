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
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('remove a role', async () => {
  signInToOrganization()

  const {findByText, findAllByLabelText, queryByText} = render(<App />)

  const roles = Array.from(
    {
      length: faker.random.number({min: 2, max: 5}),
    },
    fakeRole,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // team members
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roles}))
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [fakePermission()]}),
  )

  // Go to team page
  user.click(await findByText(/team/i))
  user.click(await findByText(/permissions/i))

  const targetIndex = faker.random.number({min: 0, max: roles.length - 1})
  const target = roles[targetIndex]
  const withoutRole = roles.filter((_, index) => index !== targetIndex)
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: withoutRole}))

  // has a checkbox per role originally
  expect((await findAllByLabelText('toggle permission')).length).toBe(
    roles.length,
  )

  // remove target
  user.click((await findAllByLabelText('remove role'))[targetIndex])

  await wait(() => {
    expect(queryByText(target.name)).not.toBeInTheDocument()
  })

  // has one less role
  expect((await findAllByLabelText('toggle permission')).length).toBe(
    roles.length - 1,
  )
})
