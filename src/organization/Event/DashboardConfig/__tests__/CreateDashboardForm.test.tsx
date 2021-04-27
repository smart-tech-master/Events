import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {organizationTokenKey} from 'organization/auth'
import faker from 'faker'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import App from 'App'
import {inputElementFor, render} from '__utils__/render'
import {fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

const mockPost = mockRxJsAjax.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should create a new dashboard', async () => {
  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  window.localStorage.setItem(organizationTokenKey(organization.slug), token)
  mockUseLocation.mockImplementationOnce(() => ({
    pathname: `/organization/${organization.slug}`,
  }))

  const event = fakeEvent({
    template: null,
  })
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [event]}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  const {findByText, findByLabelText} = render(<App />)

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(4)
  })
  expect(await findByText(event.name)).toBeInTheDocument()

  user.click(await findByLabelText(`view ${event.name}`))
  user.click(await findByLabelText('configure dashboard'))

  fireEvent.change(inputElementFor(await findByLabelText('dashboard select')), {
    target: {
      value: SIMPLE_BLOG,
    },
  })

  const defaultWelcomeMessage = 'WELCOME TO YOUR DASHBOARD'
  expect(await findByText(defaultWelcomeMessage)).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.welcomeText).toBe(defaultWelcomeMessage)
})
