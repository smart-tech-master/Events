import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {organizationTokenKey} from 'organization/auth'
import faker from 'faker'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import App from 'App'
import {render} from '__utils__/render'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the dashboard config for an event', async () => {
  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  window.localStorage.setItem(organizationTokenKey(organization.slug), token)
  mockUseLocation.mockImplementationOnce(() => ({
    pathname: `/organization/${organization.slug}`,
  }))

  const welcomeText = 'Welcome to your custom dashboard'
  const dashboard = fakeSimpleBlog({
    welcomeText,
  })
  const event = fakeEvent({
    template: dashboard,
  })
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()})) // user
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()})) // owner
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [event]}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  const {findByText, findByLabelText} = render(<App />)

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(4)
  })
  expect(await findByText(event.name)).toBeInTheDocument()

  user.click(await findByLabelText(`view ${event.name}`))
  user.click(await findByLabelText('configure dashboard'))

  expect(await findByText(welcomeText)).toBeInTheDocument()
})
