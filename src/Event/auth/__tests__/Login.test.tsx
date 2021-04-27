import {act, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import App, {appRoot} from 'App'
import axios from 'axios'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import React from 'react'
import {useLocation} from 'react-router-dom'
import {render} from '__utils__/render'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show event login form', async () => {
  const event = visitEventSite()

  const {findByText, findByLabelText} = render(<App />)

  await wait(() => {
    expect(mockGet).toBeCalledTimes(1)
  })

  expect(await findByText(event.name))
  expect(await findByLabelText(`email`)).toBeInTheDocument()
  expect(await findByLabelText(`password`)).toBeInTheDocument()

  const url = mockGet.mock.calls[0][0]
  expect(url).toBe(`${process.env.REACT_APP_API_URL}/events/${event.slug}`)
})

it('should login a user', async () => {
  visitEventSite()

  const token = 'secrettoken'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: token}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeAttendee()}))

  const {findByLabelText, findAllByText} = render(<App />)

  const email = faker.internet.email()
  const password = 'secretpw'
  user.type(await findByLabelText('email'), email)
  user.type(await findByLabelText('password'), password)

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  // // Submitted correct data?
  const data = mockPost.mock.calls[0][1]
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)

  // token saved
  expect(window.localStorage.getItem(EVENT_TOKEN_KEY)).toBe(token)

  // Requested user?
  const authHeader = mockGet.mock.calls[1][1]['headers']['Authorization']
  expect(authHeader).toBe(`Bearer ${token}`)

  // viewing waiver page
  expect((await findAllByText(/waiver/i)).length).toBeGreaterThan(0)
})

it('should login a user by token', async () => {
  const attendee = fakeAttendee({has_password: false})
  const token = 'logintoken'
  const accessToken = faker.random.alphaNumeric(8)

  visitEventSite()

  mockUseLocation.mockImplementation(() => ({
    pathname: '',
    search: `?token=${token}`,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: accessToken}}),
  )

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('password input')).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)
  expect(mockPost.mock.calls[0][1]['login_token']).toBe(token)
})

it('should handle an invalid login token', async () => {
  const attendee = fakeAttendee({has_password: false})
  const token = 'logintoken'

  visitEventSite()

  mockUseLocation.mockImplementation(() => ({
    pathname: '',
    search: `?token=${token}`,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  mockPost.mockImplementationOnce(() =>
    Promise.reject({data: {message: 'bad token'}}),
  )

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText(/email/i)).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)
  expect(mockPost.mock.calls[0][1]['login_token']).toBe(token)
})
