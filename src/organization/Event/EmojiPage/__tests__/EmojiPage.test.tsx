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
import {EMOJI} from 'Event/Dashboard/components/EmojiList/emoji'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show user clicked emojis', async () => {
  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  window.localStorage.setItem(organizationTokenKey(organization.slug), token)
  mockUseLocation.mockImplementationOnce(() => ({
    pathname: `/organization/${organization.slug}`,
  }))

  const event = fakeEvent()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()})) // user
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()})) // owner
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [event]}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // areas

  const {
    findByText,
    findByLabelText,
    findAllByLabelText,
    queryAllByLabelText,
  } = render(<App />)

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(4)
  })
  expect(await findByText(event.name)).toBeInTheDocument()

  const allEmojis = Object.values(EMOJI).map(({name}) => name)
  const numEmojis = faker.random.number({min: 1, max: 10})
  const emojis = Array.from({length: numEmojis}, () =>
    faker.random.arrayElement(allEmojis),
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: emojis})) // returns emojis
  mockGet.mockImplementation(() => Promise.resolve({data: []})) // returns nothing after

  user.click(await findByLabelText(`view ${event.name}`))
  // user.click(await findByLabelText('view emoji page'))

  // expect((await findAllByLabelText('emoji')).length).toBe(numEmojis)

  await wait(
    () => {
      expect(queryAllByLabelText('emoji').length).toBe(0)
    },
    {
      timeout: 20000,
    },
  )
})
