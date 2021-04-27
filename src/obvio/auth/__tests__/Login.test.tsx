import App, {OBVIO_SUBDOMAIN} from 'App'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {act, wait} from '@testing-library/react'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the obvio login form', async () => {
  Object.defineProperty(window, 'location', {
    value: {
      host: `obv.io`, // Root, no subdomain
    },
  })

  const {findByLabelText, rerender} = render(<App />)

  expect(await findByLabelText('obvio account email')).toBeInTheDocument()
  expect(await findByLabelText('obvio account password')).toBeInTheDocument()

  Object.defineProperty(window, 'location', {
    value: {
      host: `${OBVIO_SUBDOMAIN}.obv.io`,
    },
  })

  rerender(<App />)

  expect(await findByLabelText('obvio account email')).toBeInTheDocument()
  expect(await findByLabelText('obvio account password')).toBeInTheDocument()
})

it('should login a user', async () => {
  const token = 'secrettoken'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: token}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  const {findByLabelText, findByText} = render(<App />)

  expect(await findByLabelText('obvio account email')).toBeInTheDocument()
  expect(await findByLabelText('obvio account password')).toBeInTheDocument()

  const email = faker.internet.email()
  const password = 'secretpw'
  user.type(await findByLabelText('obvio account email'), email)
  user.type(await findByLabelText('obvio account password'), password)

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  // Submitted correct data?
  const data = mockPost.mock.calls[0][1]
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)

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
