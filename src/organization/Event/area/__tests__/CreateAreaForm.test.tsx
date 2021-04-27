import {goToEvent} from 'organization/Event/__utils__/event'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeArea} from 'organization/Event/area/AreaList/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should create a new area', async () => {
  const {event} = goToEvent({areas: []})
  const {findByLabelText, findByText} = render(<App />)

  user.click(await findByLabelText(`view ${event.name}`))
  user.click(await findByLabelText('create area'))

  const name = faker.random.word()
  const requiresApproval = faker.random.boolean()
  const allowsMultipleDevices = faker.random.boolean()

  user.type(await findByLabelText('area name input'), name)

  if (!requiresApproval) {
    // Requires approval is 'on' by default, so we only need to toggle 'off'
    // manually
    user.click(
      await findByLabelText('toggle requires approval to join meeting'),
    )
  }

  if (allowsMultipleDevices) {
    user.click(await findByLabelText('toggle allows multiple devices'))
  }

  const area = fakeArea()
  // Successfully created
  mockPost.mockImplementationOnce(() => Promise.resolve({data: area}))
  // Newly created area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))
  // rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText('create area'))

  expect(await findByText(new RegExp(`Area: ${area.name}`))).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)
  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/${event.slug}/areas`)
  expect(data.name).toBe(name)

  if (allowsMultipleDevices) {
    expect(data.allows_multiple_devices).toBe(true)
  }

  if (requiresApproval) {
    expect(data.requires_approval).toBe(true)
  }
})
