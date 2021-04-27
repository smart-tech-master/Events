import React from 'react'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {
  fakePermission,
  fakeRole,
} from 'organization/Team/Permissions/__utils__/factory'
import user from '@testing-library/user-event'
import {render} from '__utils__/render'
import App from 'App'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('toggles permissions', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({authUser, owner: authUser})
  const {findByText, findByLabelText} = render(<App />)

  const permission = fakePermission()
  const role = fakeRole({permissions: [permission]}) // start with permission

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [role]}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [permission]}))

  user.click(await findByText(/team/i))
  user.click(await findByText(/permissions/i))

  // starts checked
  expect(
    ((await findByLabelText('toggle permission')) as HTMLInputElement).checked,
  ).toBe(true)

  const withoutPermission = {...role, permissions: []}
  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: withoutPermission}),
  )

  user.click(await findByLabelText('toggle permission'))

  // is now unchecked
  expect(
    ((await findByLabelText('toggle permission')) as HTMLInputElement).checked,
  ).toBe(false)

  const withPermissionAdded = {...role, permissions: [permission]}
  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: withPermissionAdded}),
  )

  user.click(await findByLabelText('toggle permission'))

  // is now checked again
  expect(
    ((await findByLabelText('toggle permission')) as HTMLInputElement).checked,
  ).toBe(true)

  // Check that we're updating the right permission
  expect(mockDelete).toHaveBeenCalledTimes(1)
  expect(mockDelete.mock.calls[0][0]).toMatch(permission)

  expect(mockPut).toHaveBeenCalledTimes(1)
  expect(mockPut.mock.calls[0][1]['permission']).toBe(permission)
})
