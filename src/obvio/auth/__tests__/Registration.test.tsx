import App from 'App'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import faker from 'faker'
import mockAxios from 'axios'
import {wait} from '@testing-library/react'
import {fakeUser} from 'auth/user/__utils__/factory'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

it('should register, and sign in', async () => {
  const token = 'thesecrettoken'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: token}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  const {findByLabelText, findByText} = render(<App />)

  user.click(await findByLabelText('create account'))

  const email = faker.internet.email()
  const password = 'mypw'
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  user.type(await findByLabelText('first name'), firstName)
  user.type(await findByLabelText('last name'), lastName)
  user.type(await findByLabelText('email'), email)
  user.type(await findByLabelText('password'), password)
  user.type(await findByLabelText('password confirmation'), password)

  user.click(await findByLabelText('register'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  // Submitted correct data
  const data = mockPost.mock.calls[0][1]
  expect(data.email).toBe(email)
  expect(data.first_name).toBe(firstName)
  expect(data.last_name).toBe(lastName)
  expect(data.password).toBe(password)
  expect(data.password_confirmation).toBe(password)

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  // token saved
  expect(window.localStorage.getItem('__obvio_user_token__')).toBe(token)

  // Requested user?
  const authHeader = mockGet.mock.calls[0][1]['headers']['Authorization']
  expect(authHeader).toBe(`Bearer ${token}`)

  expect(await findByText('Logout')).toBeInTheDocument()
})
